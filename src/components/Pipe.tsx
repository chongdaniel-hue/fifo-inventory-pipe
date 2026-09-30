import { Fragment } from 'react'
import { formatAmount, formatDate } from '../lib/format'
import { sortForPipe, type Batch } from '../types'

export function Pipe({ batches, onRemove }: { batches: Batch[]; onRemove: (id: number) => void }) {
  const ordered = sortForPipe(batches)
  return (
    <section aria-label="Inventory pipe" className="flex flex-col items-center gap-3">
      <p className="text-center font-bold">TOP: new purchases enter here ↓</p>
      <div className="min-h-64 w-full max-w-sm rounded-lg border-x-8 border-y-0 border-ink bg-white px-4 py-4">
        {ordered.length === 0 ? (
          <p className="py-16 text-center">The pipe is empty. Add a purchase to start.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {ordered.map((b, i) => {
              const oldest = i === ordered.length - 1
              return (
                <Fragment key={b.id}>
                  <li
                    className={`relative rounded-md bg-batch p-3 pr-12 ${oldest ? 'border-[4px] border-ink' : 'border border-ink'}`}
                  >
                    <button
                      type="button"
                      aria-label="Remove this purchase"
                      onClick={() => onRemove(b.id)}
                      className="absolute right-0 top-0 h-11 w-11 text-lg font-bold"
                    >
                      ✕
                    </button>
                    <p className="font-bold">{b.quantity} units</p>
                    <p>{formatDate(b.dateMs)}</p>
                    <p>Total cost: ${formatAmount(b.totalCost)}</p>
                    {oldest && (
                      <p className="mt-2">
                        <span className="inline-block rounded bg-ink px-2 py-0.5 text-base font-bold text-white">Oldest: sold first</span>
                      </p>
                    )}
                  </li>
                  {!oldest && (
                    <li aria-hidden="true" className="text-center text-xl font-bold leading-none">↓</li>
                  )}
                </Fragment>
              )
            })}
          </ul>
        )}
      </div>
      <p className="text-center font-bold">BOTTOM: the oldest batch leaves first when you sell ↓</p>
    </section>
  )
}
