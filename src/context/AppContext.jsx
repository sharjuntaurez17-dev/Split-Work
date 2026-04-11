import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { profile } = useAuth()
  const [chores, setChores] = useState([])
  const [members, setMembers] = useState([])
  const [house, setHouse] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile?.house_id) {
      setChores([])
      setMembers([])
      setHouse(null)
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

  async function addChore({ title, assigneeId, dueDays, recurrenceDays }) {
    if (!profile?.house_id) throw new Error('No house')
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

  async function updateChoreStatus(id, status) {
    const { error } = await supabase
      .from('chores')
      .update({ status })
      .eq('id', id)
    if (error) throw error
    setChores(c => c.map(x => x.id === id ? { ...x, status } : x))
  }

  async function deleteChore(id) {
    await supabase.from('chores').delete().eq('id', id)
    setChores(c => c.filter(x => x.id !== id))
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
      DAY_NAMES,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
