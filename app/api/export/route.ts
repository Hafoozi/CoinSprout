import * as XLSX from 'xlsx'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { calculateSavingsBalance, calculateTotalSpent } from '@/lib/calculations/savings'
import { calculateLifetimeEarnings } from '@/lib/calculations/lifetime-earnings'
import { calculateTotalAllocated, calculateUnallocatedSavings } from '@/lib/calculations/goals'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'

export async function GET() {
  const { family } = await requireParent()

  const [children, familySettings] = await Promise.all([
    getChildrenByFamilyId(family.id),
    getFamilySettings(family.id),
  ])

  const currency = familySettings?.currency_symbol ?? DEFAULT_CURRENCY

  // Fetch each child's transactions and goals in parallel
  const childData = await Promise.all(
    children.map(async (child) => {
      const [transactions, goals] = await Promise.all([
        getTransactionsByChildId(child.id),
        getGoalsByChildId(child.id),
      ])
      return { child, transactions, goals }
    })
  )

  const wb = XLSX.utils.book_new()

  // ── Summary sheet ──────────────────────────────────────────────────────────
  const summaryRows = [
    ['Name', 'Savings Balance', 'Lifetime Earned', 'Total Spent', 'In Goals', 'Free to Use'],
    ...childData.map(({ child, transactions, goals }) => {
      const balance  = calculateSavingsBalance(transactions)
      const earned   = calculateLifetimeEarnings(transactions)
      const spent    = calculateTotalSpent(transactions)
      const inGoals  = calculateTotalAllocated(goals)
      const free     = calculateUnallocatedSavings(balance, goals)
      return [child.name, balance, earned, spent, inGoals, free]
    }),
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
  // Format currency columns B-F
  const currencyFmt = `"${currency}"#,##0.00`
  const summaryRange = XLSX.utils.decode_range(summarySheet['!ref'] ?? 'A1')
  for (let row = 1; row <= summaryRange.e.r; row++) {
    for (let col = 1; col <= 5; col++) {
      const addr = XLSX.utils.encode_cell({ r: row, c: col })
      if (summarySheet[addr]) {
        summarySheet[addr].z = currencyFmt
      }
    }
  }
  summarySheet['!cols'] = [{ wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

  // ── Per-child sheets ───────────────────────────────────────────────────────
  for (const { child, transactions, goals } of childData) {
    const sheetName = child.name.slice(0, 31) // Excel sheet name limit

    // Transactions table
    const txRows = [
      ['Date', 'Type', 'Amount', 'Note'],
      ...transactions
        .slice()
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((tx) => [
          new Date(tx.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          tx.source.charAt(0).toUpperCase() + tx.source.slice(1),
          tx.amount,
          tx.note ?? '',
        ]),
    ]

    // Goals table (starts 2 rows after transactions)
    const goalRows = [
      ['Goal', 'Target', 'Saved', 'Progress', 'Complete?'],
      ...goals.map((g) => [
        g.name,
        g.target_price,
        g.allocated_amount,
        g.target_price > 0 ? `${Math.round((g.allocated_amount / g.target_price) * 100)}%` : '0%',
        g.allocated_amount >= g.target_price ? 'Yes' : 'No',
      ]),
    ]

    // Write transactions starting at A1, goals starting 2 rows below
    const goalOffset = txRows.length + 2

    const ws = XLSX.utils.aoa_to_sheet(txRows)
    XLSX.utils.sheet_add_aoa(ws, goalRows, { origin: { r: goalOffset, c: 0 } })

    // Format amount column (C) in transaction rows
    for (let row = 1; row < txRows.length; row++) {
      const addr = XLSX.utils.encode_cell({ r: row, c: 2 })
      if (ws[addr]) ws[addr].z = currencyFmt
    }
    // Format target + saved columns in goals rows
    for (let row = goalOffset + 1; row < goalOffset + goalRows.length; row++) {
      for (const col of [1, 2]) {
        const addr = XLSX.utils.encode_cell({ r: row, c: col })
        if (ws[addr]) ws[addr].z = currencyFmt
      }
    }

    ws['!cols'] = [{ wch: 24 }, { wch: 14 }, { wch: 12 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  }

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const today = new Date().toISOString().slice(0, 10)

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="coinsprout-${today}.xlsx"`,
    },
  })
}
