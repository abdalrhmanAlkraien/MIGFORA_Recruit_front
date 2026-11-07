import { create } from 'zustand'

let _id = 0

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 3500) => {
    const id = ++_id
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

export default useToastStore