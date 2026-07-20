import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useFetch from '../hooks/useFetch'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

// A single stat tile. Icon + label + value (icon is decorative; the label
// carries the meaning for screen readers and color-blind users).
function StatTile({ icon, label, value, tone = 'primary' }) {
  const toneClass = {
    primary: 'bg-gradient-to-br from-primary to-primary-400 text-white shadow-glow',
    secondary: 'bg-gradient-to-br from-secondary to-secondary-400 text-white shadow-glow-secondary',
    success: 'bg-gradient-to-br from-success to-green-400 text-white',
    warning: 'bg-gradient-to-br from-warning to-amber-400 text-white',
  }[tone]
  return (
    <Card className="flex items-center gap-4">
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${toneClass}`} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-sm text-content-muted">{label}</p>
        <p className="text-2xl font-bold text-content">{value}</p>
      </div>
    </Card>
  )
}

// Default payload so the dashboard still renders meaningfully if the API is
// down. Mirrors the backend's nested shape.
const FALLBACK = {
  stats: {
    totalSubjects: 0,
    topicsCompleted: 0,
    topicsRemaining: 0,
    studyStreak: 0,
    progressPercentage: 0,
  },
  upcomingTasks: [],
  recommendedGroups: [],
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useFetch('/dashboard', { fallback: FALLBACK })

  const payload = data || FALLBACK
  const stats = payload.stats || FALLBACK.stats
  const upcomingTasks = payload.upcomingTasks || []
  const recommendedGroups = payload.recommendedGroups || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-content-muted">Here is your study snapshot.</p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>
          Couldn't reach the server, showing placeholder data.
        </div>
      )}

      {loading ? (
        <div className="py-16">
          <Spinner size="lg" label="Loading your dashboard" />
        </div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon="📘" label="Subjects" value={stats.totalSubjects} tone="primary" />
            <StatTile icon="✅" label="Topics completed" value={stats.topicsCompleted} tone="success" />
            <StatTile icon="📝" label="Topics remaining" value={stats.topicsRemaining} tone="warning" />
            <StatTile icon="🔥" label="Day streak" value={stats.studyStreak} tone="secondary" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Overall progress */}
            <Card title="Overall progress" className="lg:col-span-2">
              <ProgressBar
                value={stats.progressPercentage}
                max={100}
                tone="primary"
                label="All subjects"
                size="lg"
              />
              <p className="mt-3 text-sm text-content-muted">
                You've completed {stats.topicsCompleted} of{' '}
                {stats.topicsCompleted + stats.topicsRemaining} topics across all subjects.
              </p>
              <Link to="/progress" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                View detailed progress →
              </Link>
            </Card>

            {/* Upcoming tasks */}
            <Card
              title="Upcoming tasks"
              action={
                <Link to="/planner" className="text-xs font-medium text-primary hover:underline">
                  Open planner
                </Link>
              }
            >
              {upcomingTasks.length ? (
                <ul className="space-y-3">
                  {upcomingTasks.slice(0, 4).map((task) => (
                    <li key={task.id} className="flex items-start justify-between gap-2">
                      <span className="text-sm text-content">{task.title}</span>
                      <Badge tone="warning" icon="⏰">
                        {task.dueDate}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon="🎉" title="No upcoming tasks" message="You're all caught up." />
              )}
            </Card>
          </div>

          {/* Recommended groups */}
          <Card
            title="Recommended study groups"
            action={
              <Link to="/find-groups" className="text-xs font-medium text-primary hover:underline">
                Find more
              </Link>
            }
          >
            {recommendedGroups.length ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedGroups.slice(0, 6).map((g) => (
                  <li key={g.id} className="rounded-2xl border border-line bg-surface-2 p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-content">{g.name}</h3>
                      <Badge tone="secondary" icon="📘">
                        {g.subject}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-content-muted">{g.memberCount ?? 0} members</p>
                    <Link
                      to="/find-groups"
                      className="inline-flex items-center rounded-xl border border-line bg-surface px-3 py-1.5 text-sm font-medium text-content shadow-soft hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon="🔍"
                title="No recommendations yet"
                message="Tell us your subjects to get matched with study groups."
                action={
                  <Link to="/find-groups">
                    <Button>Find groups</Button>
                  </Link>
                }
              />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
