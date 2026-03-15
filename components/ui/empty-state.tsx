interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export default function EmptyState({ icon = '🌱', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-gray-700">{title}</p>
      {description && <p className="text-sm text-gray-400 max-w-xs">{description}</p>}
    </div>
  )
}
