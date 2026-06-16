import { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadJSON, saveJSON } from '../utils/storage'
import { hashPassword } from '../utils/hash'

const USERS_KEY = 'et_users'
const SESSION_KEY = 'et_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(SESSION_KEY, null))

  const register = useCallback(async (name, email, password) => {
    const users = loadJSON(USERS_KEY, [])
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with that email already exists.')
    }
    const passwordHash = await hashPassword(password)
    const newUser = { id: uuidv4(), name, email, passwordHash }
    users.push(newUser)
    saveJSON(USERS_KEY, users)

    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    saveJSON(SESSION_KEY, session)
    setUser(session)
    return session
  }, [])

  const login = useCallback(async (email, password) => {
    const users = loadJSON(USERS_KEY, [])
    const passwordHash = await hashPassword(password)
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
    )
    if (!found) {
      throw new Error('Invalid email or password.')
    }
    const session = { id: found.id, name: found.name, email: found.email }
    saveJSON(SESSION_KEY, session)
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
