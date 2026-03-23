import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { removeToast } from '../../store/slices/toastSlice'

function Toast({ id, message, type }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), 3500)
    return () => clearTimeout(t)
  }, [id, dispatch])

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 rounded-xl shadow-lg px-4 py-3 min-w-[260px] animate-slide-in-up">
      {type === 'success'
        ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
        : <XCircle    size={16} className="text-rose-500 flex-shrink-0"    />
      }
      <p className="text-sm text-surface-800 dark:text-surface-100 flex-1">{message}</p>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="p-0.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { items } = useSelector(s => s.toast)
  if (!items.length) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 items-end">
      {items.map(t => <Toast key={t.id} {...t} />)}
    </div>
  )
}
