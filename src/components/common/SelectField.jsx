import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Popover from './Popover'
import './styles/FormField.css'
import './styles/SelectField.css'

/**
 * SelectField — single or multi value picker using the FormField shell
 *
 * Props:
 *   label, name, error, required, disabled, placeholder — same as FormField
 *   value       — single: string | number | null · multiple: array
 *   onChange    — (value, option | options) => void   ← value, not an event
 *   options     — [{ value, label, description?, icon?, disabled? }]
 *   multiple    — boolean (default false) — selected values render as removable chips
 *   searchable  — 'auto' (search box when more than 8 options) | true | false
 */

const SEARCH_THRESHOLD = 8

function SelectField({
  label,
  name,
  value,
  onChange,
  options     = [],
  placeholder,
  error       = '',
  required    = false,
  disabled    = false,
  multiple    = false,
  searchable  = 'auto',
}) {
  const { t } = useTranslation()

  const triggerRef = useRef(null)
  const searchRef  = useRef(null)
  const listRef    = useRef(null)

  const [open, setOpen]               = useState(false)
  const [query, setQuery]             = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const fieldId = `field-${name}`
  const labelId = `${fieldId}-label`
  const listId  = `${fieldId}-listbox`

  const isEmpty         = value === null || value === undefined || value === ''
  const selectedValues  = multiple ? (value || []) : (isEmpty ? [] : [value])
  const selectedOptions = selectedValues
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean)
  const showSearch      = searchable === 'auto' ? options.length > SEARCH_THRESHOLD : searchable
  const normalizedQuery = query.trim().toLowerCase()
  const filtered        = normalizedQuery
    ? options.filter((o) => `${o.label} ${o.description || ''}`.toLowerCase().includes(normalizedQuery))
    : options

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    const selectedIndex = options.findIndex((o) => selectedValues.includes(o.value))
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    const frame = requestAnimationFrame(() => (showSearch ? searchRef.current : listRef.current)?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const handleClose = (reason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  }

  const selectOption = (option) => {
    if (!option || option.disabled || disabled) return

    if (multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value]
      onChange?.(next, options.filter((o) => next.includes(o.value)))
      return
    }

    onChange?.(option.value, option)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const moveActive = (step) => {
    if (!filtered.length) return
    let next = activeIndex
    for (let i = 0; i < filtered.length; i += 1) {
      next = (next + step + filtered.length) % filtered.length
      if (!filtered[next].disabled) break
    }
    setActiveIndex(next)
  }

  const handleTriggerKeyDown = (e) => {
    if (disabled || open) return
    if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handlePanelKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveActive(-1) }
    if (e.key === 'Enter')     { e.preventDefault(); selectOption(filtered[activeIndex]) }
    if (e.key === 'Tab')       setOpen(false)
  }

  const fieldClasses = [
    'form-field',
    'select-field',
    error ? 'form-field--error' : '',
    disabled ? 'select-field--disabled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <span id={labelId} className="form-field__label" onClick={() => triggerRef.current?.focus()}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </span>
      )}

      <div
        ref={triggerRef}
        id={fieldId}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={label ? labelId : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`select-field__trigger ${open ? 'select-field__trigger--open' : ''}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="select-field__value">
          {selectedOptions.length === 0 && (
            <span className="select-field__placeholder">
              {placeholder || t('select.placeholder')}
            </span>
          )}

          {!multiple && selectedOptions[0] && (
            <span className="select-field__single">
              {selectedOptions[0].icon && (
                <span className="select-field__icon">{selectedOptions[0].icon}</span>
              )}
              <span className="select-field__single-label">{selectedOptions[0].label}</span>
            </span>
          )}

          {multiple && selectedOptions.map((option) => (
            <span key={option.value} className="select-field__chip">
              {option.label}
              <button
                type="button"
                tabIndex={-1}
                className="select-field__chip-remove"
                aria-label={`${t('common.remove')} ${option.label}`}
                onClick={(e) => { e.stopPropagation(); selectOption(option) }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </span>
          ))}
        </span>

        <span className="select-field__chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>

      {error && <span className="form-field__error-msg">{error}</span>}

      <Popover open={open} anchorRef={triggerRef} onClose={handleClose} matchWidth>
        <div className="select-field__panel" onKeyDown={handlePanelKeyDown}>
          {showSearch && (
            <div className="select-field__search">
              <input
                ref={searchRef}
                type="text"
                className="select-field__search-input"
                value={query}
                placeholder={t('common.search')}
                aria-controls={listId}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-multiselectable={multiple}
            aria-activedescendant={filtered.length ? `${listId}-${activeIndex}` : undefined}
            className="select-field__list"
          >
            {filtered.length === 0 && (
              <li className="select-field__empty">{t('select.no_options')}</li>
            )}

            {filtered.map((option, index) => {
              const isSelected = selectedValues.includes(option.value)
              const optionClasses = [
                'select-field__option',
                index === activeIndex ? 'select-field__option--active' : '',
                isSelected ? 'select-field__option--selected' : '',
                option.disabled ? 'select-field__option--disabled' : '',
              ].filter(Boolean).join(' ')

              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={optionClasses}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  {multiple && (
                    <span className="select-field__check" aria-hidden="true">
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </span>
                  )}

                  {option.icon && <span className="select-field__icon">{option.icon}</span>}

                  <span className="select-field__option-text">
                    <span className="select-field__option-label">{option.label}</span>
                    {option.description && (
                      <span className="select-field__option-desc">{option.description}</span>
                    )}
                  </span>

                  {!multiple && isSelected && (
                    <span className="select-field__tick" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </Popover>
    </div>
  )
}

export default SelectField