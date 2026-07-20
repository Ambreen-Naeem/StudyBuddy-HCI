import { createContext, useContext, useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// ToastContext
// ---------------------------------------------------------------------------
// Lightweight, accessible toast system. Toasts are announced via an
// aria-live region so screen-reader users hear feedback. Each toast pairs an
// icon + text so meaning never relies on color alone (color-blind friendly).

const ToastContext = createContext(null)

let idCounter = 0

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

const STYLES = {
  success: 'border-success dark:bg-success/15 dark:text-green-300',
  error: 'border-error dark:bg-error/15 dark:text-red-300',
  warning: 'border-warning dark:bg-warning/15 dark:text-amber-300',
  info: 'border-primary dark:bg-primary/15 dark:text-primary-400',
}

const ICON_COLORS = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-primary',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'info', timeout = 4000) => {
      const id = ++idCounter
      setToasts((list) => [...list, { id, message, type }])
      if (timeout) setTimeout(() => remove(id), timeout)
      return id
    },
    [remove]
  )

  // Sugar helpers.
  const toast = {
    success: (m, t) => push(m, 'success', t),
    error: (m, t) => push(m, 'error', t),
    warning: (m, t) => push(m, 'warning', t),
    info: (m, t) => push(m, 'info', t),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* aria-live polite so updates are announced without interrupting. */}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-2xl border border-line border-l-4 bg-surface px-4 py-3 shadow-card-lg ${STYLES[t.type]}`}
          >
            <span aria-hidden="true" className={`text-lg font-bold leading-none ${ICON_COLORS[t.type]}`}>
              {ICONS[t.type]}
            </span>
            <p className="flex-1 text-sm font-medium text-content">{t.message}</p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="rounded p-0.5 text-content-muted hover:text-content"
              aria-label="Dismiss notification"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
