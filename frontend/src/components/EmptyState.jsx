export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-ink-800 flex items-center justify-center mb-4">
          <Icon size={22} className="text-ink-500" />
        </div>
      )}
      <h3 className="text-sm font-medium text-ink-300 mb-1">{title}</h3>
      {description && <p className="text-xs text-ink-600 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}
