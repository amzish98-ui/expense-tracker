import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import TransactionForm from '../components/TransactionForm'
import TransactionTable from '../components/TransactionTable'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories'
import { downloadCSV } from '../utils/csv'
import { parseLocalDate } from '../utils/format'

const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])]

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingTx, setEditingTx] = useState(null)

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
    startDate: '',
    endDate: '',
  })

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => (filters.type === 'all' ? true : tx.type === filters.type))
      .filter((tx) => (filters.category === 'all' ? true : tx.category === filters.category))
      .filter((tx) =>
        filters.search ? tx.description.toLowerCase().includes(filters.search.toLowerCase()) : true
      )
      .filter((tx) => (filters.startDate ? tx.date >= filters.startDate : true))
      .filter((tx) => (filters.endDate ? tx.date <= filters.endDate : true))
      .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date))
  }, [transactions, filters])

  const handleAddNew = () => {
    setEditingTx(null)
    setShowForm(true)
  }

  const handleEdit = (tx) => {
    setEditingTx(tx)
    setShowForm(true)
  }

  const handleSubmit = (values) => {
    if (editingTx) {
      updateTransaction(editingTx.id, values)
    } else {
      addTransaction(values)
    }
    setShowForm(false)
    setEditingTx(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  const handleExportCSV = () => {
    downloadCSV(
      'transactions.csv',
      filteredTransactions.map((tx) => ({
        date: tx.date,
        description: tx.description,
        category: tx.category,
        type: tx.type,
        amount: tx.type === 'income' ? tx.amount : -tx.amount,
      })),
      ['Date', 'Description', 'Category', 'Type', 'Amount']
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add, edit, and review your income and expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleAddNew}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 font-semibold">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <TransactionForm
            initialValues={editingTx}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingTx(null)
            }}
          />
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <input
              id="filter-search"
              type="text"
              placeholder="Search description..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-start" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <input
              id="filter-start"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-end" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <input
              id="filter-end"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">All Transactions</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} result{filteredTransactions.length === 1 ? '' : 's'}
          </span>
        </div>
        <TransactionTable transactions={filteredTransactions} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}
