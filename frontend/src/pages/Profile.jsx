import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast/ToastContext'
import client from '../api/client'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Badge from '../components/Badge'

// Profile page: view and edit the current user's details (name, university,
// semester, skill level, bio). Saves via PUT /profile and updates the cached
// user in AuthContext on success.
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function Profile() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    name: '',
    university: '',
    semester: '',
    skillLevel: 'Beginner',
    bio: '',
  })
  const [saving, setSaving] = useState(false)

  // Seed the form from the current user once it is available.
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || '',
        university: user.university || '',
        semester: user.semester || '',
        skillLevel: user.skillLevel || 'Beginner',
        bio: user.bio || '',
      }))
    }
  }, [user])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await client.put('/auth/me', form)
      updateUser(data.user || form)
      toast.success('Profile updated.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (form.name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Your profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Summary card */}
        <Card className="text-center lg:col-span-1">
          <span
            className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white shadow-glow"
            aria-hidden="true"
          >
            {initials}
          </span>
          <h2 className="text-lg font-semibold text-content">{form.name || 'Your name'}</h2>
          <p className="text-sm text-content-muted">{user?.email}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {form.university && <Badge icon="🏫">{form.university}</Badge>}
            <Badge tone="secondary" icon="🎯">
              {form.skillLevel}
            </Badge>
          </div>
        </Card>

        {/* Edit form */}
        <Card title="Edit details" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full name" value={form.name} onChange={update('name')} required />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="University" value={form.university} onChange={update('university')} />
              <Input label="Semester" value={form.semester} onChange={update('semester')} placeholder="e.g. Spring 2026" />
            </div>

            <div>
              <label htmlFor="skill" className="mb-1 block text-sm font-medium text-content">
                Skill level
              </label>
              <select
                id="skill"
                value={form.skillLevel}
                onChange={update('skillLevel')}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Bio" textarea rows={3} value={form.bio} onChange={update('bio')} helper="A short intro for study partners." />

            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
