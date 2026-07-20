import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

// Guards routes that require authentication. While the initial auth bootstrap
// is running we render a spinner; once resolved we either render the protected
// children or redirect to /login, preserving the intended destination so we can
// send the user back after a successful sign-in.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Checking your session" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
