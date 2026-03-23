import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { LayoutDashboard, Users, Settings, Zap, X } from 'lucide-react'
import { toggleSidebar, closeMobileMenu } from '../../store/slices/uiSlice'
import useMediaQuery from '../../hooks/useMediaQuery'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users,           label: 'Employees'  },
  { to: '/settings',  icon: Settings,        label: 'Settings'   },
]

export default function Sidebar() {
  const dispatch       = useDispatch()
  const { sidebarOpen, mobileMenuOpen } = useSelector(s => s.ui)
  const isLg           = useMediaQuery('(min-width: 1024px)')

  const showOnDesktop  = isLg && sidebarOpen
  const showOnMobile   = !isLg && mobileMenuOpen

  if (!showOnDesktop && !showOnMobile) return null

  return (
    <div className={`
      ${isLg ? 'relative flex-shrink-0' : 'fixed inset-y-0 left-0 z-40 animate-slide-in-right'}
      w-60 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800
    `}>
      <div className="flex items-center justify-between h-16 px-5 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-surface-900 dark:text-white tracking-tight">Admin</span>
        </div>
        {!isLg && (
          <button
            onClick={() => dispatch(closeMobileMenu())}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500">
          Main Menu
        </p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => !isLg && dispatch(closeMobileMenu())}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-800 dark:hover:text-surface-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold">
            AP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">Anshul Panchal</p>
            <p className="text-xs text-surface-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
