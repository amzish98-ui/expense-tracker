import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { useSettings } from '../context/SettingsContext'
import { EXPENSE_CATEGORIES } from '../utils/categories'
import { formatCurrency, parseLocalDate } from '../utils/format'
import BudgetProgress from '../components/BudgetProgress'

export default function Budgets() {
  const { transactions, budgets, setBudget } = useData()
  const { currency } = useSettings()
  const [edits, setEdits] = useState({})

  const spendingByCategory = useMemo(() => {
    const now = new Date()
    const totals = {}
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      const txDate = parseLocalDate(tx.date)
      if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) continue
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount
    }
    return totals
  }, [transactions])

  const overspentCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.filter((c) => (spendingByCategory[c] || 0) > (budgets[c] || 0) && (budgets[c] || 0) > 0)
  }, [spendingByCategory, budgets])

  const handleSave = (category) => {
    const value = parseFloat(edits[category])
    if (isNaN(value) || value < 0) return
    setBudget(category, value)
    setEdits((e) => ({ ...e, [category]: undefined }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Budget Planner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set monthly spending limits and track your progress.
        </p>
      </div>

      {overspentCategories.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p className="font-semibold">⚠ Overspending Warning</p>
          <ul className="mt-1 list-disc pl-5">
            {overspentCategories.map((c) => (
              <li key={c}>
                {c} budget exceeded by{' '}
                {formatCurrency((spendingByCategory[c] || 0) - (budgets[c] || 0), currency)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Set Monthly Budgets</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPENSE_CATEGORIES.map((category) => (
            <div key={category} className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <label
                  htmlFor={`budget-${category}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {category}
                </label>
                <input
                  id={`budget-${category}`}
                  type="number"
                  min="0"
                  step="1"
                  placeholder={String(budgets[category] || 0)}
                  value={edits[category] ?? ''}
                  onChange={(e) => setEdits((ed) => ({ ...ed, [category]: e.target.value }))}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSave(category)}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 font-semibold">Budget Progress (This Month)</h2>
        <div className="flex flex-col gap-4">
          {EXPENSE_CATEGORIES.filter((c) => (budgets[c] || 0) > 0).map((category) => (
            <BudgetProgress
              key={category}
              category={category}
              spent={spendingByCategory[category] || 0}
              limit={budgets[category] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
