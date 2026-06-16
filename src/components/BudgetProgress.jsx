import { formatCurrency } from '../utils/format'
import { useSettings } from '../context/SettingsContext'

export default function BudgetProgress({ category, spent, limit }) {
  const { currency } = useSettings()
  const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
  const overspent = spent > limit
  const barColor = overspent ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{category}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category} budget usage`}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{pct}% used</span>
        {overspent && (
          <span className="font-medium text-red-600">
            Over budget by {formatCurrency(spent - limit, currency)}
          </span>
        )}
      </div>
    </div>
  )
}
