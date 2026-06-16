import { formatCurrency, formatDate } from '../utils/format'
import { useSettings } from '../context/SettingsContext'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const { currency } = useSettings()

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No transactions found.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th scope="col" className="py-2 pr-4 font-medium">Date</th>
            <th scope="col" className="py-2 pr-4 font-medium">Description</th>
            <th scope="col" className="py-2 pr-4 font-medium">Category</th>
            <th scope="col" className="py-2 pr-4 font-medium">Amount</th>
            {(onEdit || onDelete) && <th scope="col" className="py-2 pr-4 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="py-2 pr-4 whitespace-nowrap">{formatDate(tx.date)}</td>
              <td className="py-2 pr-4">{tx.description}</td>
              <td className="py-2 pr-4">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {tx.category}
                </span>
              </td>
              <td
                className={`py-2 pr-4 font-medium whitespace-nowrap ${
                  tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'}
                {formatCurrency(Math.abs(tx.amount), currency)}
              </td>
              {(onEdit || onDelete) && (
                <td className="py-2 pr-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(tx)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
