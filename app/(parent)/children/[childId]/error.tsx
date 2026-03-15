'use client'

// TODO: Replace with a proper error UI component
export default function ChildProfileError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-6 text-center space-y-3">
      <p className="text-red-600 font-medium">Something went wrong.</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        onClick={reset}
        className="text-sm text-sprout-600 underline"
      >
        Try again
      </button>
    </div>
  )
}
