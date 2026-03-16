function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-sprout-50 ${className}`} />
}

export default function ChildProfileLoading() {
  return (
    <div className="space-y-6 py-6">
      {/* Back link */}
      <Bone className="h-4 w-24" />

      {/* Child identity */}
      <div className="flex items-center gap-4">
        <Bone className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Bone className="h-6 w-36" />
          <Bone className="h-4 w-24" />
        </div>
      </div>

      {/* Financial summary strip */}
      <Bone className="h-20 w-full" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Bone className="h-8 w-24" />
        <Bone className="h-8 w-32" />
        <Bone className="h-8 w-24" />
      </div>

      {/* Goals */}
      <div className="space-y-3">
        <Bone className="h-4 w-16" />
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
      </div>

      {/* Activity chart */}
      <Bone className="h-40 w-full" />

      {/* Activity rows */}
      <div className="space-y-2">
        <Bone className="h-4 w-20" />
        {[...Array(4)].map((_, i) => (
          <Bone key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
