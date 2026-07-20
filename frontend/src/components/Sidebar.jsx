import { NavLink } from 'react-router-dom'

// Primary side navigation. Each item pairs an icon with a text label (never an
// icon alone) and uses aria-current="page" on the active route so screen
// readers and color-blind users can tell where they are without relying on the
// highlight color.
const NAV = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/find-groups', label: 'Find Groups', icon: '🔍' },
  { to: '/groups', label: 'My Groups', icon: '👥' },
  { to: '/subjects', label: 'Subjects', icon: '📘' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/planner', label: 'Planner', icon: '🗓️' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop for mobile drawer. */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-line bg-surface pt-16 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 lg:pt-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar navigation"
      >
        <nav className="flex h-full flex-col gap-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${
                  isActive
                    ? 'bg-brand-gradient text-white shadow-glow'
                    : 'text-content-muted hover:bg-surface-2 hover:text-content'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span aria-hidden="true" className="text-lg">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto text-white" aria-hidden="true">●</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
