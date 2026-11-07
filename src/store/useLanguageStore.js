import { create } from 'zustand'
import i18n from '../i18n/index.js'
import appConfig from '../config/appConfig'

const STORAGE_KEY = 'migfora_lang'
const { multiLanguage, defaultLang, supportedLangs } = appConfig.features

const isSupported = (lang) => supportedLangs.includes(lang)

const getInitialLang = () => {
  if (!multiLanguage) return defaultLang
  const saved = localStorage.getItem(STORAGE_KEY)
  return isSupported(saved) ? saved : defaultLang
}

const applyLang = (lang) => {
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  if (multiLanguage) localStorage.setItem(STORAGE_KEY, lang)
  if (i18n.language !== lang) i18n.changeLanguage(lang)
}

const useLanguageStore = create((set, get) => {
  const initial = getInitialLang()
  applyLang(initial)

  return {
    lang:      initial,
    isEnabled: multiLanguage,

    setLang: (lang) => {
      if (!multiLanguage || !isSupported(lang)) return
      applyLang(lang)
      set({ lang })
    },

    toggleLang: () => {
      if (!multiLanguage) return
      get().setLang(get().lang === 'en' ? 'ar' : 'en')
    },
  }
})

export default useLanguageStore