import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'

// Registration page with client-side validation (required fields, email shape,
// password length, confirm match). Errors are tied to fields via aria-describedby
// through the Input component, and a summary alert is announced via role="alert".
export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      toast.success('Account created! You can sign in now.')
      // If backend auto-logged us in, AuthContext now has a token -> go home.
      navigate(res?.token || res?.access_token ? '/' : '/login')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not create your account. Please try again.'
      setErrors((prev) => ({ ...prev, form: msg }))
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
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
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
            Join Study<span className="bg-brand-gradient bg-clip-text text-transparent">Buddy</span>
          </h1>
          <p className="mt-1 text-sm text-content-muted">Create an account to get started.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-surface rounded-2xl border border-line p-6 shadow-card-lg"
          noValidate
        >
          <h2 className="mb-4 text-lg font-semibold text-content">Create account</h2>

          {errors.form && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl border border-error-100 bg-error-50 px-3 py-2 text-sm text-error dark:border-error/30 dark:bg-error/15 dark:text-red-300"
            >
              <span aria-hidden="true">⚠</span>
              <span>{errors.form}</span>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Full name"
              autoComplete="name"
              required
              value={form.name}
              onChange={update('name')}
              error={errors.name}
              placeholder="Ada Lovelace"
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              placeholder="you@university.edu"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              helper="At least 6 characters."
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={update('confirm')}
              error={errors.confirm}
            />
          </div>

          <Button type="submit" loading={loading} className="mt-6 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-content-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
