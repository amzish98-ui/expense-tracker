export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other',
]

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Housing: '#8b5cf6',
  Utilities: '#06b6d4',
  Entertainment: '#ec4899',
  Healthcare: '#10b981',
  Education: '#eab308',
  Shopping: '#f43f5e',
  Other: '#64748b',
  Salary: '#22c55e',
  Freelance: '#14b8a6',
  Investment: '#6366f1',
  Gift: '#d946ef',
}

export function categoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
