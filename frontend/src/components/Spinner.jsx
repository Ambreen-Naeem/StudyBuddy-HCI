// Accessible loading spinner. role="status" + sr-only label so screen readers
// announce that content is loading.
const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-4',
}

export default function Spinner({ size = 'md', inline = false, label = 'Loading' }) {
  return (
    <span
      role="status"
      className={inline ? 'inline-flex items-center' : 'flex items-center justify-center'}
    >
      <span
        className={`animate-spin rounded-full border-current border-t-transparent text-primary ${SIZES[size]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
