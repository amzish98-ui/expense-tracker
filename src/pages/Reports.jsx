import { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useData } from '../context/DataContext'
import { useSettings } from '../context/SettingsContext'
import { formatCurrency, monthKey, monthLabel, toDateInputValue } from '../utils/format'
import { calculateFinancialScore, scoreLabel } from '../utils/financialScore'

export default function Reports() {
  const { transactions, budgets } = useData()
  const { currency } = useSettings()

  const availableMonths = useMemo(() => {
    const keys = new Set(transactions.map((tx) => monthKey(tx.date)))
    keys.add(monthKey(toDateInputValue(new Date())))
    return [...keys].sort().reverse()
  }, [transactions])

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0])

  const monthTransactions = useMemo(
    () => transactions.filter((tx) => monthKey(tx.date) === selectedMonth),
    [transactions, selectedMonth]
  )

  const { totalIncome, totalExpenses, categoryTotals } = useMemo(() => {
    let income = 0
    let expenses = 0
    const cats = {}
    for (const tx of monthTransactions) {
      if (tx.type === 'income') {
        income += tx.amount
      } else {
        expenses += tx.amount
        cats[tx.category] = (cats[tx.category] || 0) + tx.amount
      }
    }
    return { totalIncome: income, totalExpenses: expenses, categoryTotals: cats }
  }, [monthTransactions])

  const monthlyExpenseHistory = useMemo(() => {
    const months = {}
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue
      const key = monthKey(tx.date)
      months[key] = (months[key] || 0) + tx.amount
    }
    return Object.values(months)
  }, [transactions])

  const score = useMemo(
    () =>
      calculateFinancialScore({
        income: totalIncome,
        expenses: totalExpenses,
        budgets,
        categoryTotals,
        monthlyExpenses: monthlyExpenseHistory,
      }),
    [totalIncome, totalExpenses, budgets, categoryTotals, monthlyExpenseHistory]
  )

  const categoryRows = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const label = monthLabel(`${selectedMonth}-01`)

    doc.setFontSize(18)
    doc.text(`${label} Financial Report`, 14, 20)

    doc.setFontSize(11)
    doc.text(`Total Income: ${formatCurrency(totalIncome, currency)}`, 14, 32)
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses, currency)}`, 14, 40)
    doc.text(`Savings: ${formatCurrency(totalIncome - totalExpenses, currency)}`, 14, 48)
    doc.text(`Financial Health Score: ${score.total}/100 (${scoreLabel(score.total)})`, 14, 56)

    autoTable(doc, {
      startY: 64,
      head: [['Category', 'Amount']],
      body: categoryRows.map(([cat, amount]) => [cat, formatCurrency(amount, currency)]),
    })

    doc.save(`${label.replace(' ', '_')}_Financial_Report.pdf`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly summaries and financial health.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="report-month" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Month
          </label>
          <select
            id="report-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {monthLabel(`${m}-01`)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="mb-3 font-semibold">{monthLabel(`${selectedMonth}-01`)} Summary</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Total Income</dt>
              <dd className="text-xl font-bold text-emerald-600">{formatCurrency(totalIncome, currency)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</dt>
              <dd className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses, currency)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Savings</dt>
              <dd className="text-xl font-bold">{formatCurrency(totalIncome - totalExpenses, currency)}</dd>
            </div>
          </dl>

          <h3 className="mt-6 mb-2 font-semibold">Category Breakdown</h3>
          {categoryRows.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expenses recorded this month.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th scope="col" className="py-2 font-medium">Category</th>
                  <th scope="col" className="py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {categoryRows.map(([cat, amount]) => (
                  <tr key={cat}>
                    <td className="py-2">{cat}</td>
                    <td className="py-2">{formatCurrency(amount, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 font-semibold">Financial Health Score</h2>
          <div className="flex items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-emerald-500">
              <span className="text-3xl font-bold">{score.total}</span>
            </div>
          </div>
          <p className="mt-3 text-center font-medium">{scoreLabel(score.total)}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Savings Rate</span>
              <span className="font-medium">{score.breakdown.savings} / 40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Budget Adherence</span>
              <span className="font-medium">{score.breakdown.budgetAdherence} / 30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Spending Consistency</span>
              <span className="font-medium">{score.breakdown.consistency} / 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
