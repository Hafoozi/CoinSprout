import ChildShell from '@/components/layout/child-shell'

/**
 * Child route group layout.
 * Wraps all /child/[childId] routes.
 * No Supabase auth guard here — child mode is a UI-level state, not an auth state.
 * The child-shell component handles PIN verification before rendering.
 */
export default function ChildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ChildShell>{children}</ChildShell>
}
