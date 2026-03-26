import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import useConnectedCompanies from '../../../shared/hooks/useConnectedCompanies'

const emptyLine = { itemId: '', itemName: '', description: '', quantity: 1, unitPrice: 0 }

export default function InvoiceEditor({
  invoiceId = null,
  prefetchedInvoice = null,
  embedded = false,
  initialRealmId = '',
  onCancel,
  onSuccess
}) {
  const isEdit = Boolean(invoiceId)
  const hasLoadedInvoiceRef = useRef(false)
  const submittingRef = useRef(false)
  const {
    companies,
    selectedRealmId,
    setSelectedRealmId,
    loadingCompanies
  } = useConnectedCompanies()

  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    dueDate: '',
    memo: '',
    lineItems: [{ ...emptyLine }]
  })

  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [editRealmId, setEditRealmId] = useState(prefetchedInvoice?.realmId || '')
  const lastLookupRealmRef = useRef('')
  const lookupInFlightRef = useRef(false)

  const applyInvoiceToForm = useCallback((invoice) => {
    const invoiceRealmId = invoice.realmId || ''
    if (invoiceRealmId) {
      setEditRealmId(invoiceRealmId)
      setSelectedRealmId(invoiceRealmId)
    }
    setForm({
      customerId: invoice.customerId || '',
      customerName: invoice.customerName || '',
      customerEmail: invoice.customerEmail || '',
      dueDate: invoice.dueDate ? String(invoice.dueDate).split('T')[0] : '',
      memo: invoice.memo || '',
      lineItems: invoice.lineItems?.length
        ? invoice.lineItems.map((line) => ({
            itemId: line.itemId || '',
            itemName: line.itemName || '',
            description: line.description || '',
            quantity: Number(line.quantity) || 1,
            unitPrice: Number(line.unitPrice) || 0
          }))
        : [{ ...emptyLine }]
    })
  }, [setSelectedRealmId])

  const fetchQuickBooksData = useCallback(async (realmId) => {
    if (!realmId) {
      setCustomers([])
      setItems([])
      return
    }
    if (lookupInFlightRef.current || lastLookupRealmRef.current === realmId) return

    lookupInFlightRef.current = true
    lastLookupRealmRef.current = realmId
    try {
      const [customerResult, itemResult] = await Promise.allSettled([
        api.get(`/customers?realmId=${encodeURIComponent(realmId)}`),
        api.get(`/items?realmId=${encodeURIComponent(realmId)}`)
      ])

      setCustomers(customerResult.status === 'fulfilled' ? (customerResult.value.data.data || []) : [])
      setItems(itemResult.status === 'fulfilled' ? (itemResult.value.data.data || []) : [])
    } catch (err) {
      setCustomers([])
      setItems([])
    } finally {
      lookupInFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    const realmIdToUse = String(isEdit ? (editRealmId || prefetchedInvoice?.realmId || selectedRealmId) : selectedRealmId).trim()
    if (!realmIdToUse) return
    fetchQuickBooksData(realmIdToUse)
  }, [editRealmId, fetchQuickBooksData, isEdit, prefetchedInvoice?.realmId, selectedRealmId])

  useEffect(() => {
    if (!isEdit || hasLoadedInvoiceRef.current) return

    const prefetchedMatches = prefetchedInvoice && String(prefetchedInvoice.id) === String(invoiceId)
    if (prefetchedMatches) {
      hasLoadedInvoiceRef.current = true
      applyInvoiceToForm(prefetchedInvoice)
      return
    }

    setFetching(true)
    ;(async () => {
      if (loadingCompanies || companies.length === 0) {
        setFetching(false)
        return
      }

      hasLoadedInvoiceRef.current = true
      let foundInvoice = null

      for (const company of companies) {
        try {
          const res = await api.get(`/invoices?realmId=${encodeURIComponent(company.realmId)}`)
          const match = (res.data.data || []).find((inv) => String(inv.id) === String(invoiceId))
          if (match) {
            foundInvoice = { ...match, realmId: company.realmId }
            break
          }
        } catch {
          // ignore and continue searching other companies
        }
      }

      if (foundInvoice) {
        applyInvoiceToForm(foundInvoice)
      } else {
        toast.error('Invoice not found or no longer available for this connected company.')
        onCancel?.()
      }

      setFetching(false)
    })()
  }, [applyInvoiceToForm, companies, invoiceId, isEdit, loadingCompanies, onCancel, prefetchedInvoice])

  useEffect(() => {
    if (!isEdit && !selectedRealmId) {
      const nextRealmId = initialRealmId || companies[0]?.realmId || ''
      if (nextRealmId) {
        setSelectedRealmId(nextRealmId)
      }
    }
  }, [companies, initialRealmId, isEdit, selectedRealmId, setSelectedRealmId])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find((customer) => customer.id === e.target.value)
    setForm((prev) => ({
      ...prev,
      customerId: e.target.value,
      customerName: selectedCustomer?.displayName || '',
      customerEmail: selectedCustomer?.email || ''
    }))
  }

  const handleLineChange = (index, field, value) => {
    const lines = [...form.lineItems]
    lines[index] = { ...lines[index], [field]: value }

    if (field === 'itemId') {
      const item = items.find((row) => row.id === value)
      if (item) {
        lines[index].itemName = item.name || ''
        lines[index].description = item.description || ''
        lines[index].unitPrice = item.unitPrice || 0
      }
    }

    setForm((prev) => ({ ...prev, lineItems: lines }))
  }

  const addLine = () => {
    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, { ...emptyLine }] }))
  }

  const removeLine = (index) => {
    if (form.lineItems.length === 1) {
      toast.error('At least one line item is required.')
      return
    }
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, currentIndex) => currentIndex !== index)
    }))
  }

  const calcLineTotal = (line) => (parseFloat(line.quantity) || 0) * (parseFloat(line.unitPrice) || 0)
  const calcTotal = () => form.lineItems.reduce((sum, line) => sum + calcLineTotal(line), 0)

  const validate = () => {
    const effectiveRealmId = (isEdit ? (editRealmId || selectedRealmId) : selectedRealmId).trim()
    if (!effectiveRealmId) { toast.error('Connected company is required.'); return false }
    if (!form.customerId.trim()) { toast.error('Please select a customer.'); return false }
    if (!form.dueDate) { toast.error('Due date is required.'); return false }

    for (let index = 0; index < form.lineItems.length; index += 1) {
      const line = form.lineItems[index]
      if (!line.itemId.trim()) {
        toast.error(`Line ${index + 1}: Please select an item.`)
        return false
      }
      if (!line.quantity || Number(line.quantity) <= 0) {
        toast.error(`Line ${index + 1}: Quantity must be greater than 0.`)
        return false
      }
      if (Number(line.unitPrice) < 0) {
        toast.error(`Line ${index + 1}: Unit price cannot be negative.`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current) return
    if (!validate()) return

    const effectiveRealmId = (isEdit ? (editRealmId || selectedRealmId) : selectedRealmId).trim()
    const payload = {
      realmId: effectiveRealmId,
      customerId: form.customerId.trim(),
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      dueDate: form.dueDate,
      memo: form.memo,
      totalAmount: calcTotal(),
      lineItems: form.lineItems.map((line) => ({
        itemId: line.itemId,
        itemName: line.itemName,
        description: line.description,
        quantity: Number(line.quantity),
        unitPrice: Number(line.unitPrice),
        amount: calcLineTotal(line)
      }))
    }

    setLoading(true)
    submittingRef.current = true
    try {
      const res = isEdit
        ? await api.put(`/invoices/${invoiceId}?realmId=${encodeURIComponent(effectiveRealmId)}`, payload)
        : await api.post(`/invoices?realmId=${encodeURIComponent(effectiveRealmId)}`, payload)

      const invoice = res.data.data
      const invoiceNumber = invoice?.docNumber || invoice?.qbInvoiceId

      toast.success(invoiceNumber
        ? `Invoice ${isEdit ? 'updated' : 'created'} successfully. Invoice #: ${invoiceNumber}`
        : `Invoice ${isEdit ? 'updated' : 'created'} successfully.`)

      onSuccess?.(invoice)
    } catch (err) {
      // toast.error(err.response?.data?.message || 'Failed to save invoice.')
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
  }

  if (!loadingCompanies && companies.length === 0) {
    return <div className="alert alert-warning mb-0">No connected QuickBooks company found. Connect a company first.</div>
  }

  if (fetching) {
    return <div className="loading">Loading invoice...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {!embedded && (
            <div className="card-title d-flex align-items-center gap-2">
              <i className="bi bi-card-checklist text-primary"></i>
              <span>Invoice Details</span>
            </div>
          )}

          <div className="form-group">
            <label>Connected Company *</label>
            <select value={isEdit ? (editRealmId || selectedRealmId) : selectedRealmId} onChange={(e) => {
              if (!isEdit) setSelectedRealmId(e.target.value)
            }} required disabled={isEdit}>
              <option value="">Select company...</option>
              {companies.map((company) => (
                <option key={company.realmId} value={company.realmId}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer *</label>
              {customers.length > 0 ? (
                <select value={form.customerId} onChange={handleCustomerChange} required>
                  <option value="">Select customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.displayName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="customerId"
                  value={form.customerId}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerId: e.target.value }))}
                  placeholder="Enter Customer ID manually"
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label>Customer Name</label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Auto-filled or enter manually"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Memo / Notes</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="Optional memo or notes"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="card-title mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-box-seam text-success"></i>
              <span>Line Items</span>
            </div>
            <button type="button" className="btn btn-success btn-sm" onClick={addLine}>
              <i className="bi bi-plus-lg me-1"></i>Add Line
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle line-items-table">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: 160 }}>Item</th>
                  <th style={{ minWidth: 160 }}>Description</th>
                  <th style={{ minWidth: 80 }}>Qty</th>
                  <th style={{ minWidth: 100 }}>Unit Price ($)</th>
                  <th style={{ minWidth: 100 }}>Amount ($)</th>
                  <th style={{ minWidth: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {form.lineItems.map((line, index) => (
                  <tr key={index}>
                    <td>
                      {items.length > 0 ? (
                        <select value={line.itemId} onChange={(e) => handleLineChange(index, 'itemId', e.target.value)}>
                          <option value="">Select item...</option>
                          {items.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={line.itemId}
                          onChange={(e) => handleLineChange(index, 'itemId', e.target.value)}
                          placeholder="Item ID"
                        />
                      )}
                    </td>
                    <td>
                      <input
                        value={line.description}
                        onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                        min="1"
                        step="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => handleLineChange(index, 'unitPrice', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td><strong>${calcLineTotal(line).toFixed(2)}</strong></td>
                    <td>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeLine(index)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-3 fs-5">
            <strong>Total: ${calcTotal().toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-file-earmark-plus'} me-2`}></i>
          {loading
            ? isEdit ? 'Updating...' : 'Creating...'
            : isEdit ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  )
}
