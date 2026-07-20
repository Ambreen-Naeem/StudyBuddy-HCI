import { useState } from 'react'
import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ProgressBar from '../components/ProgressBar'

// Progress tracker. For each subject we show a progress bar, the weekly targets,
// and a checklist of topics the user can mark complete/incomplete. Marking a
// topic optimistically updates the UI and persists via the API.
export default function ProgressTracker() {
  const toast = useToast()
  const { data, loading, error, setData } = useFetch('/progress', { fallback: [] })
  const subjects = Array.isArray(data) ? data : data?.subjects || []
  const [busy, setBusy] = useState(null) // topic id currently toggling

  async function toggleTopic(subjectId, topic) {
    const newValue = !topic.completed
    setBusy(topic.id)

    // Optimistic update.
    setData((prev) => {
      const list = Array.isArray(prev) ? prev : prev?.subjects || []
      const next = list.map((s) =>
        s.id !== subjectId
          ? s
          : {
              ...s,
              topics: (s.topics || []).map((t) => (t.id === topic.id ? { ...t, completed: newValue } : t)),
            }
      )
      return Array.isArray(prev) ? next : { ...prev, subjects: next }
    })

    try {
      await client.post(`/progress/topic/${topic.id}`, {
        status: newValue ? 'completed' : 'not_started',
      })
      toast.success(newValue ? 'Topic marked complete.' : 'Topic reopened.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update the topic.')
      // Roll back on failure.
      setData((prev) => {
        const list = Array.isArray(prev) ? prev : prev?.subjects || []
        const next = list.map((s) =>
          s.id !== subjectId
            ? s
            : { ...s, topics: (s.topics || []).map((t) => (t.id === topic.id ? { ...t, completed: !newValue } : t)) }
        )
        return Array.isArray(prev) ? next : { ...prev, subjects: next }
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content">Progress tracker</h1>
        <p className="text-sm text-content-muted">Mark topics complete and watch your progress grow.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>Couldn't load your progress.
        </div>
      )}

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" label="Loading progress" />
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState icon="📈" title="Nothing to track yet" message="Add subjects and topics to start tracking your progress." />
      ) : (
        <div className="space-y-6">
          {subjects.map((s) => {
            const topics = s.topics || []
            const done = topics.filter((t) => t.completed).length
            const pct = topics.length ? Math.round((done / topics.length) * 100) : 0
            const remaining = topics.filter((t) => !t.completed)

            return (
              <Card key={s.id} as="article">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-content">{s.name}</h2>
                  <Badge tone={pct === 100 ? 'success' : 'primary'} icon={pct === 100 ? '🎉' : '📊'}>
                    {done}/{topics.length} complete
                  </Badge>
                </div>

                <ProgressBar value={pct} max={100} tone={pct === 100 ? 'success' : 'primary'} label="Completion" size="lg" />

                {/* Weekly targets (if provided by backend) */}
                {s.weeklyTarget != null && (
                  <p className="mt-3 text-sm text-content-muted">
                    <span aria-hidden="true">🎯 </span>
                    Weekly target: {s.weeklyTarget} topics
                  </p>
                )}

                {/* Topic checklist */}
                <ul className="mt-4 space-y-2">
                  {topics.map((t) => (
                    <li key={t.id} className="flex items-center gap-3">
                      <input
                        id={`topic-${t.id}`}
                        type="checkbox"
                        checked={Boolean(t.completed)}
                        disabled={busy === t.id}
                        onChange={() => toggleTopic(s.id, t)}
                        className="h-5 w-5 rounded border-line bg-surface text-primary focus:ring-2 focus:ring-primary"
                      />
                      <label
                        htmlFor={`topic-${t.id}`}
                        className={`flex-1 text-sm ${t.completed ? 'text-content-muted line-through' : 'text-content'}`}
                      >
                        {t.weekNumber != null && (
                          <span className="mr-2 text-xs font-semibold text-primary-700 dark:text-primary-400">W{t.weekNumber}</span>
                        )}
                        {t.title}
                      </label>
                      {t.completed && (
                        <span className="text-xs font-medium text-success" aria-hidden="true">
                          ✓ done
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Remaining summary */}
                <p className="mt-3 text-sm text-content-muted">
                  {remaining.length === 0
                    ? '🎉 All topics complete — great work!'
                    : `${remaining.length} topic${remaining.length === 1 ? '' : 's'} remaining.`}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
