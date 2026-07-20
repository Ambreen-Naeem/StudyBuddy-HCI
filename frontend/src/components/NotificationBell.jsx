import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

// Notification bell with an unread-count badge and a dropdown preview.
// Polls the API periodically. Degrades gracefully: if the request fails we
// simply show a zero count rather than breaking the navbar.
export default function NotificationBell() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  async function load() {
    try {
      const { data } = await client.get('/notifications')
      setItems(Array.isArray(data) ? data : data.notifications || [])
    } catch {
      // Silent: the bell should never crash the shell.
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 30000) // poll every 30s
    return () => clearInterval(t)
  }, [])

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const unread = items.filter((n) => !n.read).length

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-content-muted hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
      >
        <span aria-hidden="true" className="text-xl">
          🔔
        </span>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-line bg-surface shadow-card-lg"
          role="menu"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="text-sm font-semibold text-content">Notifications</span>
            <Link to="/notifications" className="text-xs font-medium text-primary hover:underline" onClick={() => setOpen(false)}>
              View all
            </Link>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-content-muted">You are all caught up.</p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {items.slice(0, 6).map((n) => (
                <li key={n.id} className="border-b border-line px-4 py-3 last:border-0">
                  <p className={`text-sm ${n.read ? 'text-content-muted' : 'font-medium text-content'}`}>
                    {!n.read && <span className="mr-1 text-primary" aria-label="unread">●</span>}
                    {n.message || n.title}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
