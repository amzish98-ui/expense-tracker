import { v4 as uuidv4 } from 'uuid'
import { toDateInputValue } from './format'

// Generates a handful of months of sample transactions so a new account
// isn't completely empty and the charts/analytics have something to show.
export function generateSeedData() {
  const transactions = []
  const today = new Date()

  const pushTx = (monthsAgo, day, type, category, description, amount) => {
    const date = new Date(today.getFullYear(), today.getMonth() - monthsAgo, day)
    transactions.push({
      id: uuidv4(),
      type,
      category,
      description,
      amount,
      date: toDateInputValue(date),
    })
  }

  for (let m = 3; m >= 0; m--) {
    pushTx(m, 1, 'income', 'Salary', 'Monthly Salary', 2200 + m * 25)
    pushTx(m, 5, 'expense', 'Housing', 'Rent', 750)
    pushTx(m, 6, 'expense', 'Utilities', 'Electricity & Gas', 85 + m * 3)
    pushTx(m, 8, 'expense', 'Food', 'Tesco Weekly Shopping', 42)
    pushTx(m, 12, 'expense', 'Food', 'Tesco Weekly Shopping', 38)
    pushTx(m, 14, 'expense', 'Transport', 'Train Pass', 95)
    pushTx(m, 15, 'expense', 'Entertainment', 'Netflix', 11)
    pushTx(m, 18, 'expense', 'Shopping', 'Clothes', 60 + m * 5)
    pushTx(m, 20, 'expense', 'Food', 'Tesco Weekly Shopping', 45)
    pushTx(m, 22, 'expense', 'Healthcare', 'Pharmacy', 18)
    if (m === 1) pushTx(m, 10, 'income', 'Freelance', 'Logo Design Project', 350)
    if (m === 0) pushTx(m, 16, 'expense', 'Entertainment', 'Cinema', 24)
  }

  return {
    transactions,
    budgets: {
      Food: 300,
      Transport: 100,
      Housing: 800,
      Utilities: 120,
      Entertainment: 80,
      Healthcare: 50,
      Education: 50,
      Shopping: 100,
      Other: 50,
    },
    goals: [
      { id: uuidv4(), name: 'New Car Fund', target: 10000, current: 4500 },
      { id: uuidv4(), name: 'Emergency Fund', target: 3000, current: 1200 },
    ],
  }
}
