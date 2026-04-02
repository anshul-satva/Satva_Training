const CACHE_TTL_MS = 30 * 60 * 1000

const invoiceCache = new Map()

const isFresh = (entry) => {
  if (!entry) return false
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS
}

const normalizeRealmId = (realmId) => String(realmId || '').trim()

export const getCachedInvoiceById = (invoiceId, realmId = '') => {
  const effectiveRealmId = normalizeRealmId(realmId)
  const matchId = String(invoiceId)

  if (effectiveRealmId) {
    const entry = invoiceCache.get(effectiveRealmId)
    return entry?.invoices.find((invoice) => String(invoice.id) === matchId) || null
  }

  for (const entry of invoiceCache.values()) {
    const match = entry.invoices.find((invoice) => String(invoice.id) === matchId)
    if (match) return match
  }

  return null
}

export const getCachedInvoicesSnapshot = (companies, { allowStale = false } = {}) => {
  const invoices = []
  const missingRealmIds = []

  for (const company of companies) {
    const realmId = normalizeRealmId(company.realmId)
    if (!realmId) continue

    const entry = invoiceCache.get(realmId)
    if (!entry || (!allowStale && !isFresh(entry))) {
      missingRealmIds.push(realmId)
      continue
    }

    invoices.push(...entry.invoices)
  }

  return { invoices, missingRealmIds }
}

export const setCachedInvoices = (realmId, invoices) => {
  const effectiveRealmId = normalizeRealmId(realmId)
  if (!effectiveRealmId) return

  invoiceCache.set(effectiveRealmId, {
    invoices,
    fetchedAt: Date.now()
  })
}

export const upsertInvoiceInCache = (invoice, { realmId, companyName } = {}) => {
  if (!invoice) return
  const effectiveRealmId = normalizeRealmId(realmId || invoice.realmId)
  if (!effectiveRealmId) return

  const entry = invoiceCache.get(effectiveRealmId)
  const existing = entry?.invoices || []
  const nextInvoice = {
    ...invoice,
    realmId: effectiveRealmId,
    companyName: invoice.companyName || companyName || existing.find((row) => String(row.id) === String(invoice.id))?.companyName
  }

  const index = existing.findIndex((row) => String(row.id) === String(invoice.id))
  const nextInvoices = index >= 0
    ? [
        ...existing.slice(0, index),
        { ...existing[index], ...nextInvoice },
        ...existing.slice(index + 1)
      ]
    : [nextInvoice, ...existing]

  invoiceCache.set(effectiveRealmId, {
    invoices: nextInvoices,
    fetchedAt: Date.now()
  })
}

export const removeInvoiceFromCache = (realmId, invoiceId) => {
  const effectiveRealmId = normalizeRealmId(realmId)
  if (!effectiveRealmId) return
  const entry = invoiceCache.get(effectiveRealmId)
  if (!entry) return

  invoiceCache.set(effectiveRealmId, {
    invoices: entry.invoices.filter((row) => String(row.id) !== String(invoiceId)),
    fetchedAt: entry.fetchedAt
  })
}

export const clearInvoiceCache = () => {
  invoiceCache.clear()
}
