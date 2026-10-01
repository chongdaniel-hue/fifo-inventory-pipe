# FIFO Inventory Pipe v2: Build Brief

This brief is the single source of truth for the rebuild. The Figma Make export in this folder (`src/`) is the starting point: keep what works, change what this brief lists. Where the brief and the old code disagree, follow the brief.

**Who uses it:** Secondary 3 POA students (G2 and G3, mixed ability) on iPads, Chromebooks and phones, plus the teacher projecting it. Screenshots of it are printed in black-and-white worksheets.

**What it is:** one screen. Students add purchase batches, watch them stack in a pipe (newest on top, oldest at the bottom), make a sale that takes whole batches from the bottom (FIFO), and read the journal entries and totals the tool produces.

---

## 1. Technical set-up

- Keep React + Vite + Tailwind. Remove what the new version no longer uses: MUI, react-dnd, the Component Library, the drag-and-drop pipe, the unused header icons, and unused shadcn/ui components.
- Build to a **single self-contained `index.html`** (e.g. `vite-plugin-singlefile`, `base: './'`) so the teacher can upload one file to GitHub Pages.
- No login, no data collection, no browser storage. Refreshing the page starts fresh.
- Keep the FIFO logic in one plain function (inputs: batches, sale; output: batches sold, cost, remaining batches) so it can be tested on its own.

## 2. Look and feel

