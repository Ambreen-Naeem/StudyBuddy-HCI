// Reusable, accessible button. Renders a real <button> (never a div) so it is
// keyboard-focusable and announces correctly. Supports variants, sizes, a
// loading state (with aria-busy) and an optional leading icon.
import Spinner from './Spinner'

const VARIANTS = {
  primary:
    'bg-brand-gradient text-white hover:shadow-glow hover:-translate-y-0.5 focus-visible:ring-primary',
  secondary:
    'bg-secondary text-white hover:bg-secondary-700 hover:shadow-glow-secondary hover:-translate-y-0.5 focus-visible:ring-secondary',
  success:
    'bg-success text-white hover:brightness-95 hover:-translate-y-0.5 focus-visible:ring-success',
  danger:
    'bg-error text-white hover:brightness-95 hover:-translate-y-0.5 focus-visible:ring-error',
  outline:
    'border border-line bg-surface text-content hover:bg-surface-2 focus-visible:ring-primary',
  ghost: 'bg-transparent text-content-muted hover:bg-surface-2 focus-visible:ring-primary',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon = null,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium shadow-soft transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? <Spinner size="sm" inline /> : icon}
      {children}
    </button>
  )
}
