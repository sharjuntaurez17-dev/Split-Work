import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { requestNotificationPermission, notifyTodayChores, notifyRotation } from '../lib/notify'

const AppContext = createContext(null)

const MEMBERS_KEY = 'splitwork_members'
const CHORES_KEY = 'splitwork_chores'
const HISTORY_KEY = 'splitwork_history'

function loadLocal(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] }
  catch { return [] }
}

export function AppProvider({ children }) {
  const { profile } = useAuth()
  const [chores, setChores] = useState(() => loadLocal(CHORES_KEY))
  const [members, setMembers] = useState(() => loadLocal(MEMBERS_KEY))
  const [turnHistory, setTurnHistory] = useState(() => loadLocal(HISTORY_KEY))
  const [house, setHouse] = useState(null)
  const [loading, setLoading] = useState(false)

  // Auto-cleanup: remove history older than 1 month
  useEffect(() => {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const cutoff = oneMonthAgo.toISOString()
    setTurnHistory(prev => {
      const cleaned = prev.filter(h => h.date >= cutoff)
      if (cleaned.length !== prev.length) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned))
      }
      return cleaned
    })
  }, [])

  // Request notification permission and notify today's chores
  const notifSent = useRef(false)
  useEffect(() => {
    if (notifSent.current) return
    if (chores.length === 0) return
    notifSent.current = true
    requestNotificationPermission().then(granted => {
      if (granted) {
        notifyTodayChores(chores, members, turnHistory)
      }
    })
  }, [chores, members, turnHistory])

  useEffect(() => {
    if (!profile?.house_id) {
      // Local-only mode — never clear localStorage data
      return
    }

    setLoading(true)
    Promise.all([
      supabase.from('chores').select('*, assignee:profiles!chores_assignee_id_fkey(name)').eq('house_id', profile.house_id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('house_id', profile.house_id),
      supabase.from('houses').select('*').eq('id', profile.house_id).single(),
    ]).then(([{ data: c }, { data: m }, { data: h }]) => {
      setChores(c ?? [])
      setMembers(m ?? [])
      setHouse(h)
      setLoading(false)
    })

    // Realtime subscription
    const channel = supabase
      .channel(`chores-${profile.house_id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'chores', filter: `house_id=eq.${profile.house_id}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // fetch with assignee join
            const { data } = await supabase
              .from('chores')
              .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
              .eq('id', payload.new.id)
              .single()
            if (data) setChores(c => [data, ...c])
          }
          if (payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('chores')
              .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
              .eq('id', payload.new.id)
              .single()
            if (data) setChores(c => c.map(x => x.id === data.id ? data : x))
          }
          if (payload.eventType === 'DELETE') {
            setChores(c => c.filter(x => x.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile?.house_id])

  async function addChore({ title, assigneeId, dueDays, recurrenceDays, rotation }) {
    // If Supabase house is set, use remote
    if (profile?.house_id) {
      const { data, error } = await supabase
        .from('chores')
        .insert({
          house_id: profile.house_id,
          title,
          assignee_id: assigneeId || null,
          due_day: dueDays ?? null,
          recurrence_days: recurrenceDays ?? null,
          status: 'pending',
        })
        .select('*, assignee:profiles!chores_assignee_id_fkey(name)')
        .single()
      if (error) throw error
      return data
    }
    // Local-only mode — rotation stores the cycle of people
    const rotationList = rotation && rotation.length > 0 ? rotation : []
    const firstAssignee = rotationList.length > 0
      ? members.find(m => m.id === rotationList[0])
      : members.find(m => m.id === assigneeId)
    const chore = {
      id: crypto.randomUUID(),
      title,
      assignee_id: firstAssignee?.id || assigneeId || null,
      assignee: firstAssignee ? { name: firstAssignee.name } : null,
      due_day: dueDays ?? null,
      recurrence_days: recurrenceDays ?? null,
      rotation: rotationList,
      rotation_index: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    setChores(c => {
      const updated = [chore, ...c]
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
    return chore
  }

  async function updateChoreStatus(id, status) {
    if (profile?.house_id) {
      const { error } = await supabase
        .from('chores')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    }
    setChores(c => {
      const updated = c.map(x => {
        if (x.id !== id) return x
        // Log turn in history
        if (status === 'done' || (status === 'done' && x.rotation?.length > 1)) {
          const entry = {
            id: crypto.randomUUID(),
            choreId: x.id,
            choreTitle: x.title,
            memberId: x.assignee_id,
            memberName: x.assignee?.name ?? 'Someone',
            date: new Date().toISOString(),
          }
          setTurnHistory(prev => {
            const updated = [entry, ...prev]
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
            return updated
          })
        }
        // If marking done and chore has a rotation cycle, advance to next person
        if (status === 'done' && x.rotation && x.rotation.length > 1) {
          const nextIndex = ((x.rotation_index ?? 0) + 1) % x.rotation.length
          const nextMemberId = x.rotation[nextIndex]
          const nextMember = members.find(m => m.id === nextMemberId)
          // Send notification to next person
          if (nextMember) {
            notifyRotation(x.title, nextMember.name)
          }
          return {
            ...x,
            status: 'pending',
            rotation_index: nextIndex,
            assignee_id: nextMemberId,
            assignee: nextMember ? { name: nextMember.name } : x.assignee,
            last_done_by: x.assignee?.name ?? 'Someone',
          }
        }
        return { ...x, status }
      })
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  async function deleteChore(id) {
    if (profile?.house_id) {
      await supabase.from('chores').delete().eq('id', id)
    }
    setChores(c => {
      const updated = c.filter(x => x.id !== id)
      localStorage.setItem(CHORES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function addMember({ name, phone }) {
    const member = { id: crypto.randomUUID(), name, phone }
    setMembers(m => {
      const updated = [...m, member]
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updated))
      return updated
    })
    return member
  }

  function removeMember(id) {
    setMembers(m => {
      const updated = m.filter(x => x.id !== id)
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function getMemberStats(memberId) {
    const memberChores = chores.filter(c =>
      c.assignee_id === memberId || (c.rotation && c.rotation.includes(memberId))
    )
    const turnsThisMonth = turnHistory.filter(h => h.memberId === memberId)
    // Group turns by chore title
    const choreBreakdown = {}
    turnsThisMonth.forEach(h => {
      choreBreakdown[h.choreTitle] = (choreBreakdown[h.choreTitle] || 0) + 1
    })
    return { memberChores, turnsThisMonth, choreBreakdown }
  }

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const pendingChores = chores.filter(c => c.status === 'pending')
  const doneChores = chores.filter(c => c.status === 'done')

  return (
    <AppContext.Provider value={{
      chores,
      pendingChores,
      doneChores,
      members,
      house,
      loading,
      addChore,
      updateChoreStatus,
      deleteChore,
      addMember,
      removeMember,
      turnHistory,
      getMemberStats,
      DAY_NAMES,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
