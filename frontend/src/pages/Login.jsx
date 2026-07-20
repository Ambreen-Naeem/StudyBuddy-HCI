import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'

// Sign-in page. Accessible form: labelled inputs, an aria-live error summary,
// and a disabled/loading submit button. On success it redirects to the page the
// user originally requested (or the dashboard).
export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-4">
      {/* Branded gradient backdrop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-10 dark:opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-3xl shadow-glow"
            aria-hidden="true"
          >
            📚
          </div>
          <h1 className="text-2xl font-bold text-content">
            Study<span className="bg-brand-gradient bg-clip-text text-transparent">Buddy</span>
          </h1>
          <p className="mt-1 text-sm text-content-muted">Sign in to find your study groups.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-surface rounded-2xl border border-line p-6 shadow-card-lg"
          noValidate
        >
          <h2 className="mb-4 text-lg font-semibold text-content">Sign in</h2>

          {/* aria-live so screen readers announce the error when it appears. */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl border border-error-100 bg-error-50 px-3 py-2 text-sm text-error dark:border-error/30 dark:bg-error/15 dark:text-red-300"
            >
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@university.edu"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" loading={loading} className="mt-6 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-content-muted">
          New here?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
