import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />
}