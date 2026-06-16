// Financial Health Score (0-100), made up of three weighted factors:
// - Savings rate (40 pts): (income - expenses) / income, full marks at >=30% saved
// - Budget adherence (30 pts): share of budgeted categories that stayed within budget
// - Spending consistency (30 pts): how steady monthly spending is (low variance = higher score)
export function calculateFinancialScore({ income, expenses, budgets, categoryTotals, monthlyExpenses }) {
  const savingsRate = income > 0 ? (income - expenses) / income : 0
  const savingsScore = Math.max(0, Math.min(1, savingsRate / 0.3)) * 40

  const budgetCategories = Object.keys(budgets || {}).filter((c) => budgets[c] > 0)
  let budgetScore = 30
  if (budgetCategories.length > 0) {
    const withinBudget = budgetCategories.filter((c) => (categoryTotals[c] || 0) <= budgets[c]).length
    budgetScore = (withinBudget / budgetCategories.length) * 30
  }

  let consistencyScore = 30
  const values = (monthlyExpenses || []).filter((v) => v > 0)
  if (values.length > 1) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
    const stdDev = Math.sqrt(variance)
    const cv = mean > 0 ? stdDev / mean : 0
    consistencyScore = Math.max(0, Math.min(1, 1 - cv)) * 30
  }

  const total = Math.round(savingsScore + budgetScore + consistencyScore)

  return {
    total: Math.max(0, Math.min(100, total)),
    breakdown: {
      savings: Math.round(savingsScore),
      budgetAdherence: Math.round(budgetScore),
      consistency: Math.round(consistencyScore),
    },
  }
}

export function scoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Attention'
}
