import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Popover from './Popover'
import Spinner from './Spinner'
import './styles/PromptComposer.css'
import useAutoGrow from '../../store/useAutoGrow'

/**
 * PromptComposer — input for writing instructions to the AI
 *
 * Props:
 *   value / onChange  — optional controlled text (onChange receives the string)
 *   defaultValue      — initial text when uncontrolled
 *   onSend            — (text) => void. Return false to keep the text in the box
 *   onStop            — Stop button / Escape while streaming
 *   status            — 'idle' | 'sending' | 'streaming'
 *   variant           — 'full' | 'compact'
 *   placeholder
 *   maxLength         — soft limit; Send is blocked above it (e.g. 1000 for voice prompts)
 *   disabled
 *   disabledReason    — shown under the box when disabled (e.g. missing permission)
 *   context           — [{ id, label? }] chips attached to this prompt
 *   onRemoveContext   — (id) => void
 *   mentionOptions    — [{ value, label }] enables the "@" picker
 *   onAddContext      — (option) => void, called when a mention is picked
 *   toolbarStart      — node (full variant), e.g. attach button
 *   toolbarEnd        — node (full variant), e.g. model SelectField, cost badge
 *   clearOnSend       — default true
 *
 * Enter sends · Shift+Enter new line · Escape stops streaming.
 * If sending fails, restore the text through the controlled value.
 */

const MENTION_PATTERN     = /(^|\s)@([\w.-]*)$/
const MAX_MENTION_RESULTS = 8

