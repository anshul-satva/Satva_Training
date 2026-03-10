import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users,           label: 'Employees'  },
  { to: '/settings',  icon: Settings,        label: 'Settings'   },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-800 flex">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-surface-400 dark:text-surface-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
