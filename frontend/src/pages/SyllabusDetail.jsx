import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

// Syllabus detail: enter topic titles (one per line) and the system lays them
// out as a weekly breakdown — Week 1 / Topic A, Week 2 / Topic B, … The number
// of topics per week is configurable so a heavy week can hold several topics.
export default function SyllabusDetail() {
  const { subjectId } = useParams()
  const toast = useToast()
  const { data, loading, error, reload } = useFetch(`/subjects/${subjectId}`, { fallback: null })
  const subject = data

  const [raw, setRaw] = useState('')
  const [perWeek, setPerWeek] = useState(1)
  const [saving, setSaving] = useState(false)

  // Build a preview of the weekly plan from the textarea so the user sees the
  // auto-breakdown before saving.
  const parsedTopics = raw
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)

  const weeks = []
  for (let i = 0; i < parsedTopics.length; i += perWeek) {
    weeks.push(parsedTopics.slice(i, i + perWeek))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (parsedTopics.length === 0) {
      toast.warning('Enter at least one topic.')
      return
    }
    setSaving(true)
    try {
      // Create a syllabus for this subject; the backend auto-generates the
      // weekly topic breakdown from the list of topic titles.
      await client.post(`/subjects/${subjectId}/syllabus`, {
        title: subject.name ? `${subject.name} syllabus` : 'Syllabus',
        topics: parsedTopics,
      })
      toast.success(`Added ${parsedTopics.length} topics across ${weeks.length} weeks.`)
      setRaw('')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save topics.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" label="Loading syllabus" />
      </div>
    )
  }

  if (error || !subject) {
    return (
      <EmptyState
        icon="⚠️"
        title="Subject unavailable"
        message="We couldn't load this subject."
        action={
          <Link to="/subjects">
            <Button>Back to subjects</Button>
          </Link>
        }
      />
    )
  }

  // Existing saved weekly plan (if the backend returns one).
  const savedWeeks = subject.weeks || []

  return (
    <div className="space-y-6">
      <div>
        <Link to="/subjects" className="text-sm font-medium text-primary hover:underline">
          ← Subjects
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-content">{subject.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {subject.code && <Badge icon="#">{subject.code}</Badge>}
          {subject.semester && <Badge icon="📅">{subject.semester}</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Add topics */}
        <Card title="Add topics">
          <form onSubmit={handleSave} className="space-y-4" noValidate>
            <Input
              label="Topic titles"
              textarea
              rows={8}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              helper="One topic per line. We'll lay them out into weeks automatically."
              placeholder={'Arrays and Strings\nLinked Lists\nStacks and Queues\nTrees\nGraphs'}
            />
            <div className="flex items-end gap-3">
              <div className="w-40">
                <label htmlFor="perweek" className="mb-1 block text-sm font-medium text-content">
                  Topics per week
                </label>
                <input
                  id="perweek"
                  type="number"
                  min={1}
                  max={7}
                  value={perWeek}
                  onChange={(e) => setPerWeek(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" loading={saving} disabled={parsedTopics.length === 0}>
                Save plan
              </Button>
            </div>
          </form>
        </Card>

        {/* Live preview of the weekly breakdown */}
        <Card title="Weekly breakdown preview">
          {weeks.length === 0 ? (
            <EmptyState icon="🗓️" title="Nothing to preview" message="Type some topics to see the auto weekly plan." />
          ) : (
            <ol className="space-y-3">
              {weeks.map((topics, idx) => (
                <li key={idx} className="rounded-2xl border border-line bg-surface-2 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">Week {idx + 1}</p>
                  <ul className="list-inside list-disc text-sm text-content">
                    {topics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      {/* Currently saved plan */}
      <Card
        title="Current syllabus plan"
        action={
          <Link to="/progress" className="text-xs font-medium text-primary hover:underline">
            Track progress →
          </Link>
        }
      >
        {savedWeeks.length === 0 ? (
          <EmptyState icon="📋" title="No saved plan yet" message="Add topics above to build your weekly plan." />
        ) : (
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedWeeks.map((wk, idx) => (
              <li key={idx} className="rounded-2xl border border-line bg-surface-2 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                  Week {wk.week ?? idx + 1}
                </p>
                <ul className="space-y-1 text-sm text-content">
                  {(wk.topics || []).map((t) => (
                    <li key={t.id ?? t.title} className="flex items-center gap-2">
                      <span aria-hidden="true">{t.completed ? '✅' : '⬜'}</span>
                      <span className={t.completed ? 'text-content-muted line-through' : ''}>{t.title}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  )
}
