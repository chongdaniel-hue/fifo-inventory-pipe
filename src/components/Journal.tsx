import { Panel } from './Panel'
import { formatAmount, formatDate } from '../lib/format'
import type { Batch, Sale } from '../types'

interface Entry {
  key: string
  order: number // recorded order; the two sale entries share the sale's id, revenue first
  sub: number
  dateMs: number
  type: string
  debit: string
  credit: string
  amount: string
  description: string
}

function buildEntries(pipeBatches: Batch[], sales: Sale[]): Entry[] {
  const entries: Entry[] = []
  // Purchases stay in the journal after their batch is sold.
  for (const b of [...pipeBatches, ...sales.flatMap(s => s.sold)]) {
    const amt = formatAmount(b.totalCost)
    entries.push({
      key: `p${b.id}`, order: b.id, sub: 0, dateMs: b.dateMs, type: 'Purchase',
      debit: 'Inventory',
      credit: b.payment === 'credit' ? 'Trade Payables' : 'Cash at bank',
      amount: amt,
      description: b.payment === 'credit'
        ? `Bought ${b.quantity} units on credit. Total cost $${amt}.`
        : `Bought ${b.quantity} units, paid from bank. Total cost $${amt}.`,
    })
  }
  for (const s of sales) {
    entries.push({
      key: `s${s.id}r`, order: s.id, sub: 0, dateMs: s.dateMs, type: 'Sale: revenue',
      debit: 'Cash at bank', credit: 'Sales Revenue', amount: formatAmount(s.price),
      description: `Sold ${s.units} units for $${formatAmount(s.price)}.`,
    })
    const parts = s.sold.map(b => `${formatDate(b.dateMs)} batch $${formatAmount(b.totalCost)}`)
    const detail = s.sold.length === 1
      ? `${parts[0]}.`
      : `${parts.join(' + ')} = $${formatAmount(s.cost)}.`
    entries.push({
      key: `s${s.id}c`, order: s.id, sub: 1, dateMs: s.dateMs, type: 'Sale: cost of sales',
      debit: 'Cost of Sales', credit: 'Inventory', amount: formatAmount(s.cost),
      description: `Cost of the ${s.units} units sold (FIFO): ${detail}`,
    })
  }
  return entries.sort((a, b) => a.order - b.order || a.sub - b.sub)
}

export function Journal({ batches, sales }: { batches: Batch[]; sales: Sale[] }) {
  const entries = buildEntries(batches, sales)
  return (
    <Panel title="Journal entries">
      {entries.length === 0 ? (
        <p>Journal entries appear here when you add a purchase or make a sale.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {entries.map(e => (
            <article key={e.key}>
              <h3 className="mb-2 font-bold">{formatDate(e.dateMs)} · {e.type}</h3>
              <table className="w-full border-collapse border border-ink text-left">
                <thead>
                  <tr className="bg-batch">
                    <th className="border border-ink px-2 py-1">Particulars</th>
                    <th className="w-20 border border-ink px-2 py-1 text-right">Dr ($)</th>
                    <th className="w-20 border border-ink px-2 py-1 text-right">Cr ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-ink px-2 py-1">{e.debit}</td>
                    <td className="border border-ink px-2 py-1 text-right">{e.amount}</td>
                    <td className="border border-ink px-2 py-1"></td>
                  </tr>
                  <tr>
                    <td className="border border-ink py-1 pl-8 pr-2">{e.credit}</td>
                    <td className="border border-ink px-2 py-1"></td>
                    <td className="border border-ink px-2 py-1 text-right">{e.amount}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 italic">{e.description}</p>
            </article>
          ))}
        </div>
      )}
    </Panel>
  )
}
