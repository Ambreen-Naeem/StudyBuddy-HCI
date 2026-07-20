import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from './Toast/ToastContext'
import NotificationBell from './NotificationBell'

// Top navigation bar. Contains the brand, the notification bell, a theme
// toggle, and a user menu with sign-out. `onMenuClick` toggles the mobile
// sidebar.
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const toast = useToast()

  function handleLogout() {
    logout()
    toast.success('Signed out. See you soon!')
    navigate('/login')
  }

  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-line glass-surface">
      <nav className="flex h-16 items-center gap-3 px-4 sm:px-6" aria-label="Primary">
        {/* Hamburger — only meaningful on small screens. */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-content-muted hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
          aria-label="Open navigation menu"
        >
          <span aria-hidden="true" className="text-xl">
            ☰
          </span>
        </button>

        <Link to="/" className="flex items-center gap-2 font-bold text-content">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-lg shadow-glow"
          >
            📚
          </span>
          <span className="text-lg">
            Study
            <span className="bg-brand-gradient bg-clip-text text-transparent">Buddy</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle. Label reflects the action it will perform. */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-content-muted hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true" className="text-xl">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>

          <NotificationBell />

          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-glow"
              aria-hidden="true"
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-content sm:inline">
              {user?.name || user?.email || 'Profile'}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-content-muted hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  )
}
