import { test } from 'node:test'
import assert from 'node:assert/strict'
import { batchNumbers } from './numbering.ts'

const b = (id: number, day: number) =>
  ({ id, dateMs: Date.UTC(2027, 6, day), quantity: 1, totalCost: 1, payment: 'credit' as const })

test('numbers purchases in date order, counting sold ones', () => {
  const n = batchNumbers([b(1, 20), b(2, 23), b(3, 26)])
  assert.deepEqual([n.get(1), n.get(2), n.get(3)], [1, 2, 3])
})

test('a batch keeps its number when earlier ones are sold (only the pipe list shrinks)', () => {
  // Batch 1 and 2 sold: the caller still passes them in, so Batch 3 stays 3.
  const all = [b(1, 20), b(2, 23), b(3, 26)]
  assert.equal(batchNumbers(all).get(3), 3)
  assert.equal(batchNumbers([...all, b(4, 30)]).get(4), 4)
})

test('removing a purchase closes the gap', () => {
  const n = batchNumbers([b(1, 20), b(3, 26)])
  assert.deepEqual([n.get(1), n.get(3)], [1, 2])
})

test('same date: the one added first is numbered first', () => {
  const n = batchNumbers([b(2, 20), b(1, 20)])
  assert.deepEqual([n.get(1), n.get(2)], [1, 2])
})
