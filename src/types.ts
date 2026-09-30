export type PaymentMethod = 'credit' | 'bank'

export interface Batch {
  id: number // shared counter with sales: gives the order things were recorded in
  dateMs: number // UTC midnight of the purchase date
  quantity: number
  totalCost: number
  payment: PaymentMethod
}

export interface Sale {
  id: number
  dateMs: number
  units: number
  price: number
  sold: Batch[] // oldest first
  cost: number
}

/** Newest at index 0 (top of pipe), oldest last (bottom). Same date: the one added first sits lower. */
export function sortForPipe(batches: Batch[]): Batch[] {
  return [...batches].sort((a, b) => b.dateMs - a.dateMs || b.id - a.id)
}
