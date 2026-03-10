import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, PanelLeft } from 'lucide-react'
import { toggleSidebar, toggleMobileMenu, toggleNotifications } from '../../store/slices/uiSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import useMediaQuery from '../../hooks/useMediaQuery'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/employees':  'Employees',
  '/settings':   'Settings',
}

export default function Navbar() {
  const dispatch    = useDispatch()
  const location    = useLocation()
  const { mode }    = useSelector(s => s.theme)
  const { notificationOpen } = useSelector(s => s.ui)
  const isLg        = useMediaQuery('(min-width: 1024px)')

  const title = PAGE_TITLES[location.pathname] || 'Employee-Admin Dashboard'

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => isLg ? dispatch(toggleSidebar()) : dispatch(toggleMobileMenu())}
          className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
        >
          {isLg ? <PanelLeft size={18} /> : <Menu size={18} />}
        </button>
        <h1 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
        >
          {mode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          onClick={() => dispatch(toggleNotifications())}
          className={`relative p-2 rounded-xl transition-colors ${
            notificationOpen
              ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
              : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
          }`}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>

        <div className="ml-1 w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold cursor-pointer">
          AD
        </div>
      </div>
    </header>
  )
}
