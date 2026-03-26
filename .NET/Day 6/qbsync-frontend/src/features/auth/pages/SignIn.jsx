import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../../shared/api/client'
import { setCredentials } from '../store/authSlice'

export default function SignIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [ssoLoading, setSsoLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      return setError('Email and password are required.')
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password
      })
      dispatch(setCredentials(res.data.data))
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleIntuitSSO = async () => {
    setSsoLoading(true)
    try {
      const res = await api.get('/auth/intuit/url')
      window.location.href = res.data.url
    } catch {
      toast.error('Failed to get Intuit SSO URL.')
      setSsoLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo"><i className="bi bi-bar-chart-line-fill"></i></div>
        <h2>Welcome Back</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <button className="btn btn-intuit" onClick={handleIntuitSSO} disabled={ssoLoading}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {ssoLoading ? 'Redirecting...' : 'Sign in with Intuit'}
        </button>

        <div className="auth-link">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
