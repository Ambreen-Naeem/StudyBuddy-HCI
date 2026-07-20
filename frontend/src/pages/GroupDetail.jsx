import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import useFetch from '../hooks/useFetch'
import { useToast } from '../components/Toast/ToastContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ProgressBar from '../components/ProgressBar'
import ConfirmDialog from '../components/ConfirmDialog'

// Group detail page. Shows members, a discussion board (post + reply), group
// progress, and — only for admins — controls to delete the group, remove
// members, and accept/reject pending join requests.
export default function GroupDetail() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const { data, loading, error, reload } = useFetch(`/groups/${groupId}`, { fallback: null })
  const group = data

  const [post, setPost] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [posting, setPosting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isAdmin = group?.isAdmin

  // ----- Discussion board -------------------------------------------------
  async function submitPost(e) {
    e.preventDefault()
    if (!post.trim()) return
    setPosting(true)
    try {
      await client.post(`/groups/${groupId}/posts`, { content: post })
      setPost('')
      toast.success('Posted to the discussion board.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not post.')
    } finally {
      setPosting(false)
    }
  }

  async function submitReply(postId) {
    if (!replyText.trim()) return
    try {
      await client.post(`/groups/${groupId}/posts/${postId}/replies`, { content: replyText })
      setReplyText('')
      setReplyTo(null)
      toast.success('Reply added.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not reply.')
    }
  }

  // ----- Admin actions ----------------------------------------------------
  async function removeMember(memberId) {
    try {
      await client.delete(`/groups/${groupId}/members/${memberId}`)
      toast.success('Member removed.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not remove member.')
    }
  }

  async function respondToRequest(requestId, accept) {
    try {
      await client.post(`/groups/requests/${requestId}/${accept ? 'accept' : 'reject'}`)
      toast.success(accept ? 'Request accepted.' : 'Request rejected.')
      reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update the request.')
    }
  }

  async function deleteGroup() {
    setDeleting(true)
    try {
      await client.delete(`/groups/${groupId}`)
      toast.success('Group deleted.')
      navigate('/groups')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete the group.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="lg" label="Loading group" />
      </div>
    )
  }

  if (error || !group) {
    return (
      <EmptyState
        icon="⚠️"
        title="Group unavailable"
        message="We couldn't load this group. It may have been deleted or you may not have access."
        action={<Button onClick={() => navigate('/groups')}>Back to my groups</Button>}
      />
    )
  }

  const members = group.members || []
  const posts = group.posts || []
  const requests = group.joinRequests || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-content">{group.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.subject && <Badge tone="primary" icon="📘">{group.subject}</Badge>}
            {group.semester && <Badge icon="📅">{group.semester}</Badge>}
            {group.skillLevel && <Badge tone="secondary" icon="🎯">{group.skillLevel}</Badge>}
            {isAdmin && <Badge tone="secondary" icon="★">You are admin</Badge>}
          </div>
        </div>
        {isAdmin && (
          <Button variant="danger" onClick={() => setConfirmDelete(true)} icon={<span aria-hidden="true">🗑</span>}>
            Delete group
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column: discussion */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Discussion board">
            <form onSubmit={submitPost} className="mb-5" noValidate>
              <Input
                label="Share something with the group"
                textarea
                rows={3}
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Ask a question or share a resource…"
              />
              <div className="mt-2 flex justify-end">
                <Button type="submit" size="sm" loading={posting} disabled={!post.trim()}>
                  Post
                </Button>
              </div>
            </form>

            {posts.length === 0 ? (
              <EmptyState icon="💬" title="No posts yet" message="Be the first to start a discussion." />
            ) : (
              <ul className="space-y-4">
                {posts.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-line bg-surface-2 p-4">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-content">{p.author}</span>
                      <span className="text-xs text-content-muted">{p.createdAt}</span>
                    </div>
                    <p className="text-sm text-content">{p.content}</p>

                    {/* Replies */}
                    {p.replies?.length > 0 && (
                      <ul className="mt-3 space-y-2 border-l-2 border-line pl-4">
                        {p.replies.map((r) => (
                          <li key={r.id} className="text-sm">
                            <span className="font-medium text-content">{r.author}: </span>
                            <span className="text-content-muted">{r.content}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Reply composer */}
                    {replyTo === p.id ? (
                      <div className="mt-3">
                        <Input
                          label={`Reply to ${p.author}`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply…"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" onClick={() => submitReply(p.id)} disabled={!replyText.trim()}>
                            Send reply
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(p.id)
                          setReplyText('')
                        }}
                        className="mt-2 text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        ↪ Reply
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Side column: progress, members, admin */}
        <div className="space-y-6">
          {/* Group progress */}
          <Card title="Group progress">
            <ProgressBar value={group.progress ?? 0} max={100} tone="success" label="Syllabus covered" size="lg" />
            <p className="mt-2 text-sm text-content-muted">
              The group has covered {group.progress ?? 0}% of the shared syllabus.
            </p>
          </Card>

          {/* Members */}
          <Card title={`Members (${members.length})`}>
            {members.length === 0 ? (
              <EmptyState icon="👥" title="No members" />
            ) : (
              <ul className="space-y-2">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white" aria-hidden="true">
                        {(m.name || '?').slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-sm text-content">{m.name}</span>
                      {m.isAdmin && <Badge tone="secondary" icon="★">Admin</Badge>}
                    </span>
                    {isAdmin && !m.isAdmin && (
                      <button
                        type="button"
                        onClick={() => removeMember(m.userId)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-error hover:bg-error-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
                        aria-label={`Remove ${m.name} from the group`}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Admin: join requests */}
          {isAdmin && (
            <Card title={`Join requests (${requests.length})`}>
              {requests.length === 0 ? (
                <p className="text-sm text-content-muted">No pending requests.</p>
              ) : (
                <ul className="space-y-3">
                  {requests.map((req) => (
                    <li key={req.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-content">{req.name}</span>
                      <span className="flex gap-1">
                        <Button size="sm" variant="success" onClick={() => respondToRequest(req.id, true)} icon={<span aria-hidden="true">✓</span>}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => respondToRequest(req.id, false)} icon={<span aria-hidden="true">✕</span>}>
                          Reject
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteGroup}
        loading={deleting}
        title="Delete this group?"
        message={`"${group.name}" and all its discussions will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete group"
      />
    </div>
  )
}
