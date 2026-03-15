import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import CreateChildForm from '@/components/parent/create-child-form'

export const metadata: Metadata = {
  title: 'Add Child — CoinSprout',
}

export default async function NewChildPage() {
  // Guard: must be an authenticated parent before rendering the form.
  await requireParent()

  return (
    <div className="mx-auto max-w-md py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sprout-800">Add a child</h1>
        <p className="text-sm text-gray-500 mt-1">
          Children are profiles within your family — they don&apos;t need their own account.
        </p>
      </div>
      <div className="card-surface p-6">
        <CreateChildForm />
      </div>
    </div>
  )
}
