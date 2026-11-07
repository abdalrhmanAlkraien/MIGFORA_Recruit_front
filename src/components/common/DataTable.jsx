import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckboxField from './CheckboxField'
import EmptyState from './EmptyState'
import Skeleton from './Skeleton'
import './styles/DataTable.css'

/**
 * DataTable — list pages, registries, histories
 *
 * Props:
 *   columns          — [{ key, header, render?(row), sortable?, sortValue?(row), align?: 'start'|'center'|'end', className? }]
 *                      Column widths go in page CSS through className — no inline widths.
 *   rows             — array
 *   rowKey           — field name (default 'id') or (row) => key
 *   name             — prefix for checkbox ids (default 'table')
 *   loading          — skeleton rows when empty, dimmed table when rows exist
 *   skeletonRows     — default 5
 *   emptyState       — node; default EmptyState with t('table.empty')
 *   sort / onSortChange — controlled server sort { key, direction: 'asc'|'desc' } | null.
 *                      Without onSortChange the table sorts the given rows client-side.
 *   selectable       — adds a checkbox column
 *   selectedKeys / onSelectionChange — controlled selection (array of row keys)
 *   onRowClick       — (row) => void — whole row clickable (Enter on focus)
 *   rowActions       — (row) => node — last column, e.g. <DropdownMenu />
 *   footer           — node under the table, e.g. <Pagination />
 */
const SORT_ICONS = {
  none: <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>,
  asc:  <polyline points="6 15 12 9 18 15"/>,
  desc: <polyline points="6 9 12 15 18 9"/>,
}

function DataTable({
  columns           = [],
  rows              = [],
  rowKey            = 'id',
  name              = 'table',
  loading           = false,
  skeletonRows      = 5,
  emptyState,
  sort: sortProp,
  onSortChange,
  selectable        = false,
  selectedKeys      = [],
  onSelectionChange,
  onRowClick,
  rowActions,
  footer,
}) {
  const { t } = useTranslation()

  const [internalSort, setInternalSort] = useState(null)

  const isServerSort = Boolean(onSortChange)
  const sort         = isServerSort ? sortProp : internalSort
  const getKey       = (row) => (typeof rowKey === 'function' ? rowKey(row) : row[rowKey])

  const sortedRows = useMemo(() => {
    if (!sort || isServerSort) return rows

    const column = columns.find((c) => c.key === sort.key)
    if (!column) return rows

    const getValue = column.sortValue || ((row) => row[column.key])

    return [...rows].sort((a, b) => {
      const va = getValue(a)
      const vb = getValue(b)
      if (va === null || va === undefined) return 1
      if (vb === null || vb === undefined) return -1

      const result = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' })

      return sort.direction === 'asc' ? result : -result
    })
  }, [rows, columns, sort, isServerSort])

  const pageKeys       = sortedRows.map(getKey)
  const selectedOnPage = pageKeys.filter((key) => selectedKeys.includes(key))
  const allSelected    = pageKeys.length > 0 && selectedOnPage.length === pageKeys.length
  const someSelected   = selectedOnPage.length > 0 && !allSelected
  const columnCount    = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)
  const showSkeleton   = loading && rows.length === 0

  const toggleSort = (key) => {
    const next = !sort || sort.key !== key
      ? { key, direction: 'asc' }
      : sort.direction === 'asc'
        ? { key, direction: 'desc' }
        : null

    if (isServerSort) onSortChange(next)
    else setInternalSort(next)
  }

  const toggleAll = (checked) => {
    onSelectionChange?.(checked
      ? Array.from(new Set([...selectedKeys, ...pageKeys]))
      : selectedKeys.filter((key) => !pageKeys.includes(key)))
  }

  const toggleRow = (key, checked) => {
    onSelectionChange?.(checked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key))
  }

  const handleRowKeyDown = (e, row) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) onRowClick(row)
  }

  return (
    <div className={`data-table ${loading && rows.length > 0 ? 'data-table--busy' : ''}`}>
      <div className="data-table__scroll">
        <table className="data-table__table" aria-busy={loading}>
          <thead>
            <tr>
              {selectable && (
                <th className="data-table__th data-table__th--select">
                  <CheckboxField
                    name={`${name}-select-all`}
                    ariaLabel={t('table.select_all')}
                    checked={allSelected}
                    indeterminate={someSelected}
                    disabled={pageKeys.length === 0}
                    onChange={toggleAll}
                  />
                </th>
              )}

              {columns.map((column) => {
                const isSorted  = sort?.key === column.key
                const direction = isSorted ? sort.direction : 'none'
                const thClasses = [
                  'data-table__th',
                  `data-table__th--${column.align || 'start'}`,
                  column.className,
                ].filter(Boolean).join(' ')

                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={thClasses}
                    aria-sort={isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className={`data-table__sort ${isSorted ? 'data-table__sort--active' : ''}`}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.header}
                        <span className="data-table__sort-icon" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {SORT_ICONS[direction]}
                          </svg>
                        </span>
                      </button>
                    ) : column.header}
                  </th>
                )
              })}

              {rowActions && (
                <th className="data-table__th data-table__th--actions">
                  <span className="data-table__sr-only">{t('table.actions')}</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {showSkeleton && Array.from({ length: skeletonRows }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="data-table__row">
                {selectable && <td className="data-table__td data-table__td--select"><Skeleton variant="circle" size="sm" /></td>}
                {columns.map((column) => (
                  <td key={column.key} className="data-table__td"><Skeleton size={index % 2 ? 'md' : 'lg'} /></td>
                ))}
                {rowActions && <td className="data-table__td data-table__td--actions" />}
              </tr>
            ))}

            {!loading && sortedRows.length === 0 && (
              <tr>
                <td className="data-table__empty" colSpan={columnCount}>
                  {emptyState || <EmptyState title={t('table.empty')} />}
                </td>
              </tr>
            )}

            {!showSkeleton && sortedRows.map((row) => {
              const key        = getKey(row)
              const isSelected = selectedKeys.includes(key)
              const rowClasses = [
                'data-table__row',
                onRowClick ? 'data-table__row--clickable' : '',
                isSelected ? 'data-table__row--selected' : '',
              ].filter(Boolean).join(' ')

              return (
                <tr
                  key={key}
                  className={rowClasses}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => handleRowKeyDown(e, row) : undefined}
                >
                  {selectable && (
                    <td className="data-table__td data-table__td--select" onClick={(e) => e.stopPropagation()}>
                      <CheckboxField
                        name={`${name}-select-${key}`}
                        ariaLabel={t('table.select_row')}
                        checked={isSelected}
                        onChange={(checked) => toggleRow(key, checked)}
                      />
                    </td>
                  )}

                  {columns.map((column) => {
                    const tdClasses = [
                      'data-table__td',
                      `data-table__td--${column.align || 'start'}`,
                      column.className,
                    ].filter(Boolean).join(' ')

                    return (
                      <td key={column.key} className={tdClasses}>
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    )
                  })}

                  {rowActions && (
                    <td className="data-table__td data-table__td--actions" onClick={(e) => e.stopPropagation()}>
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {footer && <div className="data-table__footer">{footer}</div>}
    </div>
  )
}

export default DataTable