function PromptComposer({
  value,
  onChange,
  defaultValue    = '',
  onSend,
  onStop,
  status          = 'idle',
  variant         = 'full',
  placeholder,
  maxLength,
  disabled        = false,
  disabledReason,
  context         = [],
  onRemoveContext,
  mentionOptions,
  onAddContext,
  toolbarStart,
  toolbarEnd,
  clearOnSend     = true,
}) {
  const { t } = useTranslation()

  const boxRef      = useRef(null)
  const textareaRef = useRef(null)

  const [innerValue, setInnerValue]     = useState(defaultValue)
  const [mention, setMention]           = useState(null)   // { query, start } | null
  const [mentionIndex, setMentionIndex] = useState(0)

  const isControlled = value !== undefined
  const text         = isControlled ? value : innerValue
  const isCompact    = variant === 'compact'
  const isBusy       = status !== 'idle'
  const isStreaming  = status === 'streaming'
  const hasLimit     = maxLength !== undefined
  const overLimit    = hasLimit && text.length > maxLength
  const canSend      = !disabled && !isBusy && !overLimit && text.trim().length > 0

  const contextIds     = context.map((item) => item.id)
  const mentionResults = mention && mentionOptions
    ? mentionOptions
        .filter((option) => !contextIds.includes(option.value))
        .filter((option) => `${option.value} ${option.label}`.toLowerCase().includes(mention.query.toLowerCase()))
        .slice(0, MAX_MENTION_RESULTS)
    : []

  useAutoGrow(textareaRef, text, { minRows: isCompact ? 1 : 2, maxRows: isCompact ? 4 : 10 })

  const setText = (next) => {
    if (!isControlled) setInnerValue(next)
    onChange?.(next)
  }

  const detectMention = (nextText, caret) => {
    if (!mentionOptions) return
    const match = nextText.slice(0, caret).match(MENTION_PATTERN)
    if (!match) {
      setMention(null)
      return
    }
    setMention({ query: match[2], start: caret - match[2].length - 1 })
    setMentionIndex(0)
  }

  const handleChange = (e) => {
    setText(e.target.value)
    detectMention(e.target.value, e.target.selectionStart)
  }

  const insertMention = (option) => {
    const textarea = textareaRef.current
    const caret    = textarea.selectionStart
    const start    = mention.start

    setText(text.slice(0, start) + text.slice(caret))
    setMention(null)
    onAddContext?.(option)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start)
    })
  }

  const handleSend = () => {
    if (!canSend) return
    const result = onSend?.(text.trim())
    if (clearOnSend && result !== false) setText('')
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return

    if (mentionResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex((i) => (i + 1) % mentionResults.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex((i) => (i - 1 + mentionResults.length) % mentionResults.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        insertMention(mentionResults[mentionIndex])
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
      return
    }

    if (e.key === 'Escape' && isStreaming) {
      e.preventDefault()
      onStop?.()
    }
  }

  const counter = hasLimit ? (
    <span className={`prompt-composer__count ${overLimit ? 'prompt-composer__count--over' : ''}`}>
      {text.length} / {maxLength}
    </span>
  ) : null

  const sendButton = isStreaming ? (
    <button
      type="button"
      className="prompt-composer__send prompt-composer__send--stop"
      onClick={onStop}
      aria-label={t('prompt.stop')}
      title={t('prompt.stop')}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="5" width="14" height="14" rx="2"/>
      </svg>
    </button>
  ) : (
    <button
      type="button"
      className="prompt-composer__send"
      onClick={handleSend}
      disabled={!canSend}
      aria-label={t('prompt.send')}
      title={t('prompt.send')}
    >
      {status === 'sending' ? (
        <Spinner size="sm" color="navy" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      )}
    </button>
  )

  const hint = mentionOptions ? `${t('prompt.hint')} · ${t('prompt.mention_hint')}` : t('prompt.hint')

  return (
    <div className={`prompt-composer prompt-composer--${variant} ${disabled ? 'prompt-composer--disabled' : ''}`}>
      <div ref={boxRef} className={`prompt-composer__box ${overLimit ? 'prompt-composer__box--error' : ''}`}>

        {context.length > 0 && (
          <div className="prompt-composer__context" aria-label={t('prompt.context')}>
            {context.map((item) => (
              <span key={item.id} className="prompt-composer__chip">
                <span className="prompt-composer__chip-id">{item.id}</span>
                {item.label && <span className="prompt-composer__chip-label">{item.label}</span>}
                {onRemoveContext && !disabled && (
                  <button
                    type="button"
                    className="prompt-composer__chip-remove"
                    onClick={() => onRemoveContext(item.id)}
                    aria-label={t('prompt.remove_context', { label: item.label || item.id })}
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="prompt-composer__main">
          <textarea
            ref={textareaRef}
            rows={isCompact ? 1 : 2}
            className="prompt-composer__input"
            value={text}
            onChange={handleChange}
            onSelect={(e) => detectMention(e.target.value, e.target.selectionStart)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('prompt.placeholder')}
            disabled={disabled}
            aria-invalid={overLimit}
          />
          {isCompact && sendButton}
        </div>

        {!isCompact && (
          <div className="prompt-composer__toolbar">
            <div className="prompt-composer__toolbar-start">{toolbarStart}</div>
            <div className="prompt-composer__toolbar-end">
              {counter}
              {toolbarEnd}
              {sendButton}
            </div>
          </div>
        )}
      </div>

      {disabled && disabledReason && (
        <p className="prompt-composer__note prompt-composer__note--warning">{disabledReason}</p>
      )}

      {!(disabled && disabledReason) && !isCompact && (
        <p className="prompt-composer__note">{hint}</p>
      )}

      {!(disabled && disabledReason) && isCompact && counter && (
        <p className="prompt-composer__note prompt-composer__note--end">{counter}</p>
      )}

      <Popover
        open={mention !== null}
        anchorRef={boxRef}
        onClose={() => setMention(null)}
        className="prompt-composer__mentions"
      >
        <ul role="listbox" className="prompt-composer__mention-list">
          {mentionResults.length === 0 && (
            <li className="prompt-composer__mention-empty">{t('prompt.no_matches')}</li>
          )}
          {mentionResults.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={index === mentionIndex}
              className={`prompt-composer__mention ${index === mentionIndex ? 'prompt-composer__mention--active' : ''}`}
              onMouseEnter={() => setMentionIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertMention(option)}
            >
              <span className="prompt-composer__mention-id">{option.value}</span>
              <span className="prompt-composer__mention-label">{option.label}</span>
            </li>
          ))}
        </ul>
      </Popover>
    </div>
  )
}

export default PromptComposer