export const formatNumber = (value, lang = 'en') =>
  new Intl.NumberFormat(lang).format(value ?? 0)

export const formatCurrency = (amount, { currency = 'USD', lang = 'en', compact = false } = {}) =>
  new Intl.NumberFormat(lang, {
    style:                 'currency',
    currency,
    notation:              compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(amount ?? 0)