import './styles/Skeleton.css'

/**
 * Skeleton — loading placeholder
 *
 * Props:
 *   variant  — 'text' (default) | 'circle' | 'rect'
 *   size     — text: 'sm' 40% | 'md' 60% | 'lg' 80% | 'full' 100% (default)
 *              circle: 'sm' 24px | 'md' 32px (default) | 'lg' 40px
 *              rect (height): 'sm' 80px | 'md' 160px (default) | 'lg' 240px | 'full' 100%
 *   lines    — text only: renders N lines, the last one shorter
 *
 * Set aria-busy on the region that is loading.
 */
const DEFAULT_SIZE = { text: 'full', circle: 'md', rect: 'md' }

function Skeleton({ variant = 'text', size, lines = 1, className = '' }) {
  if (variant === 'text' && lines > 1) {
    return (
      <span className="skeleton-group" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <span
            key={index}
            className={`skeleton skeleton--text skeleton--${index === lines - 1 ? 'md' : 'full'}`}
          />
        ))}
      </span>
    )
  }

  return (
    <span
      className={`skeleton skeleton--${variant} skeleton--${size || DEFAULT_SIZE[variant]} ${className}`}
      aria-hidden="true"
    />
  )
}

export default Skeleton