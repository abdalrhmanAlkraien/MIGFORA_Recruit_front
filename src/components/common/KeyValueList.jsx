import './styles/KeyValueList.css'

/**
 * KeyValueList — metadata pairs (Owner, Version, Model, Created…)
 *
 * Props:
 *   items       — [{ key, label, value (node), mono?, hidden? }]
 *   layout      — 'grid' (label above value, default) | 'rows' (label start, value end)
 *   columns     — grid only: 'auto' (default) | 1 | 2 | 3
 *   emptyValue  — shown for null / undefined / '' (default '—')
 */
const isEmptyValue = (value) => value === null || value === undefined || value === ''

function KeyValueList({ items = [], layout = 'grid', columns = 'auto', emptyValue = '—' }) {
  return (
    <dl className={`kv-list kv-list--${layout} kv-list--cols-${columns}`}>
      {items.filter((item) => !item.hidden).map((item) => {
        const empty = isEmptyValue(item.value)
        const valueClasses = [
          'kv-list__value',
          item.mono ? 'kv-list__value--mono' : '',
          empty ? 'kv-list__value--empty' : '',
        ].filter(Boolean).join(' ')

        return (
          <div key={item.key} className="kv-list__item">
            <dt className="kv-list__label">{item.label}</dt>
            <dd className={valueClasses}>{empty ? emptyValue : item.value}</dd>
          </div>
        )
      })}
    </dl>
  )
}

export default KeyValueList