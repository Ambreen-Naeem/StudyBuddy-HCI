// Friendly empty-state placeholder. Used whenever a list has no items, so the
// UI never shows a blank void (a key usability heuristic). Optional action lets
// the user resolve the emptiness (e.g. "Add a subject").
export default function EmptyState({ icon = '📭', title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface-2 px-6 py-12 text-center">
      <div className="mb-3 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-content">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-content-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
