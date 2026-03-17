import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import ParentShell from '@/components/layout/parent-shell'

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Fetch the family record to get family_id for settings lookup
  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user.id)
    .single()

  const familySettings = family ? await getFamilySettings(family.id) : null
  const currency = familySettings?.currency_symbol ?? DEFAULT_CURRENCY

  return (
    <CurrencyProvider symbol={currency}>
      <ParentShell>{children}</ParentShell>
    </CurrencyProvider>
  )
}
