import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import ToastRenderer from '../components/common/ToastRenderer'
import './styles/AppLayout.css'
import useLanguageStore from '../store/useLanguageStore'

const STORAGE_KEY = 'migfora_sidebar_open'

export default function AppLayout({ children }) {
  useLanguageStore()
const [sidebarOpen, setSidebarOpen] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) return saved === 'true'
  return true
})

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <div className={`app-layout ${sidebarOpen ? 'app-layout--sidebar-open' : 'app-layout--sidebar-closed'}`}>
      <Navbar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main className="app-layout__main">
        {children}
      </main>
      {/* <Footer /> */}
      <ToastRenderer />
    </div>
  )
}