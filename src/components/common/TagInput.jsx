import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Popover from './Popover'
import './styles/FormField.css'
import './styles/TagInput.css'

/**
 * TagInput — free-text tags (moods, keywords, style notes)
 *
 * Props:
 *   label, name, error, required, disabled, placeholder — same as FormField
 *   value         — string[]
 *   onChange      — (string[]) => void
 *   suggestions   — string[] (optional autocomplete)
 *   maxTags       — optional limit
 *   maxTagLength  — default 40
 *   helperText    — defaults to the "Enter or comma" hint
 *
 * Enter or comma adds · Backspace on empty input removes the last tag ·
 * pasted comma lists are split · duplicates are ignored (case-insensitive) ·
 * pending text is added on blur.
 */
const MAX_SUGGESTIONS = 8

function TagInput({
  label,
  name,
  value        = [],
  onChange,
  suggestions  = [],
  maxTags,
  maxTagLength = 40,
  placeholder,
  error        = '',
  helperText,
  required     = false,
  disabled     = false,
}) {
  const { t } = useTranslation()

  const controlRef = useRef(null)
  const inputRef   = useRef(null)

  const [draft, setDraft]             = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFocused, setIsFocused]     = useState(false)
  const [dismissed, setDismissed]     = useState(false)

  const inputId     = `field-${name}`
  const lowerValues = value.map((tag) => tag.toLowerCase())
  const isFull      = maxTags !== undefined && value.length >= maxTags
  const query       = draft.trim().toLowerCase()
  const matches     = suggestions
    .filter((suggestion) => !lowerValues.includes(suggestion.toLowerCase()))
    .filter((suggestion) => !query || suggestion.toLowerCase().includes(query))
    .slice(0, MAX_SUGGESTIONS)
  const showSuggestions = isFocused && !dismissed && !isFull && !disabled && matches.length > 0

  const addTags = (raw) => {
    const candidates = raw
      .split(',')
      .map((tag) => tag.trim().slice(0, maxTagLength))
      .filter(Boolean)

    const next = [...value]
    candidates.forEach((tag) => {
      if (maxTags !== undefined && next.length >= maxTags) return
      if (next.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return
      next.push(tag)
    })

    if (next.length !== value.length) onChange?.(next)
    setDraft('')
    setActiveIndex(-1)
  }

  const removeTag = (index) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  const handleChange = (e) => {
    const raw = e.target.value
    setDismissed(false)
    if (raw.includes(',')) {
      addTags(raw)
      return
    }
    setDraft(raw)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return

    if (showSuggestions && e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % matches.length)
      return
    }
    if (showSuggestions && e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? matches.length - 1 : i - 1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (showSuggestions && activeIndex >= 0) addTags(matches[activeIndex])
      else addTags(draft)
      return
    }
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (draft.trim()) addTags(draft)
  }

  const controlClasses = [
    'tag-input__control',
    isFocused ? 'tag-input__control--focused' : '',
    disabled ? 'tag-input__control--disabled' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={`form-field tag-input ${error ? 'form-field--error' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <div ref={controlRef} className={controlClasses} onClick={() => inputRef.current?.focus()}>
        {value.map((tag, index) => (
          <span key={tag} className="tag-input__tag">
            <span className="tag-input__tag-label">{tag}</span>
            {!disabled && (
              <button
                type="button"
                tabIndex={-1}
                className="tag-input__tag-remove"
                aria-label={t('tags.remove', { tag })}
                onClick={(e) => { e.stopPropagation(); removeTag(index) }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </span>
        ))}

        {!isFull && (
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type="text"
            autoComplete="off"
            className="tag-input__input"
            value={draft}
            placeholder={value.length === 0 ? (placeholder || t('tags.placeholder')) : ''}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { setIsFocused(true); setDismissed(false) }}
            onBlur={handleBlur}
          />
        )}
      </div>

      <div className="tag-input__footer">
        {error
          ? <span className="form-field__error-msg">{error}</span>
          : <span className="form-field__helper">{helperText || t('tags.hint')}</span>}
        {maxTags !== undefined && (
          <span className="tag-input__count">{value.length} / {maxTags}</span>
        )}
      </div>

      <Popover open={showSuggestions} anchorRef={controlRef} onClose={() => setDismissed(true)} matchWidth>
        <ul role="listbox" className="tag-input__suggestions">
          {matches.map((suggestion, index) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={index === activeIndex}
              className={`tag-input__suggestion ${index === activeIndex ? 'tag-input__suggestion--active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTags(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </Popover>
    </div>
  )
}

export default TagInput