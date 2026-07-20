// Accessible progress bar using the ARIA progressbar pattern. The numeric
// percentage is shown as text alongside the bar so the value is never conveyed
// by the fill width/color alone.
const TONES = {
  primary: 'bg-brand-gradient',
  secondary: 'bg-secondary',
  success: 'bg-gradient-to-r from-success to-green-400',
  warning: 'bg-warning',
}

export default function ProgressBar({
  value = 0,
  max = 100,
  tone = 'primary',
  label,
  showValue = true,
  size = 'md',
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const height = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'

  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-content-muted">
          {label && <span>{label}</span>}
          {showValue && <span aria-hidden="true">{pct}%</span>}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-surface-2 ${height}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label}: ${pct}% complete` : `${pct}% complete`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${TONES[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
