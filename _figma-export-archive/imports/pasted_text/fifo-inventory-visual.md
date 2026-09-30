Create an interactive educational visual kit that demonstrates the FIFO (First-In-First-Out) method of inventory accounting.

Overall Goal

The design should simulate inventory flowing through a vertical “pipe”, where:

New inventory batches are added at the top

The oldest inventory stays at the bottom

When inventory is “sold”, it is removed from the bottom first

This should be visually intuitive and suitable for secondary school students.

Layout Structure
1. Main Canvas Layout

Left side: A tall vertical container called “Inventory Pipe”

Right side: A smaller area called “Inventory Sold”

Top label: “PURCHASES”

Bottom label: “COST OF SALES”

2. Inventory Pipe (Core Element)

Create a vertical frame with:

Fixed height (tall, like a pipe)

Visible left and right borders

Open top and bottom (conceptually)

Inside the pipe:

Use vertical stacking (Auto Layout)

Align items to the bottom (so items build upwards)

3. Inventory Batch Component

Each batch should be a reusable component with:

Structure:

A rectangular container

Inside the container:

Top row:

Date (e.g., “10 Mar”)

Unit Cost (e.g., “$1.75”)

Bottom row:

Quantity (e.g., “Qty: 23”)

Visual Representation:

Include a rectangle or fill area that represents quantity visually

The height of the rectangle should vary between variants:

Small batch = short height

Large batch = tall height

4. Variants for Batch Component

Create variants for:

5 units

10 units

15 units

20 units

Custom (editable height)

Each variant should:

Clearly differ in height

Display its quantity label

5. Inventory Sold Area

On the right side:

Create a frame labeled “Inventory Sold”

This is where removed batches or partial batches are placed

Should allow multiple batch components to be placed inside

Interaction Design (Non-coded, visual only)

Simulate these interactions through layout and instructions:

Adding Inventory:

Users duplicate a batch component

Edit date, cost, and quantity

Drag into the pipe

New batches appear above older ones

Selling Inventory (FIFO logic):

Users remove or adjust the bottom-most batch first

If partial:

Reduce quantity in original batch

Create a new batch in “Inventory Sold”

Design Style

Clean, minimal, black-and-white classroom-friendly design

Clear labels and readable text

No decorative elements—focus on clarity and function

Teacher Support Elements

Include a small instruction panel on the canvas:

Title: “How to Use”

Content:

Duplicate a batch to add inventory

Drag into the pipe (top = newest)

Sell from the bottom (oldest first)

Adjust quantities if partially used

Also include a small note:

“Bigger blocks represent larger quantities”

Naming Conventions

Use clear layer names:

“PipeContainer”

“Batch / 10 units”

“InventorySold”

Final Goal

The design should help students:

Visually understand FIFO flow

Track inventory layers

Practice splitting batches when partially sold
