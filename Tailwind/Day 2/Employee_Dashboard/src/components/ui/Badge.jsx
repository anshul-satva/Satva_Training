const STATUS_STYLES = {
  Active:     'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'On Leave': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Terminated: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  Probation:  'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Full-time': 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
  Contract:   'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  Intern:     'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
}

export default function Badge({ text }) {
  const style = STATUS_STYLES[text] || 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${style}`}>
      {text}
    </span>
  )
}
