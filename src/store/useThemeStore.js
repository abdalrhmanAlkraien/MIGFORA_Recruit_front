import { create } from 'zustand'

const getInitialTheme = () => {
  const saved = localStorage.getItem('migfora_theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('migfora_theme', theme)
}

const useThemeStore = create((set) => {
  const initial = getInitialTheme()
  applyTheme(initial)

  return {
    theme: initial,

    toggleTheme: () => {
      set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        return { theme: next }
      })
    },

    setTheme: (theme) => {
      applyTheme(theme)
      set({ theme })
    },
  }
})

export default useThemeStore