import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import PageHeader from '../../../shared/components/PageHeader'
import useConnectedCompanies from '../../../shared/hooks/useConnectedCompanies'

const ACCOUNT_TYPES = [
  'Bank', 'Accounts Receivable', 'Other Current Asset',
  'Fixed Asset', 'Other Asset', 'Accounts Payable',
  'Credit Card', 'Other Current Liability', 'Long Term Liability',
  'Equity', 'Income', 'Cost of Goods Sold', 'Expense',
  'Other Income', 'Other Expense'
]

const ACCOUNT_SUB_TYPES = {
  Bank: ['Checking', 'Savings', 'MoneyMarket', 'CashOnHand'],
  Income: ['SalesOfProductIncome', 'ServiceFeeIncome', 'OtherPrimaryIncome'],
  Expense: [
    'AdvertisingPromotional', 'BadDebts', 'BankCharges',
    'CommissionsAndFees', 'Entertainment',
    'OfficeGeneralAdministrativeExpenses',
    'OtherMiscellaneousServiceCost', 'Utilities'
  ]
}

const emptyForm = {
  name: '',
  accountType: '',
  accountSubType: '',
  description: '',
  currencyRef: 'USD'
}

export default function AccountForm() {
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

  const fetchAccounts = async () => {
    if (companies.length === 0) {
      setAccounts([])
      return
    }

    setLoadingAccounts(true)
    const results = await Promise.allSettled(
      companies.map(async (company) => {
        const res = await api.get(`/accounts?realmId=${encodeURIComponent(company.realmId)}`)
        return (res.data.data || []).map((account) => ({
          ...account,
          realmId: company.realmId,
          companyName: company.companyName
        }))
      })
    )

    const nextAccounts = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))

    const firstError = results.find((result) => result.status === 'rejected')
    if (firstError?.reason) {
      toast.error(
        firstError.reason.response?.data?.message ||
        'Some accounts could not be loaded.'
      )
    }

    setAccounts(nextAccounts)
    setLoadingAccounts(false)
  }

  useEffect(() => {
    if (!loadingCompanies) {
      fetchAccounts()
    }
  }, [companies, loadingCompanies])

  const closeModal = () => {
    setShowCreateModal(false)
    setForm(emptyForm)
    if (location.pathname.endsWith('/new')) {
      navigate('/accounts', { replace: true })
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
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'accountType' ? { accountSubType: '' } : {})
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedRealmId) return toast.error('Connected company is required.')
    if (!form.name.trim()) return toast.error('Account name is required.')
    if (!form.accountType) return toast.error('Account type is required.')

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        accountType: form.accountType,
        accountSubType: form.accountSubType || undefined,
        description: form.description.trim() || undefined,
        currencyRef: form.currencyRef
      }

      const res = await api.post(`/accounts?realmId=${encodeURIComponent(selectedRealmId)}`, payload)
      const account = res.data.data || null

      toast.success(account?.id
        ? `Account created in QuickBooks. Ref ID: ${account.id}`
        : 'Account created in QuickBooks.')

      closeModal()
      fetchAccounts()
      setCompanyFilter(selectedRealmId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return accounts.filter((account) => {
      const matchesCompany = companyFilter === 'all' || account.realmId === companyFilter
      const matchesSearch = !q || (
        account.id?.toLowerCase().includes(q) ||
        account.name?.toLowerCase().includes(q) ||
        account.accountType?.toLowerCase().includes(q) ||
        account.companyName?.toLowerCase().includes(q)
      )
      return matchesCompany && matchesSearch
    })
  }, [accounts, companyFilter, search])

  const subTypes = ACCOUNT_SUB_TYPES[form.accountType] || []

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="View all connected QuickBooks accounts and create new ones when needed"
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
              {/* <button type="button" className="btn btn-outline-primary" onClick={fetchAccounts} disabled={loadingAccounts}>
                <i className="bi bi-arrow-clockwise me-2"></i>Refresh
              </button> */}
              <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
                <i className="bi bi-wallet2 me-2"></i>New Account
              </button>
            </div>
          </div>

          {!loadingCompanies && companies.length === 0 ? (
            <div className="empty-state">
              <p>No connected QuickBooks company found.</p>
              <small className="text-secondary">Connect a company from the dashboard to load account data.</small>
            </div>
          ) : loadingAccounts ? (
            <div className="loading">Loading accounts...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="empty-state">
              <p>{search || companyFilter !== 'all' ? 'No accounts match the current filters.' : 'No accounts found.'}</p>
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={`${account.realmId}-${account.id}`}>
                      <td><code>{account.id}</code></td>
                      <td>{account.companyName || '-'}</td>
                      <td>{account.name}</td>
                      <td>{account.accountType}</td>
                      <td>
                        <span className={`badge ${account.active ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {account.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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
                  <h5 className="modal-title">Create Account</h5>
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
                        <label>Account Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Office Supplies"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Account Type *</label>
                        <select name="accountType" value={form.accountType} onChange={handleChange} required>
                          <option value="">Select type...</option>
                          {ACCOUNT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Account Sub Type</label>
                        <select name="accountSubType" value={form.accountSubType} onChange={handleChange}>
                          <option value="">Select sub type...</option>
                          {subTypes.map((subType) => (
                            <option key={subType} value={subType}>{subType}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Optional description"
                          rows={3}
                        />
                      </div>

                      <div className="form-group">
                        <label>Currency</label>
                        <select name="currencyRef" value={form.currencyRef} onChange={handleChange}>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="INR">INR - Indian Rupee</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      <i className="bi bi-wallet2 me-2"></i>
                      {submitting ? 'Creating...' : 'Create Account'}
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
