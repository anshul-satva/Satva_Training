import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, PanelLeft, LogOut } from 'lucide-react'
import { toggleSidebar, toggleMobileMenu, toggleNotifications } from '../../store/slices/uiSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import { logout } from '../../store/slices/authSlice'
import useMediaQuery from '../../hooks/useMediaQuery'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/settings':  'Settings',
}

export default function Navbar() {
  const dispatch  = useDispatch()
  const location  = useLocation()
  const navigate  = useNavigate()
  const { mode }  = useSelector(s => s.theme)
  const { notificationOpen } = useSelector(s => s.ui)
  const { user }  = useSelector(s => s.auth)
  const isLg      = useMediaQuery('(min-width: 1024px)')

  const title = PAGE_TITLES[location.pathname] || 'Employee-Admin Dashboard'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

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

        <div className="w-px h-5 bg-surface-200 dark:bg-surface-700 mx-1" />

        <div className="hidden sm:flex flex-col items-end leading-tight">
          <p className="text-xs font-medium text-surface-900 dark:text-surface-100">{user?.name}</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">{user?.role}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold cursor-pointer select-none">
          {user?.name?.[0] ?? 'U'}
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-surface-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}