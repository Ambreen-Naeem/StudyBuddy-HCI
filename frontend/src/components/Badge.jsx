// Small status pill. Pairs an optional icon with text so status is never
// communicated by color alone (color-blind friendly).
const TONES = {
  primary:
    'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary/15 dark:text-primary-400 dark:border-primary/30',
  secondary:
    'bg-secondary-50 text-secondary-700 border-secondary-100 dark:bg-secondary/15 dark:text-secondary-400 dark:border-secondary/30',
  success:
    'bg-success-50 text-success border-success-100 dark:bg-success/15 dark:text-green-400 dark:border-success/30',
  warning:
    'bg-warning-50 text-warning border-warning-100 dark:bg-warning/15 dark:text-amber-400 dark:border-warning/30',
  error:
    'bg-error-50 text-error border-error-100 dark:bg-error/15 dark:text-red-400 dark:border-error/30',
  neutral: 'bg-surface-2 text-content-muted border-line',
}

export default function Badge({ children, tone = 'neutral', icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}
