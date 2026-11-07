export const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) return ''
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB', 'TB']
  let size  = bytes / 1024
  let index = 0

  while (size >= 1024 && index < units.length - 1) {
    size  /= 1024
    index += 1
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[index]}`
}

/** Same rules as <input accept>: ".pdf", "image/*", "audio/mpeg" */
export const matchesAccept = (file, accept) => {
  if (!accept) return true

  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()

  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith('.'))  return name.endsWith(token)
      if (token.endsWith('/*'))   return type.startsWith(token.slice(0, -1))
      return type === token
    })
}

export const getFileKind = (type = '', name = '') => {
  const mime  = type.toLowerCase()
  const lower = name.toLowerCase()

  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime === 'application/pdf' || /\.(pdf|docx?|txt|md|rtf|odt)$/.test(lower)) return 'document'
  return 'other'
}