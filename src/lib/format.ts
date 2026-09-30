const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const FULL_MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]
const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthIndex(word: string): number {
  const w = word.toLowerCase()
  const short = MONTHS.indexOf(w)
  if (short >= 0) return short
  if (w === 'sept') return 8
  return FULL_MONTHS.indexOf(w)
}

/** Reads "Jul 7, 2027", "July 7, 2027" or "7 Jul 2027". Returns UTC midnight in ms, or null. */
export function parseDate(input: string): number | null {
  const text = input.trim().replace(/\s+/g, ' ')
  let m = text.match(/^([a-z]+)\.? (\d{1,2}),? (\d{4})$/i)
  let monthWord: string, day: number, year: number
  if (m) {
    monthWord = m[1]; day = Number(m[2]); year = Number(m[3])
  } else {
    m = text.match(/^(\d{1,2}) ([a-z]+)\.?,? (\d{4})$/i)
    if (!m) return null
    day = Number(m[1]); monthWord = m[2]; year = Number(m[3])
  }
  const month = monthIndex(monthWord)
  if (month < 0) return null
  const ms = Date.UTC(year, month, day)
  const d = new Date(ms)
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month || d.getUTCDate() !== day) return null
  return ms
}

/** Always "Jul 7, 2027". */
export function formatDate(ms: number): string {
  const d = new Date(ms)
  return `${LABELS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

/** Textbook style: 180, 3 000, 12.50 (cents only when there are cents). */
export function formatAmount(n: number): string {
  const cents = Math.round(n * 100)
  const whole = Math.floor(cents / 100)
  const rest = cents % 100
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return rest === 0 ? grouped : `${grouped}.${String(rest).padStart(2, '0')}`
}
