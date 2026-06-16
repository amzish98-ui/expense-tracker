import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useSettings } from '../context/SettingsContext'
import StatCard from '../components/StatCard'
import TransactionTable from '../components/TransactionTable'
import { formatCurrency, parseLocalDate } from '../utils/format'

export default function Dashboard() {
  const { transactions } = useData()
  const { currency } = useSettings()

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalBalance = 0
    let monthlyIncome = 0
    let monthlyExpenses = 0

    for (const tx of transactions) {
      const signedAmount = tx.type === 'income' ? tx.amount : -tx.amount
      totalBalance += signedAmount

      const txDate = parseLocalDate(tx.date)
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === 'income') monthlyIncome += tx.amount
        else monthlyExpenses += tx.amount
      }
    }

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savings: monthlyIncome - monthlyExpenses,
    }
  }, [transactions])

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date))
      .slice(0, 5)
  }, [transactions])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s an overview of your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Balance" value={formatCurrency(stats.totalBalance, currency)} icon="💼" />
        <StatCard
          label="Monthly Income"
          value={formatCurrency(stats.monthlyIncome, currency)}
          icon="📈"
          accent="text-emerald-600"
        />
        <StatCard
          label="Monthly Expenses"
          value={formatCurrency(stats.monthlyExpenses, currency)}
          icon="📉"
          accent="text-red-600"
        />
        <StatCard
          label="Savings"
          value={formatCurrency(stats.savings, currency)}
          icon="🏦"
          accent={stats.savings >= 0 ? 'text-emerald-600' : 'text-red-600'}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent Transactions</h2>
          <Link to="/transactions" className="text-sm font-medium text-emerald-600 hover:underline">
            View all
          </Link>
        </div>
        <TransactionTable transactions={recentTransactions} />
      </div>
    </div>
  )
}
