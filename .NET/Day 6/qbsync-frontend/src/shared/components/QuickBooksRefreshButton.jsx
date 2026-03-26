import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/client'

export default function QuickBooksRefreshButton({ realmId, onRefreshed, disabled = false, className = 'btn btn-outline-primary' }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (!realmId || refreshing) return

    setRefreshing(true)
    try {
      await api.post(`/quickbooks/refresh/${encodeURIComponent(realmId)}`)
      toast.success('QuickBooks token refreshed successfully.')
      await onRefreshed?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refresh QuickBooks token.')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleRefresh}
      disabled={disabled || !realmId || refreshing}
    >
      <i className="bi bi-arrow-clockwise me-2"></i>
      {refreshing ? 'Refreshing...' : 'Refresh Token'}
    </button>
  )
}
