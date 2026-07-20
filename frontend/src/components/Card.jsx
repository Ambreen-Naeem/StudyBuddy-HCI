// Simple rounded-xl card container with a soft shadow. Optional title renders
// a semantic heading. Use `as` to control the wrapper element (section/article).
export default function Card({ title, action, children, className = '', as: Tag = 'section' }) {
  return (
    <Tag
      className={`glass-surface rounded-2xl border border-line p-5 shadow-card transition-shadow hover:shadow-card-lg ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-semibold text-content">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </Tag>
  )
}
