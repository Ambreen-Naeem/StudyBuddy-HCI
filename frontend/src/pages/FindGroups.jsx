import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

// Group matching page. The user filters by subject, semester and skill level;
// we ask the backend for matched + recommended groups and let them send a join
// request. Each card uses icon+text badges so meaning is never color-only.
const SKILL_LEVELS = ['Any', 'Beginner', 'Intermediate', 'Advanced']

export default function FindGroups() {
  const toast = useToast()
  const [filters, setFilters] = useState({ subject: '', semester: '', skillLevel: 'Any' })
  const [results, setResults] = useState(null) // null = not searched yet
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(null) // id currently being joined

  function update(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    try {
      // Drop empty filters and the "Any" skill-level sentinel so the backend
      // doesn't try to match on a literal "Any".
      const params = {}
      if (filters.subject.trim()) params.subject = filters.subject.trim()
      if (filters.semester.trim()) params.semester = filters.semester.trim()
      if (filters.skillLevel && filters.skillLevel !== 'Any') params.skillLevel = filters.skillLevel
      const { data } = await client.get('/groups/match', { params })
      // Support either a flat array or { matched, recommended }.
      setResults(
        Array.isArray(data)
          ? { matched: data, recommended: [] }
          : { matched: data.matched || [], recommended: data.recommended || [] }
      )
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not search for groups.')
      setResults({ matched: [], recommended: [] })
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(group) {
    setJoining(group.id)
    try {
      await client.post(`/groups/${group.id}/join`)
      toast.success(`Join request sent to "${group.name}".`)
      // Reflect the pending state locally.
      setResults((r) => ({
        matched: r.matched.map((g) => (g.id === group.id ? { ...g, requested: true } : g)),
        recommended: r.recommended.map((g) => (g.id === group.id ? { ...g, requested: true } : g)),
      }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send join request.')
    } finally {
      setJoining(null)
    }
  }

  function GroupCard({ group }) {
    return (
      <li className="rounded-2xl border border-line bg-surface-2 p-4 transition hover:-translate-y-0.5 hover:shadow-card">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-content">{group.name}</h3>
          {group.matchScore != null && (
            <Badge tone="success" icon="✓">
              {group.matchScore}% match
            </Badge>
          )}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {group.subject && <Badge tone="primary" icon="📘">{group.subject}</Badge>}
          {group.semester && <Badge icon="📅">{group.semester}</Badge>}
          {group.skillLevel && <Badge tone="secondary" icon="🎯">{group.skillLevel}</Badge>}
        </div>
        <p className="mb-3 text-sm text-content-muted">{group.memberCount ?? 0} members</p>
        <div className="flex gap-2">
          <Link
            to={`/groups/${group.id}`}
            className="inline-flex items-center rounded-xl border border-line bg-surface px-3 py-1.5 text-sm font-medium text-content shadow-soft hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View
          </Link>
          {group.requested ? (
            <Badge tone="warning" icon="⏳">
              Request sent
            </Badge>
          ) : (
            <Button size="sm" loading={joining === group.id} onClick={() => handleJoin(group)} icon={<span aria-hidden="true">＋</span>}>
              Join
            </Button>
          )}
        </div>
      </li>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content">Find study groups</h1>
        <p className="text-sm text-content-muted">Pick your subject, semester and level to get matched.</p>
      </div>

      {/* Filter form */}
      <Card as="form" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-content">
              Subject
            </label>
            <input
              id="subject"
              value={filters.subject}
              onChange={update('subject')}
              placeholder="e.g. Algorithms"
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content placeholder:text-content-muted shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="semester" className="mb-1 block text-sm font-medium text-content">
              Semester
            </label>
            <input
              id="semester"
              value={filters.semester}
              onChange={update('semester')}
              placeholder="e.g. Spring 2026"
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content placeholder:text-content-muted shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="level" className="mb-1 block text-sm font-medium text-content">
              Skill level
            </label>
            <select
              id="level"
              value={filters.skillLevel}
              onChange={update('skillLevel')}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content placeholder:text-content-muted shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {SKILL_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" loading={loading} className="w-full" icon={<span aria-hidden="true">🔍</span>}>
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="py-12">
          <Spinner size="lg" label="Searching for groups" />
        </div>
      ) : results == null ? (
        <EmptyState icon="🔍" title="Search to see matches" message="Use the filters above to find study groups that fit you." />
      ) : (
        <>
          <Card title={`Matched groups (${results.matched.length})`}>
            {results.matched.length ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.matched.map((g) => (
                  <GroupCard key={g.id} group={g} />
                ))}
              </ul>
            ) : (
              <EmptyState icon="🤔" title="No exact matches" message="Try widening your filters or check the recommendations below." />
            )}
          </Card>

          {results.recommended.length > 0 && (
            <Card title="Recommended for you">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.recommended.map((g) => (
                  <GroupCard key={g.id} group={g} />
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
