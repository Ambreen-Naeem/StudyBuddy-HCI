import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Input from '../components/Input'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ProgressBar from '../components/ProgressBar'

// Lists the user's subjects and lets them add a new one. Each subject links to
// its syllabus detail where topics + weekly breakdown live.
export default function Subjects() {
  const toast = useToast()
  const { data, loading, error, reload } = useFetch('/subjects', { fallback: [] })
  const subjects = Array.isArray(data) ? data : data?.subjects || []

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', semester: '' })
  const [saving, setSaving] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await client.post('/subjects', form)
      toast.success(`Added "${form.name}".`)
      setShowAdd(false)
      setForm({ name: '', code: '', semester: '' })
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not add the subject.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content">Subjects</h1>
          <p className="text-sm text-content-muted">Your enrolled subjects and their syllabi.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} icon={<span aria-hidden="true">＋</span>}>
          Add subject
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>Couldn't load your subjects.
        </div>
      )}

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" label="Loading subjects" />
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon="📘"
          title="No subjects yet"
          message="Add a subject and enter its topics to get an automatic weekly study plan."
          action={<Button onClick={() => setShowAdd(true)}>Add your first subject</Button>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const total = s.totalTopics ?? 0
            const done = s.completedTopics ?? 0
            const pct = total ? Math.round((done / total) * 100) : 0
            return (
              <li key={s.id}>
                <Card as="article" className="h-full">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-content">{s.name}</h2>
                    {s.code && <Badge icon="#">{s.code}</Badge>}
                  </div>
                  {s.semester && <p className="mb-3 text-xs text-content-muted">{s.semester}</p>}
                  <ProgressBar value={pct} max={100} tone="primary" label={`${done}/${total} topics`} size="sm" />
                  <Link
                    to={`/subjects/${s.id}`}
                    className="mt-4 inline-flex items-center rounded-xl bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Open syllabus
                  </Link>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add a subject"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="add-subject-form" loading={saving}>
              Add subject
            </Button>
          </>
        }
      >
        <form id="add-subject-form" onSubmit={handleAdd} className="space-y-4" noValidate>
          <Input label="Subject name" value={form.name} onChange={update('name')} required placeholder="Data Structures" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Course code" value={form.code} onChange={update('code')} placeholder="CS201" />
            <Input label="Semester" value={form.semester} onChange={update('semester')} placeholder="Spring 2026" />
          </div>
        </form>
      </Modal>
    </div>
  )
}
