import { useState } from 'react'
import { formatCurrency } from '../utils/format'
import { useSettings } from '../context/SettingsContext'

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const { currency } = useSettings()
  const [adding, setAdding] = useState('')
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0

  const handleAdd = (e) => {
    e.preventDefault()
    const value = parseFloat(adding)
    if (isNaN(value) || value === 0) return
    onUpdate(goal.id, { current: Math.max(0, goal.current + value) })
    setAdding('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{goal.name}</h3>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {formatCurrency(goal.current, currency)} / {formatCurrency(goal.target, currency)}
      </p>
      <div className="progress-track">
        <div
          className="progress-fill bg-indigo-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.name} progress`}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{pct}% complete</p>
      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="Add amount"
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </form>
    </div>
  )
}
