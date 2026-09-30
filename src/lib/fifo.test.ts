import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fifoSell } from './fifo.ts'

const d = (day: number) => Date.UTC(2027, 6, day)
const b = (id: number, day: number, quantity: number, totalCost: number) =>
  ({ id, dateMs: d(day), quantity, totalCost, payment: 'credit' as const })

test('sells the oldest whole batch first, whatever order they were given', () => {
  const r = fifoSell([b(2, 13, 5, 60), b(1, 7, 10, 100)], 10)
  assert.ok(r.ok)
  assert.equal(r.cost, 100)
  assert.deepEqual(r.remaining.map(x => x.id), [2])
})

test('sells two batches', () => {
  const r = fifoSell([b(1, 20, 7, 175), b(2, 23, 8, 224), b(3, 26, 6, 180)], 15)
  assert.ok(r.ok)
  assert.equal(r.cost, 399)
  assert.deepEqual(r.sold.map(x => x.id), [1, 2])
})

test('refuses to split a batch and lists the whole-batch totals', () => {
  const r = fifoSell([b(1, 20, 7, 175), b(2, 23, 8, 224), b(3, 26, 6, 180)], 10)
  assert.deepEqual(r, { ok: false, reason: 'split', options: [7, 15, 21] })
})

test('refuses to sell more than the pipe holds', () => {
  const r = fifoSell([b(1, 20, 7, 175), b(2, 23, 8, 224), b(3, 26, 6, 180)], 30)
  assert.deepEqual(r, { ok: false, reason: 'too-many', total: 21 })
})

test('same-date batches: the one added first is sold first', () => {
  const r = fifoSell([b(2, 20, 4, 40), b(1, 20, 6, 90)], 6)
  assert.ok(r.ok)
  assert.deepEqual(r.sold.map(x => x.id), [1])
})
