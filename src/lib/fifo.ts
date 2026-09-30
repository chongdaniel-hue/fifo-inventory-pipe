import type { Batch } from '../types.ts'

export type FifoResult =
  | { ok: true; sold: Batch[]; cost: number; remaining: Batch[] }
  | { ok: false; reason: 'too-many'; total: number }
  | { ok: false; reason: 'split'; options: number[] }

/**
 * FIFO sale using whole batches only. Takes batches from the oldest (earliest date,
 * then earliest added) until exactly `units` are covered.
 * Returns the batches sold (oldest first), their total cost, and the batches left.
 */
export function fifoSell(batches: Batch[], units: number): FifoResult {
  const oldestFirst = [...batches].sort((a, b) => a.dateMs - b.dateMs || a.id - b.id)
  const total = oldestFirst.reduce((sum, b) => sum + b.quantity, 0)
  if (units > total) return { ok: false, reason: 'too-many', total }

  const options: number[] = []
  let running = 0
  for (let i = 0; i < oldestFirst.length; i++) {
    running += oldestFirst[i].quantity
    options.push(running)
    if (running === units) {
      const sold = oldestFirst.slice(0, i + 1)
      const cost = Math.round(sold.reduce((s, b) => s + b.totalCost, 0) * 100) / 100
      return { ok: true, sold, cost, remaining: oldestFirst.slice(i + 1) }
    }
  }
  return { ok: false, reason: 'split', options }
}
