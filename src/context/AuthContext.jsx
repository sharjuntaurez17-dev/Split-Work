import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setUser(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    setProfile(data)
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
  }

  async function updateProfile(updates) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
    if (error) throw error
    setProfile(p => ({ ...p, ...updates }))
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
      createHouse,
      joinHouse,
      isLoading: user === undefined,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
