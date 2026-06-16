import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { useData } from '../context/DataContext'
import { useSettings } from '../context/SettingsContext'
import { CATEGORY_COLORS } from '../utils/categories'
import { formatCurrency, monthKey, monthLabel } from '../utils/format'

export default function Analytics() {
  const { transactions } = useData()
  const { currency } = useSettings()

  const categoryBreakdown = useMemo(() => {
    const totals = {}
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount
    }
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const totalExpenses = useMemo(
    () => categoryBreakdown.reduce((sum, c) => sum + c.value, 0),
    [categoryBreakdown]
  )

  const monthlyData = useMemo(() => {
    const months = {}
    for (const tx of transactions) {
      const key = monthKey(tx.date)
      if (!months[key]) months[key] = { key, label: monthLabel(tx.date), income: 0, expenses: 0 }
      if (tx.type === 'income') months[key].income += tx.amount
      else months[key].expenses += tx.amount
    }
    return Object.values(months).sort((a, b) => (a.key > b.key ? 1 : -1))
  }, [transactions])

  const balanceOverTime = useMemo(() => {
    let running = 0
    return monthlyData.map((m) => {
      running += m.income - m.expenses
      return { label: m.label, balance: Math.round(running * 100) / 100 }
    })
  }, [monthlyData])

  const topCategories = categoryBreakdown.slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualize your spending habits and financial trends.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 font-semibold">Spending by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 font-semibold">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="mb-3 font-semibold">Balance Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Line type="monotone" dataKey="balance" name="Balance" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="mb-3 font-semibold">Top Spending Categories</h2>
          {topCategories.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expense data yet.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {topCategories.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
                  <span className="font-medium">
                    {i + 1}. {c.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatCurrency(c.value, currency)}
                    {totalExpenses > 0 && (
                      <span className="ml-2 text-gray-400">
                        ({Math.round((c.value / totalExpenses) * 100)}%)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
