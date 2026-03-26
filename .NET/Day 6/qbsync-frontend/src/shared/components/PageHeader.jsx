export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header mb-4">
      <h1 className="h3 mb-1 fw-semibold text-dark">{title}</h1>
      {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
    </div>
  )
}
