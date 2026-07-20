import { useEffect, useRef } from 'react'

// Accessible modal dialog.
// - role="dialog" + aria-modal so assistive tech treats it as a dialog.
// - Labelled by its title via aria-labelledby.
// - Focus trap: Tab/Shift+Tab cycle within the dialog; focus moves in on open
//   and returns to the trigger on close.
// - Escape closes; clicking the backdrop closes.
export default function Modal({ open, onClose, title, children, footer, labelId = 'modal-title' }) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement

    // Move focus into the dialog.
    const node = dialogRef.current
    const focusable = node?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable?.[0]
    first ? first.focus() : node?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return
      // Simple focus trap.
      const list = Array.from(focusable)
      const firstEl = list[0]
      const lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // Prevent background scroll while open.
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      // Restore focus to whatever opened the dialog.
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        // Close only when the backdrop itself is clicked.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-card-lg focus:outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={labelId} className="text-lg font-semibold text-content">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-content-muted hover:bg-surface-2 hover:text-content"
            aria-label="Close dialog"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>
        <div className="text-sm text-content">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
