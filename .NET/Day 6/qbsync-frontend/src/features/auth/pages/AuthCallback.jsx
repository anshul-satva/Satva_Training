import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { setCredentials } from '../store/authSlice'
import { toast } from 'react-toastify'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      toast.error('Intuit login failed: ' + error)
      navigate('/signin')
      return
    }

    if (token) {
      try {
        const decoded = jwtDecode(token)
        dispatch(setCredentials({
          token,
          userId: decoded.sub,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName
        }))
        toast.success('Signed in with Intuit!')
        navigate('/dashboard')
      } catch {
        toast.error('Invalid token received.')
        navigate('/signin')
      }
    } else {
      navigate('/signin')
    }
  }, [navigate,dispatch, params])

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <p>Processing Intuit login...</p>
      </div>
    </div>
  )
}
