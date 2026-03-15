'use client'

// TODO: Implement child-mode shell
// Verifies child PIN before rendering children
// Shows child-friendly header with locked profile switcher
export default function ChildShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="child-bg">
      <main className="max-w-2xl mx-auto p-4">{children}</main>
    </div>
  )
}
