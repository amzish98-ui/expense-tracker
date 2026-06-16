import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from './AuthContext'
import { loadJSON, saveJSON } from '../utils/storage'
import { generateSeedData } from '../utils/seedData'

const DataContext = createContext(null)

function dataKey(userId) {
  return `et_data_${userId}`
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [data, setData] = useState({ transactions: [], budgets: {}, goals: [] })

  // Tracks which userId has had its data fully loaded into state. When this
  // matches the current user, the save effect is safe to persist mutations.
  // Without this, the save effect would overwrite seed data with the empty
  // initial state, because both effects fire in the same commit when user changes.
  const readyUserRef = useRef(null)

  useEffect(() => {
    readyUserRef.current = null
    if (!user) {
      setData({ transactions: [], budgets: {}, goals: [] })
      return
    }
    const existing = loadJSON(dataKey(user.id), null)
    if (existing) {
      setData(existing)
    } else {
      const seed = generateSeedData()
      saveJSON(dataKey(user.id), seed)
      setData(seed)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    // First firing for this user: mark ready and skip — data is still the
    // pre-load empty state. All subsequent firings are real mutations.
    if (readyUserRef.current !== user.id) {
      readyUserRef.current = user.id
      return
    }
    saveJSON(dataKey(user.id), data)
  }, [data, user])

  const addTransaction = useCallback((tx) => {
    setData((d) => ({ ...d, transactions: [{ ...tx, id: uuidv4() }, ...d.transactions] }))
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      transactions: d.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) }))
  }, [])

  const setBudget = useCallback((category, limit) => {
    setData((d) => ({ ...d, budgets: { ...d.budgets, [category]: limit } }))
  }, [])

  const addGoal = useCallback((goal) => {
    setData((d) => ({ ...d, goals: [...d.goals, { ...goal, id: uuidv4() }] }))
  }, [])

  const updateGoal = useCallback((id, updates) => {
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  }, [])

  const deleteGoal = useCallback((id) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }))
  }, [])

  return (
    <DataContext.Provider
      value={{
        transactions: data.transactions,
        budgets: data.budgets,
        goals: data.goals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudget,
        addGoal,
        updateGoal,
        deleteGoal,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
