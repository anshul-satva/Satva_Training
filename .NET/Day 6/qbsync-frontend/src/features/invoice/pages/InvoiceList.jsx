import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import PageHeader from '../../../shared/components/PageHeader'
import useConnectedCompanies from '../../../shared/hooks/useConnectedCompanies'
import InvoiceEditor from '../components/InvoiceEditor'

const STATUS_COLORS = {
  Paid: 'text-bg-success',
  Draft: 'text-bg-info',
  Sent: 'text-bg-warning',
  Overdue: 'text-bg-danger',
  Voided: 'text-bg-danger'
}

export default function InvoiceList() {
  const location = useLocation()
  const navigate = useNavigate()
  const { companies, loadingCompanies } = useConnectedCompanies()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(location.pathname.endsWith('/new'))

  useEffect(() => {
    setShowCreateModal(location.pathname.endsWith('/new'))
  }, [location.pathname])

  const fetchInvoices = async () => {
    if (companies.length === 0) {
      setInvoices([])
      setError('')
      return
    }

    setLoading(true)
    setError('')

    const results = await Promise.allSettled(
      companies.map(async (company) => {
        const res = await api.get(`/invoices?realmId=${encodeURIComponent(company.realmId)}`)
        return (res.data.data || []).map((invoice) => ({
          ...invoice,
          realmId: company.realmId,
          companyName: company.companyName
        }))
      })
    )

    const nextInvoices = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

    const firstError = results.find((result) => result.status === 'rejected')
    if (firstError?.reason) {
      setError(
        firstError.reason.response?.data?.message ||
        firstError.reason.response?.data?.inner ||
        'Failed to fetch invoices.'
      )
    }

    setInvoices(nextInvoices)
    setLoading(false)
  }

  useEffect(() => {
    if (!loadingCompanies) {
      fetchInvoices()
    }
  }, [companies, loadingCompanies])

  const closeCreateModal = () => {
    setShowCreateModal(false)
    if (location.pathname.endsWith('/new')) {
      navigate('/invoices', { replace: true })
    }
  }

  const handleOpenModal = () => {
    if (companies.length === 0) {
      toast.error('Connect a QuickBooks company first.')
      return
    }
    setShowCreateModal(true)
  }

  const handleRefresh = async () => {
    if (companies.length === 0) {
      toast.error('Connect a QuickBooks company first.')
      return
    }

    toast.info('Refreshing invoices from QuickBooks...')
    const results = await Promise.allSettled(
      companies.map((company) =>
        api.post(`/invoices/sync?realmId=${encodeURIComponent(company.realmId)}`)
      )
    )

    const failed = results.filter((result) => result.status === 'rejected')
    if (failed.length > 0) {
      toast.error('Some companies failed to synchronize invoices.')
    } else {
      toast.success('Invoices synchronized with QuickBooks.')
    }

    await fetchInvoices()
  }

  const handleDelete = async (invoice) => {
    if (!window.confirm(`Delete invoice for ${invoice.customerName}? This will also delete it from QuickBooks.`)) return

    setDeletingId(invoice.id)
    try {
      await api.delete(`/invoices/${invoice.id}?realmId=${encodeURIComponent(invoice.realmId)}`)
      toast.success('Invoice deleted successfully.')
      fetchInvoices()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete invoice.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase()
    return invoices.filter((invoice) => {
      const matchesCompany = companyFilter === 'all' || invoice.realmId === companyFilter
      const matchesSearch = !q || (
        invoice.customerName?.toLowerCase().includes(q) ||
        invoice.docNumber?.toLowerCase().includes(q) ||
        invoice.qbInvoiceId?.toLowerCase().includes(q) ||
        invoice.status?.toLowerCase().includes(q) ||
        invoice.companyName?.toLowerCase().includes(q)
      )
      return matchesCompany && matchesSearch
    })
  }, [companyFilter, invoices, search])

  const getQuickBooksInvoiceUrl = (invoice) =>
    invoice?.qbInvoiceId
      ? `https://app.qbo.intuit.com/app/invoice?txnId=${encodeURIComponent(invoice.qbInvoiceId)}&companyId=${encodeURIComponent(invoice.realmId || '')}`
      : null

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="View invoices across connected companies and create new ones when needed"
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
                placeholder="Search by customer, invoice id or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-primary" onClick={handleRefresh} disabled={loading}>
                <i className="bi bi-arrow-clockwise me-2"></i>Sync
              </button>
              <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
                <i className="bi bi-file-earmark-plus me-2"></i>New Invoice
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {!loadingCompanies && companies.length === 0 ? (
            <div className="empty-state">
              <p>No connected QuickBooks companies found.</p>
              <small className="text-secondary">Connect a company from the dashboard to load invoice data.</small>
            </div>
          ) : loading ? (
            <div className="loading">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <div className="mb-2"><i className="bi bi-receipt display-6 text-secondary"></i></div>
              <p>{search || companyFilter !== 'all' ? 'No invoices match the current filters.' : 'No invoices found.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Invoice #</th>
                    <th>Company</th>
                    <th>Customer</th>
                    {/* <th>Email</th> */}
                    <th>Total</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={`${invoice.realmId}-${invoice.id}`}>
                      <td>
                        {getQuickBooksInvoiceUrl(invoice) ? (
                          <a
                            href={getQuickBooksInvoiceUrl(invoice)}
                            target="_blank"
                            rel="noreferrer"
                            className="link-primary text-decoration-none fw-semibold"
                            title="Open this invoice in QuickBooks"
                          >
                            {invoice.docNumber || invoice.qbInvoiceId || 'N/A'}
                          </a>
                        ) : (
                          <code>{invoice.docNumber || invoice.qbInvoiceId || 'N/A'}</code>
                        )}
                      </td>
                      <td>{invoice.companyName || '-'}</td>
                      <td>{invoice.customerName}</td>
                      {/* <td>{invoice.customerEmail || '-'}</td> */}
                      <td><strong>${Number(invoice.totalAmount || 0).toFixed(2)}</strong></td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[invoice.status] || 'text-bg-info'}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
                      <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2 ms-1">
                          <Link
                            to={`/invoices/edit/${invoice.id}`}
                            state={{ invoice }}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(invoice)}
                            disabled={deletingId === invoice.id}
                          >
                            <i className="bi bi-trash"></i>
                            {/* {deletingId === invoice.id ? 'Deleting...' : 'Delete'} */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredInvoices.length > 0 && (
            <div className="bg-light rounded p-3 mt-3 d-flex gap-4 flex-wrap">
              <span><strong>Total:</strong> {filteredInvoices.length} invoices</span>
              <span><strong>Total Amount:</strong> ${filteredInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0).toFixed(2)}</span>
              <span><strong>Paid:</strong> {filteredInvoices.filter((invoice) => invoice.status === 'Paid').length}</span>
              <span><strong>Pending:</strong> {filteredInvoices.filter((invoice) => invoice.status !== 'Paid').length}</span>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && companies.length > 0 && (
        <div className="modal-shell">
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Invoice</h5>
                  <button type="button" className="btn-close" onClick={closeCreateModal}></button>
                </div>
                <div className="modal-body">
                  <InvoiceEditor
                    embedded
                    initialRealmId={companyFilter !== 'all' ? companyFilter : (companies[0]?.realmId || '')}
                    onCancel={closeCreateModal}
                    onSuccess={() => {
                      closeCreateModal()
                      fetchInvoices()
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
