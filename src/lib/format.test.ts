import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseDate, formatDate, formatAmount } from './format.ts'

test('parses the three accepted date styles', () => {
  const expected = Date.UTC(2027, 6, 7)
  assert.equal(parseDate('Jul 7, 2027'), expected)
  assert.equal(parseDate('JULY 7, 2027'), expected)
  assert.equal(parseDate('7 jul 2027'), expected)
})

test('rejects bad dates', () => {
  for (const bad of ['Feb 30, 2027', 'Jul 7', 'Foo 7, 2027', '', '2027-07-07', 'Jul 32, 2027']) {
    assert.equal(parseDate(bad), null, bad)
  }
})

test('formats dates and amounts', () => {
  assert.equal(formatDate(Date.UTC(2027, 6, 7)), 'Jul 7, 2027')
  assert.equal(formatAmount(180), '180')
  assert.equal(formatAmount(3000), '3 000')
  assert.equal(formatAmount(12.5), '12.50')
})
