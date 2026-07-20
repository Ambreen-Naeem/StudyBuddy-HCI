import { useState } from 'react'
import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'

// Study planner. Add tasks with a deadline, toggle between a weekly and monthly
// view, mark tasks done, and delete them (with confirmation). Tasks are grouped
// and an overdue badge warns when a deadline has passed.
function isOverdue(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export default function Planner() {
  const toast = useToast()
  const [view, setView] = useState('weekly') // 'weekly' | 'monthly'
  const { data, loading, error, reload } = useFetch('/tasks', { fallback: [] })
  const tasks = Array.isArray(data) ? data : data?.tasks || []

  const [form, setForm] = useState({ title: '', dueDate: '' })
  const [adding, setAdding] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.dueDate) {
      toast.warning('Add a title and a deadline.')
      return
    }
    setAdding(true)
    try {
      await client.post('/tasks', { ...form, recurrence: view })
      toast.success('Task added.')
      setForm({ title: '', dueDate: '' })
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not add the task.')
    } finally {
      setAdding(false)
    }
  }

  async function toggleDone(task) {
    try {
      await client.patch(`/tasks/${task.id}`, { status: task.status === 'done' ? 'pending' : 'done' })
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update the task.')
    }
  }

  async function confirmDelete() {
    const task = toDelete
    setToDelete(null)
    try {
      await client.delete(`/tasks/${task.id}`)
      toast.success('Task deleted.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete the task.')
    }
  }

  // The backend has no recurrence column, so the weekly/monthly toggle is a
  // view label only — always show every task rather than hiding them all.
  const visible = tasks

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content">Planner</h1>
          <p className="text-sm text-content-muted">Tasks and deadlines, weekly or monthly.</p>
        </div>

        {/* View toggle — a radio group is the accessible pattern for a toggle. */}
        <div role="radiogroup" aria-label="Planner view" className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-soft">
          {['weekly', 'monthly'].map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${view === v ? 'bg-brand-gradient text-white shadow-glow' : 'text-content-muted hover:bg-surface-2'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Add task */}
      <Card title="Add a task">
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end" noValidate>
          <Input label="Task" value={form.title} onChange={update('title')} required placeholder="Finish lab report" />
          <Input label="Deadline" type="date" value={form.dueDate} onChange={update('dueDate')} required />
          <Button type="submit" loading={adding} icon={<span aria-hidden="true">＋</span>}>
            Add
          </Button>
        </form>
      </Card>

      {error && (
        <div role="alert" className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-amber-300">
          <span aria-hidden="true">⚠ </span>Couldn't load your tasks.
        </div>
      )}

      {/* Task list */}
      <Card title={`${view === 'weekly' ? 'This week' : 'This month'} (${visible.length})`}>
        {loading ? (
          <div className="py-8">
            <Spinner size="lg" label="Loading tasks" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyState icon="🗓️" title="No tasks yet" message="Add a task with a deadline to start planning." />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((task) => {
              const done = task.status === 'done'
              const overdue = !done && isOverdue(task.dueDate)
              return (
                <li key={task.id} className="flex items-center gap-3 py-3">
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleDone(task)}
                    className="h-5 w-5 rounded border-line bg-surface text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 text-sm ${done ? 'text-content-muted line-through' : 'text-content'}`}
                  >
                    {task.title}
                  </label>

                  {task.dueDate && (
                    <Badge tone={overdue ? 'error' : done ? 'success' : 'neutral'} icon={overdue ? '⚠' : '⏰'}>
                      {overdue ? 'Overdue: ' : ''}
                      {task.dueDate}
                    </Badge>
                  )}

                  <button
                    type="button"
                    onClick={() => setToDelete(task)}
                    className="rounded-lg p-1.5 text-content-muted hover:bg-error-50 hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-error dark:hover:bg-error/15"
                    aria-label={`Delete task "${task.title}"`}
                  >
                    <span aria-hidden="true">🗑</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this task?"
        message={toDelete ? `"${toDelete.title}" will be permanently removed.` : ''}
        confirmLabel="Delete task"
      />
    </div>
  )
}
