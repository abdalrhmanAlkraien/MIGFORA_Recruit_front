import { useTranslation } from 'react-i18next'
import './styles/SearchInput.css'

function SearchInput({ value, onChange, placeholder, onClear }) {
  const { t } = useTranslation()

  return (
    <div className="search-input">
      <span className="search-input__icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>

      <input
        className="search-input__field"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || t('common.search')}
      />

      {onClear && value && (
        <button
          className="search-input__clear"
          type="button"
          onClick={onClear}
          aria-label={t('common.close')}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchInput