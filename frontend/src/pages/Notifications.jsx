import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

// Notifications page. Lists notifications, lets the user mark a single one or
// all of them as read. Unread items are marked with an icon + bold text, not
// color alone.
const TYPE_ICON = {
  join_request: '👥',
  group: '👥',
  task: '🗓️',
  progress: '📈',
  message: '💬',
  default: '🔔',
}

export default function Notifications() {
  const toast = useToast()
  const { data, loading, error, setData, reload } = useFetch('/notifications', { fallback: [] })
  const items = Array.isArray(data) ? data : data?.notifications || []
  const unread = items.filter((n) => !n.isRead)

  function patchRead(id, isRead) {
    setData((prev) => {
      const list = Array.isArray(prev) ? prev : prev?.notifications || []
      const next = list.map((n) => (n.id === id ? { ...n, isRead } : n))
      return Array.isArray(prev) ? next : { ...prev, notifications: next }
    })
  }

  async function markRead(n) {
    if (n.isRead) return
    patchRead(n.id, true) // optimistic
    try {
      await client.patch(`/notifications/${n.id}/read`)
    } catch (err) {
      patchRead(n.id, false) // rollback
      toast.error(err?.response?.data?.message || 'Could not mark as read.')
    }
  }

  async function markAllRead() {
    try {
      await client.patch('/notifications/read-all')
      toast.success('All notifications marked as read.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not mark all as read.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content">Notifications</h1>
          <p className="text-sm text-content-muted">
            {unread.length > 0 ? `${unread.length} unread` : 'You are all caught up.'}
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" onClick={markAllRead} icon={<span aria-hidden="true">✓</span>}>
            Mark all as read
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>Couldn't load notifications.
        </div>
      )}

      <Card>
        {loading ? (
          <div className="py-8">
            <Spinner size="lg" label="Loading notifications" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" message="We'll let you know when something happens." />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-4">
                <span className="text-2xl" aria-hidden="true">
                  {TYPE_ICON[n.type] || TYPE_ICON.default}
                </span>
                <div className="flex-1">
                  <p className={`text-sm ${n.isRead ? 'text-content-muted' : 'font-semibold text-content'}`}>
                    {!n.isRead && <span className="mr-1 text-primary" aria-label="unread">●</span>}
                    {n.message || n.title}
                  </p>
                  {n.createdAt && <p className="mt-0.5 text-xs text-content-muted">{n.createdAt}</p>}
                </div>
                {n.isRead ? (
                  <Badge tone="neutral" icon="✓">
                    Read
                  </Badge>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => markRead(n)}>
                    Mark read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
