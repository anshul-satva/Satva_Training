import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/store/authSlice'
import { toast } from 'react-toastify'

export default function Layout({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((s) => s.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(logout())
    toast.info('Logged out.')
    navigate('/signin')
  }

  const navClass = ({ isActive }) =>
    isActive ? 'active d-flex align-items-center gap-2' : 'd-flex align-items-center gap-2'

  return (
    <div className={`layout-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 sidebar-brand">
            <i className="bi bi-bar-chart-line-fill"></i>
            <span className="sidebar-label">QBSync</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light sidebar-close d-lg-none"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={navClass}>
            <i className="bi bi-grid-1x2-fill"></i>
            <span className="sidebar-label">Dashboard</span>
          </NavLink>

          <div className="nav-section sidebar-label">QuickBooks</div>
          <NavLink to="/connection" className={navClass}>
            <i className="bi bi-plug-fill"></i>
            <span className="sidebar-label">Connection</span>
          </NavLink>
          <NavLink to="/accounts" className={navClass}>
            <i className="bi bi-wallet2"></i>
            <span className="sidebar-label">Accounts</span>
          </NavLink>
          <NavLink to="/customers" className={navClass}>
            <i className="bi bi-people-fill"></i>
            <span className="sidebar-label">Customers</span>
          </NavLink>
          <NavLink to="/items" className={navClass}>
            <i className="bi bi-box-seam-fill"></i>
            <span className="sidebar-label">Items</span>
          </NavLink>

          <div className="nav-section sidebar-label">Invoices</div>
          <NavLink to="/invoices" end className={navClass}>
            <i className="bi bi-receipt-cutoff"></i>
            <span className="sidebar-label">All Invoices</span>
          </NavLink>
          <NavLink to="/invoices/new" className={navClass}>
            <i className="bi bi-file-earmark-plus-fill"></i>
            <span className="sidebar-label">New Invoice</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-person-circle fs-5"></i>
              <div className="sidebar-label">
                <div>{user?.firstName} {user?.lastName}</div>
                <small>{user?.email}</small>
              </div>
            </div>
          </div>
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>

      <div className="content-shell">
        <header className="content-topbar">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary d-none d-lg-inline-flex"
              onClick={() => setSidebarCollapsed((value) => !value)}
            >
              <i className={`bi ${sidebarCollapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'}`}></i>
            </button>
            <span className="fw-semibold text-dark">QBSync</span>
          </div>
        </header>

        <main className="main-content container-fluid py-4 px-3 px-md-4">
          {children}
        </main>
      </div>
    </div>
  )
}
