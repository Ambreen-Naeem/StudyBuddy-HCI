import { Link } from 'react-router-dom'

// 404 fallback. Lives outside the app shell so it works for any unknown URL,
// authenticated or not.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6 text-center">
      <p className="bg-brand-gradient bg-clip-text text-6xl font-bold text-transparent" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-content">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-content-muted">
        The page you were looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        ← Back to dashboard
      </Link>
    </main>
  )
}
