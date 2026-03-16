'use client'

export default function ChildProfileError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="py-16 flex flex-col items-center text-center gap-4">
      <span className="text-5xl">🌧️</span>
      <div>
        <p className="font-semibold text-gray-700">Something went wrong</p>
        <p className="mt-1 text-sm text-gray-400">{error.message}</p>
      </div>
      <button
        onClick={reset}
        className="rounded-xl bg-sprout-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sprout-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
