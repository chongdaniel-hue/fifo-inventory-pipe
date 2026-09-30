import { useState } from 'react'

export function HowItWorks({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">How it works</h2>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-md border-2 border-ink bg-white px-4 py-2.5 font-semibold"
        >
          Reset everything
        </button>
      </div>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Add each purchase as a batch. New batches enter at the top of the pipe.</li>
        <li>The oldest batch sits at the bottom.</li>
        <li>When you sell, FIFO takes whole batches from the bottom, oldest first.</li>
      </ol>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirming(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reset everything"
            className="w-full max-w-md rounded-lg border-2 border-ink bg-white p-5"
            onClick={e => e.stopPropagation()}
          >
            <p className="mb-6 font-semibold">
              Reset everything? This clears the pipe, journal entries and summary. You can't undo this.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setConfirming(false); onReset() }}
                className="rounded-md bg-sell px-3 py-3 font-semibold text-white"
              >
                Yes, reset everything
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border-2 border-ink bg-white px-3 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
