/**
 * Auth layout — centers the login card on screen.
 * No navigation chrome. Clean, minimal.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-sprout-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
