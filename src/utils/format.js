export const CURRENCY_LOCALES = {
  GBP: 'en-GB',
  USD: 'en-US',
  EUR: 'de-DE',
}

export function formatCurrency(amount, currency = 'GBP') {
  const locale = CURRENCY_LOCALES[currency] || 'en-GB'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

// "YYYY-MM-DD" strings are parsed as UTC midnight by `new Date()`, which shifts
// to the previous day in timezones behind UTC. Parse the components directly
// so dates display and group by the day/month the user actually picked.
export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(dateString) {
  const date = parseLocalDate(dateString)
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function formatShortDate(dateString) {
  const date = parseLocalDate(dateString)
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date)
}

export function monthKey(dateString) {
  const date = parseLocalDate(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(dateString) {
  const date = parseLocalDate(dateString)
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(date)
}
