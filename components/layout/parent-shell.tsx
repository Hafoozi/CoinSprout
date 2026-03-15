import AppHeader from '@/components/layout/app-header'

export default function ParentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="parent-bg">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 pb-10">
        {children}
      </main>
    </div>
  )
}
