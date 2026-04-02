import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../shared/components/PageHeader'
import InvoiceEditor from '../components/InvoiceEditor'
import { upsertInvoiceInCache } from '../store/invoiceCache'

export default function InvoiceForm() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const prefetchedInvoice = location.state?.invoice || null

  return (
    <div>
      <PageHeader
        title="Edit Invoice"
        subtitle="Update invoice in QuickBooks and SQL DB"
      />

      <InvoiceEditor
        invoiceId={id}
        prefetchedInvoice={prefetchedInvoice}
        onCancel={() => navigate('/invoices')}
        onSuccess={(invoice) => {
          const fallbackRealmId = invoice?.realmId || prefetchedInvoice?.realmId || ''
          const fallbackCompanyName = prefetchedInvoice?.companyName || ''

          if (invoice) {
            upsertInvoiceInCache({
              ...prefetchedInvoice,
              ...invoice,
              realmId: invoice.realmId || fallbackRealmId,
              companyName: invoice.companyName || fallbackCompanyName
            }, { realmId: fallbackRealmId, companyName: fallbackCompanyName })
          }

          navigate('/invoices')
        }}
      />
    </div>
  )
}
