import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import PageHeader from '../../../shared/components/PageHeader'
import QuickBooksRefreshButton from '../../../shared/components/QuickBooksRefreshButton'

export default function Connection() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [disconnectingRealmId, setDisconnectingRealmId] = useState('')

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const res = await api.get('/quickbooks/companies')
      setCompanies(res.data.data || [])
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.inner ||
        'Failed to load companies.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleDisconnect = async (realmId) => {
    setDisconnectingRealmId(realmId)
    try {
      await api.delete(`/quickbooks/disconnect/${realmId}`)
      toast.success('QuickBooks company disconnected successfully.')
      setCompanies((current) => current.filter((company) => company.realmId !== realmId))

      const selectedRealmId = localStorage.getItem('selectedRealmId')
      if (selectedRealmId === realmId) {
        localStorage.removeItem('selectedRealmId')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to disconnect company.')
    } finally {
      setDisconnectingRealmId('')
    }
  }

  return (
    <div>
      <PageHeader
        title="Connected Companies"
        subtitle="Review all QuickBooks companies linked to your account"
      />

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="card-title d-flex align-items-center gap-2">
            <i className="bi bi-buildings-fill text-primary"></i>
            <span>QuickBooks Companies</span>
          </div>

          {loading ? (
            <div className="loading">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="empty-state">
              <p>No QuickBooks companies are currently connected.</p>
              <small className="text-secondary">Use the Connect QuickBooks button on the dashboard to add one.</small>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Company</th>
                    <th>Realm ID</th>
                    <th>Connection Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.realmId}>
                      <td>
                        <div className="fw-semibold">{company.companyName || 'Unnamed Company'}</div>
                        {company.connectedAt && (
                          <small className="text-secondary">
                            Connected: {new Date(company.connectedAt).toLocaleString()}
                          </small>
                        )}
                      </td>
                      <td><code>{company.realmId}</code></td>
                      <td>
                        <span className={`badge ${company.isConnected === false ? 'text-bg-secondary' : 'text-bg-success'}`}>
                          {company.isConnected === false ? 'Disconnected' : 'Connected'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          <QuickBooksRefreshButton
                            realmId={company.realmId}
                            onRefreshed={fetchCompanies}
                            className="btn btn-outline-primary btn-sm"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDisconnect(company.realmId)}
                            disabled={disconnectingRealmId === company.realmId}
                          >
                            <i className="bi bi-plug-fill me-1"></i>
                            {disconnectingRealmId === company.realmId ? 'Disconnecting...' : 'Disconnect'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
