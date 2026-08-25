import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AuthContext = createContext(null)
const AUTH_KEY = 'volt-auth-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Auto-login a demo user so no sign-in is ever required.
    const mockUser = {
      id: 'demo-user',
      email: 'guest@volt.local',
      full_name: 'Guest',
      role: 'admin',
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser))
    setUser(mockUser)
    setProfile(mockUser)
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    await new Promise((r) => setTimeout(r, 200))
    // Mock: accept any credentials. Create a user object.
    const mockUser = {
      id: 'mock-' + btoa(email).slice(0, 12),
      email,
      full_name: email.split('@')[0],
      role: 'admin',
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser))
    setUser(mockUser)
    setProfile(mockUser)
    return { data: { user: mockUser }, error: null }
  }

  const signUp = async (email, password, fullName) => {
    await new Promise((r) => setTimeout(r, 200))
    const mockUser = {
      id: 'mock-' + btoa(email).slice(0, 12),
      email,
      full_name: fullName || email.split('@')[0],
      role: 'admin',
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser))
    setUser(mockUser)
    setProfile(mockUser)
    return { data: { user: mockUser }, error: null }
  }

  const signOut = async () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = useCallback(() => {
    setProfile(user)
  }, [user])

  const value = {
    session: user ? { user } : null,
    user,
    profile,
    loading,
    isAdmin: true, // admin is always reachable for anyone
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
