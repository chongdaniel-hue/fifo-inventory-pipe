import { useState } from 'react'
import { Panel } from './Panel'
import { formatDate, parseDate } from '../lib/format'
import type { PaymentMethod } from '../types'

export interface NewPurchase {
  dateMs: number
  quantity: number
  totalCost: number
  payment: PaymentMethod
}

const inputClass = 'w-full rounded-md border border-[#767676] bg-white px-3 py-2.5 text-base'

export function AddPurchase({ latestDateMs, error, onError, onAdd }: {
  latestDateMs: number | null // later of the latest batch and the latest sale
  error: string
  onError: (message: string) => void
  onAdd: (p: NewPurchase) => void
}) {
  const [date, setDate] = useState('')
  const [units, setUnits] = useState('')
  const [cost, setCost] = useState('')
  const [pay, setPay] = useState('')
  const setError = onError

  function submit() {
    if (!date.trim() || !units.trim() || !cost.trim() || !pay) {
      return setError('Fill in the date, number of units, total cost and how it was paid first.')
    }
    const dateMs = parseDate(date)
    if (dateMs === null) return setError('Type the date as month, day, year, e.g. Jul 7, 2027.')
    const quantity = Number(units)
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return setError('Number of units must be a whole number above 0.')
    }
    const totalCost = Math.round(Number(cost) * 100) / 100
    if (!(totalCost > 0)) return setError('Total cost must be more than $0.')
    if (latestDateMs !== null && dateMs < latestDateMs) {
      return setError(`This purchase is dated before ${formatDate(latestDateMs)}. If you're starting a new question, click Reset everything first. Otherwise, check the date.`)
    }

    onAdd({ dateMs, quantity, totalCost, payment: pay as PaymentMethod }) // App clears every message
    setDate(''); setUnits(''); setCost(''); setPay('')
  }

  return (
    <Panel title="Add a purchase">
      <p className="mb-4">Fill in all four boxes, then tap Add to pipe.</p>
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1 block font-semibold">Date</span>
          <input className={inputClass} type="text" placeholder="e.g. Jul 7, 2027" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Number of units</span>
          <input className={inputClass} type="number" inputMode="numeric" value={units} onChange={e => setUnits(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Total cost ($)</span>
          <input className={inputClass} type="number" inputMode="decimal" step="any" value={cost} onChange={e => setCost(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Bought on credit or paid by bank?</span>
          <select className={inputClass} value={pay} onChange={e => setPay(e.target.value)}>
            <option value="">Choose one</option>
            <option value="credit">On credit (Trade Payables)</option>
            <option value="bank">Paid from bank (Cash at bank)</option>
          </select>
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={submit} className="rounded-md bg-add px-6 py-3 font-semibold text-white">
            Add to pipe
          </button>
        </div>
        {error && (
          <p role="alert" className="border-l-4 border-sell bg-white py-2 pl-3 text-ink">{error}</p>
        )}
      </div>
    </Panel>
  )
}
