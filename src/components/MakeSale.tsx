import { useState } from 'react'
import { Panel } from './Panel'
import { fifoSell } from '../lib/fifo'
import { formatAmount, formatDate, parseDate } from '../lib/format'
import type { Batch, Sale } from '../types'

export interface NewSale {
  dateMs: number
  units: number
  price: number
  sold: Batch[]
  cost: number
  remaining: Batch[]
}

const inputClass = 'w-full rounded-md border border-[#767676] bg-white px-3 py-2.5 text-base'

function joinOptions(options: number[]): string {
  if (options.length === 1) return `${options[0]} units`
  return `${options.slice(0, -1).join(', ')} or ${options[options.length - 1]} units`
}

export function MakeSale({
  batches, sales, numbers, error, onError, onSell, onUndo,
}: {
  batches: Batch[]
  sales: Sale[]
  numbers: Map<number, number>

  error: string
  onError: (message: string) => void
  onSell: (s: NewSale) => void
  onUndo: () => void
}) {
  const [date, setDate] = useState('')
  const [units, setUnits] = useState('')
  const [price, setPrice] = useState('')
  const setError = onError

  function submit() {
    if (!date.trim() || !units.trim() || !price.trim()) {
      return setError('Fill in the date, number of units sold and total selling price first.')
    }
    if (batches.length === 0) return setError('There is nothing in the pipe to sell. Add a purchase first.')
    const dateMs = parseDate(date)
    if (dateMs === null) return setError('Type the date as month, day, year, e.g. Jul 16, 2027.')
    const qty = Number(units)
    if (!Number.isInteger(qty) || qty <= 0) return setError('Number of units sold must be a whole number above 0.')
    const total = Math.round(Number(price) * 100) / 100
    if (!(total > 0)) return setError('Total selling price must be more than $0.')

    const result = fifoSell(batches, qty)
    if (!result.ok) {
      return setError(
        result.reason === 'too-many'
          ? `The pipe only has ${result.total} units. You can't sell ${qty}.`
          : `FIFO sales in this tool use whole batches only. Starting from the oldest batch, you can sell ${joinOptions(result.options)}.`,
      )
    }
    const tooEarly = result.sold.find(b => b.dateMs > dateMs)
    if (tooEarly) {
      return setError(`This sale is dated before the ${formatDate(tooEarly.dateMs)} batch it would sell. Check the date.`)
    }
    const last = sales[sales.length - 1]
    if (last && dateMs < last.dateMs) {
      return setError(`Record sales in date order. Your last sale was on ${formatDate(last.dateMs)}.`)
    }

    onSell({ dateMs, units: qty, price: total, sold: result.sold, cost: result.cost, remaining: result.remaining })
    setDate(''); setUnits(''); setPrice('') // App clears every message
  }

  return (
    <Panel title="Make a sale">
      <p className="mb-4">Fill in all three boxes, then tap Sell.</p>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1 block font-semibold">Date of sale</span>
          <input className={inputClass} type="text" placeholder="e.g. Jul 16, 2027" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Number of units sold</span>
          <input className={inputClass} type="number" inputMode="numeric" value={units} onChange={e => setUnits(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Total selling price ($)</span>
          <input className={inputClass} type="number" inputMode="decimal" step="any" value={price} onChange={e => setPrice(e.target.value)} />
        </label>
        <p>Money received goes to Cash at bank.</p>
        <div className="flex gap-3">
          <button type="button" onClick={submit} className="rounded-md bg-sell px-6 py-3 font-semibold text-white">
            Sell
          </button>
        </div>
        {error && (
          <p role="alert" className="border-l-4 border-sell bg-white py-2 pl-3 text-ink">{error}</p>
        )}
      </div>

      {sales.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-lg font-bold">Batches sold</h3>
          <div className="flex flex-col gap-4">
            {sales.map((s, i) => (
              <article key={s.id} className="rounded-md border border-ink p-3">
                <p className="font-bold">
                  {formatDate(s.dateMs)}: sold {s.units} units for ${formatAmount(s.price)}
                </p>
                <ul className="m-0 mt-2 list-none space-y-1 p-0">
                  {s.sold.map(b => (
                    <li key={b.id}>
                      {b.quantity} units from Batch {numbers.get(b.id)} ({formatDate(b.dateMs)}) · cost ${formatAmount(b.totalCost)}
                    </li>
                  ))}
                </ul>
                {i === sales.length - 1 && (
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={onUndo} className="rounded-md border-2 border-ink bg-white px-4 py-2.5 font-semibold">
                      Undo this sale
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}
