import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import GoalCard from '../components/GoalCard'

const CURRENCIES = [
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
]

export default function Settings() {
  const { darkMode, toggleDarkMode, currency, setCurrency } = useSettings()
  const { goals, addGoal, updateGoal, deleteGoal } = useData()
  const { user } = useAuth()
  const [newGoal, setNewGoal] = useState({ name: '', target: '' })

  const handleAddGoal = (e) => {
    e.preventDefault()
    const target = parseFloat(newGoal.target)
    if (!newGoal.name.trim() || isNaN(target) || target <= 0) return
    addGoal({ name: newGoal.name.trim(), target, current: 0 })
    setNewGoal({ name: '', target: '' })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your preferences and savings goals.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Account</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Signed in as <span className="font-medium">{user?.name}</span> ({user?.email})
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode.</p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Currency</h2>
        <div className="flex flex-col gap-1 sm:max-w-xs">
          <label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Display currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Savings Goals</h2>
        <form onSubmit={handleAddGoal} className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="goal-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Goal name
            </label>
            <input
              id="goal-name"
              type="text"
              placeholder="e.g. New Car Fund"
              value={newGoal.name}
              onChange={(e) => setNewGoal((g) => ({ ...g, name: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="goal-target" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Target amount
            </label>
            <div className="flex gap-2">
              <input
                id="goal-target"
                type="number"
                min="0"
                step="1"
                placeholder="10000"
                value={newGoal.target}
                onChange={(e) => setNewGoal((g) => ({ ...g, target: e.target.value }))}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <button
                type="submit"
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
          </div>
        </form>

        {goals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No goals yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
