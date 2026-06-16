import { useState, useEffect } from 'react'
import { categoriesForType } from '../utils/categories'
import { toDateInputValue } from '../utils/format'

const emptyForm = {
  type: 'expense',
  amount: '',
  category: categoriesForType('expense')[0],
  description: '',
  date: toDateInputValue(new Date()),
}

export default function TransactionForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialValues }))
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialValues) setForm({ ...emptyForm, ...initialValues })
  }, [initialValues])

  const handleTypeChange = (type) => {
    setForm((f) => ({ ...f, type, category: categoriesForType(type)[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.description.trim()) {
      setError('Please enter a description.')
      return
    }
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    if (!form.date) {
      setError('Please select a date.')
      return
    }
    setError('')
    onSubmit({ ...form, amount })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="tx-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Transaction Type
        </label>
        <select
          id="tx-type"
          value={form.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount
        </label>
        <input
          id="tx-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="tx-category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {categoriesForType(form.type).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <input
          id="tx-description"
          type="text"
          placeholder="e.g. Tesco Weekly Shopping"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          id="tx-date"
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {error && <p className="text-sm text-red-600 sm:col-span-2 lg:col-span-5">{error}</p>}

      <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
