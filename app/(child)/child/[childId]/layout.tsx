import { getChildShellInfo } from '@/actions/children'
import ChildShell from '@/components/layout/child-shell'

interface Props {
  children: React.ReactNode
  params:   { childId: string }
}

/**
 * Server layout for all /child/[childId]/* routes.
 * Fetches the shell data once on the server — no client-side fetch or loading flash.
 */
export default async function ChildIdLayout({ children, params }: Props) {
  const { childId } = params
  const info = await getChildShellInfo(childId)

  return (
    <ChildShell
      childId={childId}
      name={info?.name ?? ''}
      avatarColor={info?.avatarColor ?? 'sprout'}
      siblings={info?.siblings ?? []}
      quickAccessEnabled={info?.quickAccessEnabled ?? false}
    >
      {children}
    </ChildShell>
  )
}
