import { useSelector, useDispatch } from 'react-redux'
import { X, Bell} from 'lucide-react'
import { closeNotifications } from '../../store/slices/uiSlice'

const NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Employee Added', body: 'Zoe Harper has been added to Marketing.', time: '2m ago' },
  { id: 2, type: 'warning', title: 'Contract Expiring', body: "Daniel Torres's contract ends in 30 days.", time: '1h ago' },
  { id: 3, type: 'info',    title: 'Payroll Processed', body: 'March payroll has been processed.', time: '3h ago' },
  { id: 4, type: 'info',    title: 'New Leave Request', body: 'Priya Nair has requested 3 days leave.', time: '5h ago' },
]

export default function NotificationPanel() {
  const dispatch = useDispatch()
  const { notificationOpen } = useSelector(s => s.ui)

  if (!notificationOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => dispatch(closeNotifications())} />
      <div className="fixed top-0 right-0 bottom-0 w-80 z-50 bg-white dark:bg-surface-900 border-l border-surface-100 dark:border-surface-800 shadow-xl animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-surface-500" />
            <span className="font-semibold text-surface-900 dark:text-white text-sm">Notifications</span>
            <span className="px-1.5 py-0.5 text-xs font-semibold bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-md">
              {NOTIFICATIONS.length}
            </span>
          </div>
          <button
            onClick={() => dispatch(closeNotifications())}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 dark:text-surface-100">{n.title}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
