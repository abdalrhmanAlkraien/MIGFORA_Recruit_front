export const toDate = (value) => {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const DIVISIONS = [
  { amount: 60,       unit: 'second' },
  { amount: 60,       unit: 'minute' },
  { amount: 24,       unit: 'hour'   },
  { amount: 7,        unit: 'day'    },
  { amount: 4.34524,  unit: 'week'   },
  { amount: 12,       unit: 'month'  },
  { amount: Infinity, unit: 'year'   },
]

export const formatRelative = (date, lang = 'en') => {
  const formatter = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  let duration = (date.getTime() - Date.now()) / 1000

  for (const { amount, unit } of DIVISIONS) {
    if (Math.abs(duration) < amount) return formatter.format(Math.round(duration), unit)
    duration /= amount
  }
  return ''
}

export const formatDateTime = (date, lang = 'en') =>
  new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(date)

export const formatDate = (date, lang = 'en') =>
  new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(date)

export const formatMonth = (value, lang = 'en') => {
  const date = toDate(/^\d{4}-\d{2}$/.test(value) ? `${value}-01T00:00:00` : value)
  return date ? new Intl.DateTimeFormat(lang, { month: 'short' }).format(date) : ''
}