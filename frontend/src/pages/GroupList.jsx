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

// Lists the groups the current user belongs to and lets them create a new one.
export default function GroupList() {
  const toast = useToast()
  const { data, loading, error, reload } = useFetch('/groups', { fallback: [] })
  const groups = Array.isArray(data) ? data : data?.groups || []

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', subject: '', semester: '', skillLevel: 'Beginner' })
  const [creating, setCreating] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      await client.post('/groups', form)
      toast.success(`Group "${form.name}" created.`)
      setShowCreate(false)
      setForm({ name: '', subject: '', semester: '', skillLevel: 'Beginner' })
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create the group.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content">My groups</h1>
          <p className="text-sm text-content-muted">Groups you have joined or created.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} icon={<span aria-hidden="true">＋</span>}>
          New group
        </Button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>Couldn't load your groups.
        </div>
      )}

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" label="Loading groups" />
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No groups yet"
          message="Create a group or find one that matches your subjects."
          action={
            <div className="flex gap-2">
              <Button onClick={() => setShowCreate(true)}>Create a group</Button>
              <Link
                to="/find-groups"
                className="inline-flex items-center rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-content shadow-soft hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Find groups
              </Link>
            </div>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.id}>
              <Card as="article" className="h-full">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-content">{g.name}</h2>
                  {g.isAdmin && (
                    <Badge tone="secondary" icon="★">
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {g.subject && <Badge tone="primary" icon="📘">{g.subject}</Badge>}
                  {g.semester && <Badge icon="📅">{g.semester}</Badge>}
                </div>
                <p className="mb-4 text-sm text-content-muted">{g.memberCount ?? 0} members</p>
                <Link
                  to={`/groups/${g.id}`}
                  className="inline-flex items-center rounded-xl bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Open group
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* Create-group modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create a study group"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreate(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" form="create-group-form" loading={creating}>
              Create
            </Button>
          </>
        }
      >
        <form id="create-group-form" onSubmit={handleCreate} className="space-y-4" noValidate>
          <Input label="Group name" value={form.name} onChange={update('name')} required />
          <Input label="Subject" value={form.subject} onChange={update('subject')} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Semester" value={form.semester} onChange={update('semester')} placeholder="Spring 2026" />
            <div>
              <label htmlFor="cg-level" className="mb-1 block text-sm font-medium text-content">
                Skill level
              </label>
              <select
                id="cg-level"
                value={form.skillLevel}
                onChange={update('skillLevel')}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
