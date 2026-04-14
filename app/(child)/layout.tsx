/**
 * Child route group layout — passthrough.
 * The ChildShell is applied at app/(child)/child/[childId]/layout.tsx
 * so it has access to the childId param and can fetch shell data server-side.
 * The /kids route renders its own standalone UI.
 */
export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
