import type { Batch } from '../types.ts'

/**
 * Batch numbers for every purchase, sold or unsold: date order (same date: added first),
 * counting from 1. Returns a map from batch id to batch number. Because it is worked out
 * from all purchases each time, a batch keeps its number after a sale, and removing a
 * purchase closes the gap.
 */
export function batchNumbers(allPurchases: Batch[]): Map<number, number> {
  const ordered = [...allPurchases].sort((a, b) => a.dateMs - b.dateMs || a.id - b.id)
  return new Map(ordered.map((b, i) => [b.id, i + 1]))
}
