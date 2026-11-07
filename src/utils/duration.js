/**
 * Durations are stored in seconds everywhere.
 */

const pad = (n) => String(n).padStart(2, '0')

/**
 * parseDuration — returns seconds, null for empty input, NaN for invalid input
 * Accepts: "1:30:00", "45:00", "90" (bare number in plainUnit), "1h 30m", "45m", "30s"
 */
export const parseDuration = (raw, plainUnit = 'minutes') => {
  const text = String(raw ?? '').trim().toLowerCase()
  if (!text) return null

  if (/^\d+(\.\d+)?$/.test(text)) {
    return Math.round(Number(text) * (plainUnit === 'seconds' ? 1 : 60))
  }

  if (/^\d+(:\d{1,2}){1,2}$/.test(text)) {
    const parts = text.split(':').map(Number)
    if (parts.slice(1).some((part) => part > 59)) return NaN
    return parts.reduce((total, part) => total * 60 + part, 0)
  }

  const tokens = text.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?$/)
  if (tokens && (tokens[1] || tokens[2] || tokens[3])) {
    return Number(tokens[1] || 0) * 3600 + Number(tokens[2] || 0) * 60 + Number(tokens[3] || 0)
  }

  return NaN
}

/**
 * formatDuration — seconds → clock string
 * format: 'auto' (hours only when needed) | 'mm:ss' | 'hh:mm:ss'
 */
export const formatDuration = (seconds, format = 'auto') => {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return ''

  const total   = Math.max(0, Math.round(seconds))
  const hours   = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs    = total % 60

  const useHours = format === 'hh:mm:ss' || (format === 'auto' && hours > 0)
  return useHours
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${hours * 60 + minutes}:${pad(secs)}`
}