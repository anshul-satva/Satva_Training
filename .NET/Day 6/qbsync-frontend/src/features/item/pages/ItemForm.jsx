import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import PageHeader from '../../../shared/components/PageHeader'
import useConnectedCompanies from '../../../shared/hooks/useConnectedCompanies'

const ITEM_TYPES = ['Service', 'NonInventory', 'Inventory']

const emptyForm = {
  name: '',
  type: 'Service',
  description: '',
  unitPrice: '',
  incomeAccountRef: '',
  expenseAccountRef: '',
  sku: ''
}

export default function ItemForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    companies,
    selectedRealmId,
    setSelectedRealmId,
    loadingCompanies
  } = useConnectedCompanies()

  const [form, setForm] = useState(emptyForm)
  const [accounts, setAccounts] = useState([])
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(false)
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

  const fetchItems = async () => {
    if (companies.length === 0) {
      setItems([])
      return
    }

    setLoadingItems(true)
    const results = await Promise.allSettled(
      companies.map(async (company) => {
        const res = await api.get(`/items?realmId=${encodeURIComponent(company.realmId)}`)
        return (res.data.data || []).map((item) => ({
          ...item,
          realmId: company.realmId,
          companyName: company.companyName
        }))
      })
    )

    const nextItems = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))

    const firstError = results.find((result) => result.status === 'rejected')
    if (firstError?.reason) {
      toast.error(
        firstError.reason.response?.data?.message ||
        'Some items could not be loaded.'
      )
    }

    setItems(nextItems)
    setLoadingItems(false)
  }

  const fetchAccountsForSelectedCompany = async (realmId) => {
    if (!realmId) {
      setAccounts([])
      return
    }

    setLoadingAccounts(true)
    try {
      const res = await api.get(`/accounts?realmId=${encodeURIComponent(realmId)}`)
      setAccounts(res.data.data || [])
    } catch (err) {
      setAccounts([])
      toast.error(err.response?.data?.message || 'Failed to load account references.')
    } finally {
      setLoadingAccounts(false)
    }
  }

  useEffect(() => {
    if (!loadingCompanies) {
      fetchItems()
    }
  }, [companies, loadingCompanies])

  useEffect(() => {
    fetchAccountsForSelectedCompany(selectedRealmId)
  }, [selectedRealmId])

  const closeModal = () => {
    setShowCreateModal(false)
    setForm(emptyForm)
    if (location.pathname.endsWith('/new')) {
      navigate('/items', { replace: true })
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
    if (!form.name.trim()) return toast.error('Item name is required.')
    if (!form.incomeAccountRef.trim()) return toast.error('Income Account Ref is required.')
    if (form.type === 'Inventory') {
      return toast.error('Inventory items are not fully supported by the current backend. Use Service or NonInventory.')
    }
    if (form.unitPrice && Number.isNaN(Number(form.unitPrice))) {
      return toast.error('Unit price must be a valid number.')
    }

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        unitPrice: form.unitPrice ? Number(form.unitPrice) : 0,
        incomeAccountId: form.incomeAccountRef.trim(),
        expenseAccountId: form.expenseAccountRef.trim(),
        sku: form.sku.trim()
      }

      await api.post(`/items?realmId=${encodeURIComponent(selectedRealmId)}`, payload)
      toast.success('Item created in QuickBooks.')
      closeModal()
      fetchItems()
      setCompanyFilter(selectedRealmId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create item.')
    } finally {
      setSubmitting(false)
    }
  }

  const incomeAccounts = accounts.filter((account) =>
    account.accountType === 'Income' || account.accountType === 'Other Income'
  )

  const expenseAccounts = accounts.filter((account) =>
    account.accountType === 'Expense' ||
    account.accountType === 'Cost of Goods Sold' ||
    account.accountType === 'Other Expense'
  )

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCompany = companyFilter === 'all' || item.realmId === companyFilter
      const matchesSearch = !q || (
        item.id?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q) ||
        item.companyName?.toLowerCase().includes(q)
      )
      return matchesCompany && matchesSearch
    })
  }, [companyFilter, items, search])

  return (
    <div>
      <PageHeader
        title="Items"
        subtitle="View all connected QuickBooks items and create new ones when needed"
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
                placeholder="Search by ref id, name, type, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              {/* <button type="button" className="btn btn-outline-primary" onClick={fetchItems} disabled={loadingItems}>
                <i className="bi bi-arrow-clockwise me-2"></i>Refresh
              </button> */}
              <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
                <i className="bi bi-box-seam me-2"></i>New Item
              </button>
            </div>
          </div>

          {!loadingCompanies && companies.length === 0 ? (
            <div className="empty-state">
              <p>No connected QuickBooks company found.</p>
              <small className="text-secondary">Connect a company from the dashboard to load item data.</small>
            </div>
          ) : loadingItems ? (
            <div className="loading">Loading items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>{search || companyFilter !== 'all' ? 'No items match the current filters.' : 'No items found.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ref ID</th>
                    <th>Company</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={`${item.realmId}-${item.id}`}>
                      <td><code>{item.id}</code></td>
                      <td>{item.companyName || '-'}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.unitPrice != null ? `$${Number(item.unitPrice).toFixed(2)}` : '-'}</td>
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
                  <h5 className="modal-title">Create Item</h5>
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
                        <label>Item Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Consulting Service"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Item Type *</label>
                        <select name="type" value={form.type} onChange={handleChange} required>
                          {ITEM_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Unit Price ($)</label>
                        <input
                          type="number"
                          name="unitPrice"
                          value={form.unitPrice}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Item description"
                        />
                      </div>

                      <div className="form-group">
                        <label>SKU</label>
                        <input name="sku" value={form.sku} onChange={handleChange} placeholder="Optional SKU" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Income Account Ref *</label>
                        <select
                          name="incomeAccountRef"
                          value={form.incomeAccountRef}
                          onChange={handleChange}
                          disabled={!selectedRealmId || loadingAccounts}
                        >
                          <option value="">Select income account...</option>
                          {incomeAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name} ({account.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Expense Account Ref</label>
                        <select
                          name="expenseAccountRef"
                          value={form.expenseAccountRef}
                          onChange={handleChange}
                          disabled={!selectedRealmId || loadingAccounts}
                        >
                          <option value="">Select expense account...</option>
                          {expenseAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name} ({account.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      <i className="bi bi-box-seam me-2"></i>
                      {submitting ? 'Creating...' : 'Create Item'}
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
