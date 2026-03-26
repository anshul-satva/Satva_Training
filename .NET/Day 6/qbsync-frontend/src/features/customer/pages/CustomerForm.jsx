import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import PageHeader from '../../../shared/components/PageHeader'
import useConnectedCompanies from '../../../shared/hooks/useConnectedCompanies'

const emptyForm = {
  displayName: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: ''
}

export default function CustomerForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    companies,
    selectedRealmId,
    setSelectedRealmId,
    loadingCompanies
  } = useConnectedCompanies()

  const [form, setForm] = useState(emptyForm)
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [companyFilter, setCompanyFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(location.pathname.endsWith('/new'))

  useEffect(() => {
    setShowCreateModal(location.pathname.endsWith('/new'))
  }, [location.pathname])

  useEffect(() => {
    if (!selectedRealmId && companies[0]?.realmId) {
      setSelectedRealmId(companies[0].realmId)
    }
  }, [companies, selectedRealmId, setSelectedRealmId])

  const fetchCustomers = async () => {
    if (companies.length === 0) {
      setCustomers([])
      return
    }

    setLoadingCustomers(true)
    const results = await Promise.allSettled(
      companies.map(async (company) => {
        const res = await api.get(`/customers?realmId=${encodeURIComponent(company.realmId)}`)
        return (res.data.data || []).map((customer) => ({
          ...customer,
          realmId: company.realmId,
          companyName: company.companyName
        }))
      })
    )

    const nextCustomers = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')))

    const firstError = results.find((result) => result.status === 'rejected')
    if (firstError?.reason) {
      toast.error(
        firstError.reason.response?.data?.message ||
        'Some customers could not be loaded.'
      )
    }

    setCustomers(nextCustomers)
    setLoadingCustomers(false)
  }

  useEffect(() => {
    if (!loadingCompanies) {
      fetchCustomers()
    }
  }, [companies, loadingCompanies])

  const closeModal = () => {
    setShowCreateModal(false)
    setForm(emptyForm)
    if (location.pathname.endsWith('/new')) {
      navigate('/customers', { replace: true })
    }
  }

  const handleOpenModal = () => {
    if (companies.length === 0) {
      toast.error('Connect a QuickBooks company first.')
      return
    }
    setShowCreateModal(true)
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedRealmId) return toast.error('Connected company is required.')
    if (!form.displayName.trim()) return toast.error('Display name is required.')

    setSubmitting(true)
    try {
      const payload = {
        displayName: form.displayName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim()
      }

      await api.post(`/customers?realmId=${encodeURIComponent(selectedRealmId)}`, payload)
      toast.success('Customer created in QuickBooks.')
      closeModal()
      fetchCustomers()
      setCompanyFilter(selectedRealmId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create customer.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return customers.filter((customer) => {
      const matchesCompany = companyFilter === 'all' || customer.realmId === companyFilter
      const matchesSearch = !q || (
        customer.id?.toLowerCase().includes(q) ||
        customer.displayName?.toLowerCase().includes(q) ||
        customer.email?.toLowerCase().includes(q) ||
        customer.phone?.toLowerCase().includes(q) ||
        customer.companyName?.toLowerCase().includes(q)
      )
      return matchesCompany && matchesSearch
    })
  }, [companyFilter, customers, search])

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="View all connected QuickBooks customers and create new ones when needed"
      />

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
            <div className="d-flex gap-2 flex-wrap flex-grow-1">
              <select
                className="form-select"
                style={{ maxWidth: 260 }}
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                disabled={companies.length === 0}
              >
                <option value="all">All companies</option>
                {companies.map((company) => (
                  <option key={company.realmId} value={company.realmId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: 320 }}
                placeholder="Search by ref id, name, email, phone, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              {/* <button type="button" className="btn btn-outline-primary" onClick={fetchCustomers} disabled={loadingCustomers}>
                <i className="bi bi-arrow-clockwise me-2"></i>Refresh
              </button> */}
              <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
                <i className="bi bi-person-plus me-2"></i>New Customer
              </button>
            </div>
          </div>

          {!loadingCompanies && companies.length === 0 ? (
            <div className="empty-state">
              <p>No connected QuickBooks company found.</p>
              <small className="text-secondary">Connect a company from the dashboard to load customer data.</small>
            </div>
          ) : loadingCustomers ? (
            <div className="loading">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <p>{search || companyFilter !== 'all' ? 'No customers match the current filters.' : 'No customers found.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ref ID</th>
                    <th>Company</th>
                    <th>Display Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={`${customer.realmId}-${customer.id}`}>
                      <td><code>{customer.id}</code></td>
                      <td>{customer.companyName || '-'}</td>
                      <td>{customer.displayName}</td>
                      <td>{customer.email || '-'}</td>
                      <td>{customer.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && companies.length > 0 && (
        <div className="modal-shell">
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Customer</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Connected Company *</label>
                        <select value={selectedRealmId} onChange={(e) => setSelectedRealmId(e.target.value)} required>
                          <option value="">Select company...</option>
                          {companies.map((company) => (
                            <option key={company.realmId} value={company.realmId}>
                              {company.companyName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Display Name *</label>
                        <input
                          name="displayName"
                          value={form.displayName}
                          onChange={handleChange}
                          placeholder="e.g. John Doe or Acme Corp"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name</label>
                        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Company Name</label>
                      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      <i className="bi bi-person-plus me-2"></i>
                      {submitting ? 'Creating...' : 'Create Customer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
