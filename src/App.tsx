import { useState } from 'react'
import { AddPurchase, type NewPurchase } from './components/AddPurchase'
import { HowItWorks } from './components/HowItWorks'
import { Journal } from './components/Journal'
import { MakeSale, type NewSale } from './components/MakeSale'
import { Pipe } from './components/Pipe'
import { Summary } from './components/Summary'
import { batchNumbers } from './lib/numbering'
import type { Batch, Sale } from './types'

export default function App() {
  const [batches, setBatches] = useState<Batch[]>([]) // batches still in the pipe
  const [sales, setSales] = useState<Sale[]>([]) // in the order recorded
  const [nextId, setNextId] = useState(1)
  // Each panel shows only its own latest message. Every successful action clears both.
  const [addError, setAddError] = useState('')
  const [saleError, setSaleError] = useState('')
  const [resetCount, setResetCount] = useState(0) // changing the key on the forms clears their boxes

  function clearErrors() {
    setAddError('')
    setSaleError('')
  }

  // Latest date among every purchase (in the pipe or already sold) and every sale.
  const dates = [
    ...batches.map(b => b.dateMs),
    ...sales.flatMap(s => [s.dateMs, ...s.sold.map(b => b.dateMs)]),
  ]
  const latestDateMs = dates.length ? Math.max(...dates) : null

  // Batch numbers count every purchase, sold or not, so a batch keeps its number after a sale.
  const numbers = batchNumbers([...batches, ...sales.flatMap(s => s.sold)])

  function addBatch(p: NewPurchase) {
    setBatches(prev => [...prev, { id: nextId, ...p }])
    setNextId(n => n + 1)
    clearErrors()
  }

  // Removing a batch also removes its purchase journal entry, because entries are built from batches.
  function removeBatch(id: number) {
    setBatches(prev => prev.filter(b => b.id !== id))
    clearErrors()
  }

  function sell(s: NewSale) {
    setBatches(s.remaining)
    setSales(prev => [...prev, { id: nextId, dateMs: s.dateMs, units: s.units, price: s.price, sold: s.sold, cost: s.cost }])
    setNextId(n => n + 1)
    clearErrors()
  }

  // Only the latest sale can be undone, so earlier sales never become wrong.
  function undoLastSale() {
    const last = sales[sales.length - 1]
    if (!last) return
    setBatches(prev => [...prev, ...last.sold])
    setSales(prev => prev.slice(0, -1))
    clearErrors()
  }

  function resetEverything() {
    setBatches([])
    setSales([])
    setNextId(1)
    clearErrors()
    setResetCount(n => n + 1)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Inventory Pipe (FIFO)</h1>
        <p className="mt-1">Created by Mr. Daniel · A visual kit for Principles of Accounts</p>
      </header>

      <div className="mb-10 lg:mb-12">
        <HowItWorks onReset={resetEverything} />
      </div>

      {/* Narrow screens: one column in the brief's order (order-N). Wide screens: three columns. */}
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:items-start lg:gap-12">
        <div className="contents">
          <div className="order-2 lg:order-none"><Pipe batches={batches} numbers={numbers} onRemove={removeBatch} /></div>
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-12">
          <div className="order-1 lg:order-none">
            <AddPurchase key={resetCount} latestDateMs={latestDateMs} error={addError} onError={setAddError} onAdd={addBatch} />
          </div>
          <div className="order-3 lg:order-none">
            <MakeSale key={resetCount} batches={batches} sales={sales} numbers={numbers} error={saleError} onError={setSaleError} onSell={sell} onUndo={undoLastSale} />
          </div>
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-12">
          <div className="order-4 lg:order-none"><Summary batches={batches} sales={sales} /></div>
          <div className="order-5 lg:order-none"><Journal key={resetCount} batches={batches} sales={sales} numbers={numbers} /></div>
        </div>
      </div>
    </div>
  )
}
