import { Panel } from './Panel'
import { formatAmount } from '../lib/format'
import type { Batch, Sale } from '../types'

function Figure({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-md border border-ink p-4">
      <p className="font-semibold">{label}</p>
      <p className="text-2xl font-bold">${formatAmount(value)}</p>
      <p className="mt-1">{note}</p>
    </div>
  )
}

export function Summary({ batches, sales }: { batches: Batch[]; sales: Sale[] }) {
  const revenue = sales.reduce((s, x) => s + x.price, 0)
  const cost = sales.reduce((s, x) => s + x.cost, 0)
  const inventory = batches.reduce((s, b) => s + b.totalCost, 0)
  return (
    <Panel title="Summary">
      <div className="flex flex-col gap-4">
        <Figure label="Total Sales Revenue" value={revenue} note="The total selling price of all sales recorded." />
        <Figure label="Total Cost of Sales" value={cost} note="The total cost of the batches sold, using FIFO." />
        <Figure label="Ending Inventory Balance" value={inventory} note="The total cost of the batches still in the pipe." />
      </div>
    </Panel>
  )
}
