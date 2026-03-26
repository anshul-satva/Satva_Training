import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SignUp from './features/auth/pages/SignUp'
import SignIn from './features/auth/pages/SignIn'
import AuthCallback from './features/auth/pages/AuthCallback'
import Dashboard from './features/dashboard/pages/Dashboard'
import Connection from './features/quickbooks/pages/Connection'
import AccountForm from './features/account/pages/AccountForm'
import CustomerForm from './features/customer/pages/CustomerForm'
import ItemForm from './features/item/pages/ItemForm'
import InvoiceForm from './features/invoice/pages/InvoiceForm'
import InvoiceList from './features/invoice/pages/InvoiceList'
import PrivateRoute from './shared/components/PrivateRoute'
import Layout from './shared/components/Layout'

function PrivateLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  )
}

export default function App() {
  const { isAuthenticated } = useSelector((s) => s.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/signin" replace /> : <SignUp />
      } />
      <Route path="/signin" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={
          <PrivateLayout><Dashboard /></PrivateLayout>
        } />
        <Route path="/connection" element={
          <PrivateLayout><Connection /></PrivateLayout>
        } />
        <Route path="/accounts" element={
          <PrivateLayout><AccountForm /></PrivateLayout>
        } />
        <Route path="/accounts/new" element={
          <PrivateLayout><AccountForm /></PrivateLayout>
        } />
        <Route path="/customers" element={
          <PrivateLayout><CustomerForm /></PrivateLayout>
        } />
        <Route path="/customers/new" element={
          <PrivateLayout><CustomerForm /></PrivateLayout>
        } />
        <Route path="/items" element={
          <PrivateLayout><ItemForm /></PrivateLayout>
        } />
        <Route path="/items/new" element={
          <PrivateLayout><ItemForm /></PrivateLayout>
        } />
        <Route path="/invoices" element={
          <PrivateLayout><InvoiceList /></PrivateLayout>
        } />
        <Route path="/invoices/new" element={
          <PrivateLayout><InvoiceList /></PrivateLayout>
        } />
        <Route path="/invoices/edit/:id" element={
          <PrivateLayout><InvoiceForm /></PrivateLayout>
        } />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />} />
    </Routes>
  )
}
