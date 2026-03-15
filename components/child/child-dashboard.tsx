'use client'

// TODO: Implement child dashboard (primary child experience)
// Layout order: Header → Tree Hero → Savings Summary → Source Breakdown → Goals → Recent Activity
// Spec reference: Child Tree Screen (doc 5)
export default function ChildDashboard({ childId }: { childId: string }) {
  return (
    <div className="space-y-6 py-4">
      <p className="text-sm text-gray-400">Child dashboard — {childId}</p>
    </div>
  )
}
