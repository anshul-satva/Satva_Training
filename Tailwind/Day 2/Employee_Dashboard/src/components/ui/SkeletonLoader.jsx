export function SkeletonBox({ className = '' }) {
  return (
    <div className={`bg-surface-100 dark:bg-surface-700 rounded-xl animate-pulse ${className}`} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-7 w-16 mt-1" />
        </div>
        <SkeletonBox className="w-10 h-10" />
      </div>
      <SkeletonBox className="h-3 w-32" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBox className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export default SkeletonBox