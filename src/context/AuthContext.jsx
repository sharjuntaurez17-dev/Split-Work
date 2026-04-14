import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const PROFILE_KEY = 'splitwork_profile'

function loadLocalProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) }
  catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(loadLocalProfile)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Try Supabase auth if configured, otherwise use local-only mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setIsLoading(false)
    }).catch(() => {
      // Supabase not configured — local-only mode
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (data) {
      setProfile(data)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data))
    }
  }

  // Local profile setter — used by EnterNameScreen (no auth needed)
  function setLocalProfile(profileData) {
    const merged = { ...profile, ...profileData }
    setProfile(merged)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged))
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signup(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
    setProfile(null)
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem('splitwork_members')
    localStorage.removeItem('splitwork_chores')
  }

  async function updateProfile(updates) {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
      if (error) throw error
    }
    setLocalProfile(updates)
  }

  async function createHouse(houseName) {
    const { data: house, error } = await supabase
      .from('houses')
      .insert({ name: houseName })
      .select()
      .single()
    if (error) throw error
    await updateProfile({ house_id: house.id })
    return house
  }

  async function joinHouse(inviteCode) {
    const { data: house, error } = await supabase
      .from('houses')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()
    if (error || !house) throw new Error('Invalid invite code')
    await updateProfile({ house_id: house.id })
    return house
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      login,
      signup,
      logout,
      updateProfile,
      setLocalProfile,
      createHouse,
      joinHouse,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
