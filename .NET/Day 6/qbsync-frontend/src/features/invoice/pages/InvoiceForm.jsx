import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../shared/components/PageHeader'
import InvoiceEditor from '../components/InvoiceEditor'

export default function InvoiceForm() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Edit Invoice"
        subtitle="Update invoice in QuickBooks and SQL DB"
      />

      <InvoiceEditor
        invoiceId={id}
        prefetchedInvoice={location.state?.invoice || null}
        onCancel={() => navigate('/invoices')}
        onSuccess={() => navigate('/invoices')}
      />
    </div>
  )
}