- Light theme: off-white page (#FAFAF7), white panels with a 1px mid-grey border (#C8C8C8), near-black text (#111).
- Must stay readable when screenshotted and printed in greyscale: meaning is carried by borders, labels and dark text, never by colour alone.
- One primary colour for "Add to pipe" (dark blue, #1D4ED8). "Sell" is dark red (#B91C1C). White text on both.
- Clean sans-serif font (system UI stack or Inter). **No monospace anywhere**, including numbers. Use tabular figures (`font-variant-numeric: tabular-nums`) so columns line up.
- Body text at least 16px. Generous gaps between panels (40 to 48px on desktop); related items inside a panel 12 to 16px apart.
- Buttons shown together sit side by side with at least a 12px gap.
- Layout:
  - **Desktop and landscape iPad (≥1024px):** three columns: pipe | Add a purchase + Make a sale | Summary + Journal entries.
  - **Narrower screens:** one column in this order: How it works, Add a purchase, Pipe, Make a sale, Summary, Journal entries.
  - No horizontal scrolling at 375px width.

## 3. Screen content (exact wording)

### Header
- Title: **Inventory Pipe (FIFO)**
- Subtitle: Created by Mr. Daniel · A visual kit for Principles of Accounts
- Nothing else in the header (no icons or menus).

### How it works (a short strip under the header, always visible, not a pop-up)
1. Add each purchase as a batch. New batches enter at the top of the pipe.
2. The oldest batch sits at the bottom.
3. When you sell, FIFO takes whole batches from the bottom, oldest first.

**Reset everything button:** an outlined button at the right end of the How it works box (on phones it sits on the same row as the "How it works" heading). Tapping it opens a confirmation box on the page (not a browser pop-up), over a dimmed background:
- Text: "Reset everything? This clears the pipe, journal entries and summary. You can't undo this."
- Two buttons side by side: **"Yes, reset everything"** (filled, dark red #B91C1C, white text) and **"Cancel"** (outlined).
- Only "Yes" resets. It clears every batch, sale and journal entry, every error message, and every form box, so the tool is exactly as it was on first load.
- "Cancel", or tapping outside the box, closes it and changes nothing.

### Add a purchase (panel)
Instruction line under the heading: "Fill in all four boxes, then tap Add to pipe."

| Field label | Input | Starts as |
|---|---|---|
| Date | text box, placeholder "e.g. Jul 7, 2027" | empty |
| Number of units | number box | empty |
| Total cost ($) | number box | empty |
| Bought on credit or paid by bank? | dropdown: "Choose one", "On credit (Trade Payables)", "Paid from bank (Cash at bank)" | "Choose one" |

Button: **Add to pipe**. On success, the batch appears in the pipe, its journal entry appears, and all four fields clear.

Error messages (shown under the button, in dark text with a red left border; the first problem found only). A panel shows only its own latest message: a new error replaces the old one, and every message in every panel clears after the next successful action (add, sell, undo, remove or reset):
- Any field empty: "Fill in the date, number of units, total cost and how it was paid first."
- Date can't be read: "Type the date as month, day, year, e.g. Jul 7, 2027."
- Units not a whole number above 0: "Number of units must be a whole number above 0."
- Total cost 0 or less: "Total cost must be more than $0."
- Date is earlier than the latest batch or the latest sale (purchases must be added in date order; the same date is allowed): "This purchase is dated before {date}. If you're starting a new question, click Reset everything first. Otherwise, check the date." {date} is the later of the latest batch date and the latest sale date. Same wording whether the date it clashes with is a batch or a sale.

### The pipe
- Label above the pipe: **TOP: new purchases enter here ↓**
- Label below the pipe: **BOTTOM: the oldest batch leaves first when you sell ↓**
- Empty pipe text: "The pipe is empty. Add a purchase to start."
- Purchases must be added in date order, so the newest batch is always at the top and the oldest at the bottom. Two batches on the same date: the one added first sits lower.
- Batches are separated by a small down arrow (↓) between each pair, showing the direction they travel through the pipe.
- Each batch block (all the same neutral colour, blue-grey **#CBD5E1**, with a dark border; this is one step darker than a pale fill so the blocks still show on a faded black-and-white printer):
  - line 1 (bold): "Batch {k} · {n} units" (see Batch numbers below)
  - line 2: "{date}"
  - line 3: "Total cost: ${amount}"
  - a ✕ button in the top-right corner (accessible label "Remove this purchase"). Removing a batch also removes its purchase journal entry.
- The bottom batch also shows a badge **"Oldest: sold first"** on its own line inside the block, so it never covers any text. It also gets a thicker border so it stands out in greyscale.
- **Batch numbers.** Every purchase gets a number in date order: Batch 1, Batch 2, Batch 3 and so on.
  - A batch keeps its number after sales. When Batch 1 is sold, the next batch stays "Batch 2" (it is not renamed to Batch 1).
  - Sold batches still count. If Batches 1 and 2 are sold and Batch 3 exists, the next purchase is Batch 4.
  - Removing a purchase with ✕ renumbers all remaining purchases (sold and unsold) in date order, so there are no gaps.
  - Undoing a sale changes no numbers. Reset everything starts again from Batch 1.
  - The number is shown everywhere the batch appears: the batch block, the purchase journal entry, the Batches sold lines and the cost of sales description.
  - The block must still fit at 375px with nothing overlapping the ✕ button.
- Batch height does not depend on quantity or colour. (The old version coloured batches by size, which students could read as meaningful.)

### Make a sale (panel)
Instruction line under the heading: "Fill in all three boxes, then tap Sell."

| Field label | Input | Starts as |
|---|---|---|
| Date of sale | text box, placeholder "e.g. Jul 16, 2027" | empty |
| Number of units sold | number box | empty |
| Total selling price ($) | number box (**required**) | empty |

Money received goes to **Cash at bank** (fixed; no dropdown).

Button: **Sell**. On success, the batches sold leave the pipe, two journal entries appear, the "Batches sold" list updates, and all fields clear.

Error messages (first problem found only):
- Any field empty: "Fill in the date, number of units sold and total selling price first."
- Pipe empty: "There is nothing in the pipe to sell. Add a purchase first."
- Date can't be read: "Type the date as month, day, year, e.g. Jul 16, 2027."
- Units not a whole number above 0: "Number of units sold must be a whole number above 0."
- Selling price 0 or less: "Total selling price must be more than $0."
- More units than the pipe holds: "The pipe only has {total} units. You can't sell {n}."
- **Would split a batch:** "FIFO sales in this tool use whole batches only. Starting from the oldest batch, you can sell {list}." The list is the running totals of whole batches from the bottom, e.g. "7, 15 or 21 units".
- Sale dated before a batch it would sell: "This sale is dated before the {batch date} batch it would sell. Check the date."
- Sale dated before the last recorded sale: "Record sales in date order. Your last sale was on {date}."

### Batches sold (under the Sell button; hidden until the first sale)
- Heading: **Batches sold**
- One card per sale:
  - "{sale date}: sold {n} units for ${selling price}"
  - one line per batch used: "{n} units from Batch {k} ({batch date}) · cost ${batch total cost}"
  - On the **most recent sale only**, an outlined button **"Undo this sale"**. It puts the batches back in the pipe and removes that sale's two journal entries. Only the latest sale can be undone, so later sales never become wrong.

### Summary (panel)
Sits above Journal entries, in the right-hand column on desktop and in the phone order.
- Heading: **Summary**
- Three figures, each in its own box:
  - **Total Sales Revenue**: ${x}
  - **Total Cost of Sales**: ${x}
  - **Ending Inventory Balance**: ${x}
- Notes under them:
  - Total Sales Revenue: the total selling price of all sales recorded.
  - Total Cost of Sales: the total cost of the batches sold, using FIFO.
  - Ending Inventory Balance: the total cost of the batches still in the pipe.

### Journal entries (panel)
- Heading: **Journal entries**
- **Hidden by default**, so students write their own entries on the worksheet first. While hidden, the panel shows only its heading, an outlined button **"Show journal entries"**, and one line under it: "Write your journal entries on your worksheet first, then tap to check."
- Tapping the button shows the entries and the button changes to **"Hide journal entries"**. Tapping it again hides them. Entries are recorded the whole time, so ones added while the panel is closed are there when it is opened, and new ones appear as usual while it is open.
- Reset everything closes the panel again. The Summary is not affected and stays visible.
- Empty text: "Journal entries appear here when you add a purchase or make a sale."
- Entries are listed in the order recorded, oldest at the top. The panel grows to fit every entry (no inner scroll box), so one screenshot shows everything.
- Each entry is a small exam-style journal:
  - title line: **{date} · {type}**, where type is "Purchase (Batch {k})", "Sale: revenue" or "Sale: cost of sales". Example: "Jul 20, 2027 · Purchase (Batch 1)".
  - table columns: **Particulars | Dr ($) | Cr ($)**. The debit account comes first; the credit account goes on the next line, indented.
  - amounts are written like the textbook: whole dollars with a space as the thousands separator (180, 3 000), and cents only when there are cents (12.50).
  - one short description line in italics under the table:
    - Purchase on credit: "Bought {n} units on credit. Total cost ${x}."
    - Purchase from bank: "Bought {n} units, paid from bank. Total cost ${x}."
    - Sale: revenue: "Sold {n} units for ${x}."
    - Sale: cost of sales: "Cost of the {n} units sold (FIFO): Batch {k} ({batch date}) ${a} + Batch {k} ({batch date}) ${b} = ${total}." Example: "Cost of the 15 units sold (FIFO): Batch 1 (Jul 20, 2027) $175 + Batch 2 (Jul 23, 2027) $224 = $399." (With one batch: "Batch {k} ({batch date}) ${a}.")
- For each sale, "Sale: revenue" comes first and "Sale: cost of sales" second.
- Account names exactly: Inventory, Trade Payables, Cash at bank, Sales Revenue, Cost of Sales.
- No "Total" row (exam journals don't have one).

## 4. Dates

- Accept "Jul 7, 2027", "July 7, 2027" and "7 Jul 2027" (case-insensitive). The year is required.
- Always display dates as "Jul 7, 2027".

## 5. Checks before handing back (run them, don't assume)

1. Tutorial Part 1: add 10 units $100 (Jul 7, 2027, on credit) and 5 units $60 (Jul 13, 2027, on credit), then sell 10 units for $150 (Jul 16, 2027). Expect: Revenue $150, Cost of Sales $100, Ending Inventory Balance $60, and the Jul 13 batch left in the pipe.
2. Task 2: add 7 units $175 (Jul 20), 8 units $224 (Jul 23) and 6 units $180 (Jul 26), all 2027, on credit. Sell 15 units for $600 (Jul 28, 2027). Expect $600 / $399 / $180, and the cost line "Jul 20, 2027 batch $175 + Jul 23, 2027 batch $224 = $399".
3. Same batches as check 2, before the sale: try to sell 10 units. Expect the whole-batches message listing "7, 15 or 21 units".
4. Same batches: try to sell 30 units. Expect "The pipe only has 21 units. You can't sell 30."
5. Try to sell 7 units dated Jul 19, 2027. Expect the "dated before the Jul 20, 2027 batch" message.
6. Add Jul 23, then try to add Jul 20. Expect "This purchase is dated before Jul 23, 2027. If you're starting a new question, click Reset everything first. Otherwise, check the date." A second purchase dated Jul 23 (same date) is allowed. Also, after a sale on Jul 28, try to add a purchase dated Jul 27: same wording, with Jul 28, 2027.
7. Undo the latest sale. The batches return, both entries go, and the totals go back.
8. Check the page at 375px, 768px and 1280px wide: no horizontal scroll, nothing overlapping, the "Oldest" badge not covering any text. On phones the order is How it works, Add a purchase, Pipe, Make a sale, Summary, Journal entries. On desktop the right column is Summary above Journal entries.
9. Convert a screenshot to greyscale: every label, figure and the oldest batch are still clear.
10. Tutorial Part 1 (check 1), then Reset everything and confirm, then Part 2: add 8 units $120 (Jul 7, 2027, on credit) and 6 units $108 (Jul 13, 2027, on credit), then sell 8 units for $180 (Jul 16, 2027). Expect $180 / $120 / $108. The pipe, journal and summary from Part 1 must be gone first.
11. Tap Reset everything, then Cancel: nothing changes. Tap Reset everything, then tap outside the box: nothing changes. Only "Yes, reset everything" clears, including error messages and anything typed in the form boxes.
12. Trigger a sale error, then add a purchase successfully: the sale error is gone. Trigger a purchase error, then make a successful sale: the purchase error is gone. Two different errors in one panel: only the latest shows.
13. Batch numbers, Tutorial Part 1: after the sale of 10 units, the pipe shows "Batch 2 · 5 units" (not Batch 1), and the journal shows "Jul 7, 2027 · Purchase (Batch 1)" and "Jul 13, 2027 · Purchase (Batch 2)".
14. Batch numbers, Task 2 (check 2 figures): the Batches sold lines read "7 units from Batch 1 (Jul 20, 2027) · cost $175" and "8 units from Batch 2 (Jul 23, 2027) · cost $224"; the cost line reads "Cost of the 15 units sold (FIFO): Batch 1 (Jul 20, 2027) $175 + Batch 2 (Jul 23, 2027) $224 = $399."; and the pipe shows "Batch 3 · 6 units". Then add a purchase dated Jul 30: it is Batch 4 (sold batches still count). Undo the sale: no numbers change.
15. Batch numbers, removal: add three batches and remove Batch 2 with ✕. The old Batch 3 becomes Batch 2, in the pipe and in its journal entry. Also, after Batches 1 and 2 are sold, remove Batch 3 and add a purchase: it is Batch 3 (the sold ones still count).
16. Batch numbers, reset: after Reset everything (confirm), the first purchase is Batch 1.
17. The batch block with a number still fits at 375px: no overlap with the ✕ button or the "Oldest" badge, and no horizontal scroll.
18. Journal hidden by default: on a fresh page the Journal entries panel shows only the heading, the "Show journal entries" button and the worksheet line, with no entries and no empty-state text, even after purchases and sales are recorded. The Summary is visible throughout.
19. Journal opens and closes: "Show journal entries" opens it and the button reads "Hide journal entries"; tapping again closes it and the button reads "Show journal entries" again.
20. Entries recorded while the panel is closed (a purchase and a sale) are all there, in order, when it is opened. A purchase added while it is open appears straight away.
21. Reset everything (confirm) hides the panel again, and the next purchase's entry stays hidden until the button is tapped. Cancel on the reset box leaves the panel as it was.
22. The hidden and the open panel both fit at 375px, 768px and 1280px with no horizontal scroll, and the phone order is unchanged (How it works, Add a purchase, Pipe, Make a sale, Summary, Journal entries).

## 6. Updating the live page later

Live address: https://chongdaniel-hue.github.io/fifo-inventory-pipe/
Repository: https://github.com/chongdaniel-hue/fifo-inventory-pipe

The tool is published with GitHub Pages from the `main` branch, `/docs` folder. After any change to the code:

1. Rebuild: `npm run build` (this makes `dist/index.html`).
2. Copy it: `dist/index.html` to `docs/index.html` (replace the old file).
3. Commit and push: `git add -A`, `git commit -m "Describe the change"`, `git push`.
4. Wait a minute or two, then refresh the live page (a hard refresh, Ctrl+Shift+R, if the old version still shows).

Only `docs/index.html` is served. Everything else in the repository is just the source.

If git says "dubious ownership" when you run it on the E: drive, tell Claude, or run the command it prints once (it marks this folder as safe).

## 7. Out of scope (don't add)

Timers, scores, sounds, animations beyond a simple fade, saving progress, any reset other than the "Reset everything" button described above, a "sold on credit" option, per-unit costs anywhere, and partial-batch sales.
