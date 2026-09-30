import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { InventoryPipe } from './components/InventoryPipe';
import { ComponentLibrary } from './components/ComponentLibrary';
import { AddPurchases } from './components/AddPurchases';
import { ManagePartialSplits } from './components/ManagePartialSplits';
import { InstructionsPanel } from './components/InstructionsPanel';
import { JournalEntry } from './components/JournalEntries';
import { InventorySummary } from './components/InventorySummary';
import { Batch } from './components/BatchComponent';
import { Menu, FileText, Settings, BookOpen, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';

interface SaleGroup {
  id: string;
  journalEntryIds: string[];
  restorations: Array<{
    batchId: string;
    batchDate: string;
    batchSortTimestamp: number;
    quantityToRestore: number;
    costToRestore: number;
  }>;
}

const parseSortTimestamp = (dateStr: string): number => {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const m = dateStr.toLowerCase().match(/([a-z]+)\s+(\d+)/);
  if (m) {
    const mi = months.findIndex(mo => m[1].startsWith(mo));
    if (mi >= 0) return new Date(new Date().getFullYear(), mi, parseInt(m[2])).getTime();
  }
  return Date.now();
};

// Sort descending by date: newest (largest timestamp) at index 0 = top of pipe,
// oldest (smallest timestamp) at last index = bottom of pipe, first to be sold by FIFO.
const sortBatches = (arr: Batch[]): Batch[] =>
  [...arr].sort((a, b) => (b.sortTimestamp ?? 0) - (a.sortTimestamp ?? 0));

export default function App() {
  const [batches, setBatches] = useState<Batch[]>([]);

  const [soldItems, setSoldItems] = useState<Array<{ batch: Batch; quantitySold: number; saleGroupId: string }>>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [saleGroups, setSaleGroups] = useState<SaleGroup[]>([]);

  const handleAddBatch = (batch: Batch, paymentAccount?: string) => {
    const batchWithTs: Batch = {
      ...batch,
      sortTimestamp: batch.sortTimestamp ?? parseSortTimestamp(batch.date),
    };
    setBatches(prev => sortBatches([batchWithTs, ...prev]));

    if (paymentAccount) {
      const totalCost = batch.totalCost;
      const purchaseEntry: JournalEntry = {
        id: Date.now().toString() + Math.random(),
        date: batch.date,
        type: 'purchase',
        batchId: batchWithTs.id,
        description: `Purchased ${batch.quantity} units @ $${(totalCost / batch.quantity).toFixed(2)} per unit`,
        entries: [
          { account: 'Inventory', debit: totalCost },
          { account: paymentAccount, credit: totalCost },
        ],
      };
      setJournalEntries(prev => [purchaseEntry, ...prev]);
    }
  };

  const handleRemoveBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    setJournalEntries(prev => prev.filter(e => e.batchId !== id));
  };

  const handleSellStock = (quantityToSell: number, saleDate: string, sellingPrice?: number) => {
    let remainingToSell = quantityToSell;
    const newBatches = [...batches];
    const newSoldItems = [...soldItems];
    let totalCOGS = 0;
    const saleGroupId = Date.now().toString() + Math.random();
    const restorations: SaleGroup['restorations'] = [];

    while (remainingToSell > 0 && newBatches.length > 0) {
      const bottomBatch = newBatches[newBatches.length - 1];
      const unitCost = bottomBatch.totalCost / bottomBatch.quantity;

      if (bottomBatch.quantity <= remainingToSell) {
        restorations.push({
          batchId: bottomBatch.id,
          batchDate: bottomBatch.date,
          batchSortTimestamp: bottomBatch.sortTimestamp ?? 0,
          quantityToRestore: bottomBatch.quantity,
          costToRestore: bottomBatch.totalCost,
        });
        newSoldItems.push({ batch: { ...bottomBatch }, quantitySold: bottomBatch.quantity, saleGroupId });
        totalCOGS += bottomBatch.totalCost;
        remainingToSell -= bottomBatch.quantity;
        newBatches.pop();
      } else {
        const partialCost = remainingToSell * unitCost;
        restorations.push({
          batchId: bottomBatch.id,
          batchDate: bottomBatch.date,
          batchSortTimestamp: bottomBatch.sortTimestamp ?? 0,
          quantityToRestore: remainingToSell,
          costToRestore: partialCost,
        });
        newSoldItems.push({ batch: { ...bottomBatch }, quantitySold: remainingToSell, saleGroupId });
        totalCOGS += partialCost;
        bottomBatch.quantity -= remainingToSell;
        bottomBatch.totalCost -= partialCost;
        remainingToSell = 0;
      }
    }

    setBatches(newBatches);
    setSoldItems(newSoldItems);

    const journalEntryIds: string[] = [];
    const newEntries: JournalEntry[] = [];

    const cogsId = `${saleGroupId}-cogs`;
    journalEntryIds.push(cogsId);
    newEntries.push({
      id: cogsId,
      date: saleDate,
      type: 'sale',
      saleGroupId,
      description: `Sold ${quantityToSell} units (FIFO) - Cost`,
      entries: [
        { account: 'Cost of Sales', debit: totalCOGS },
        { account: 'Inventory', credit: totalCOGS },
      ],
    });

    if (sellingPrice && sellingPrice > 0) {
      const revenueId = `${saleGroupId}-revenue`;
      journalEntryIds.push(revenueId);
      newEntries.push({
        id: revenueId,
        date: saleDate,
        type: 'revenue',
        saleGroupId,
        description: `Sold ${quantityToSell} units - Revenue`,
        entries: [
          { account: 'Cash at Bank', debit: sellingPrice },
          { account: 'Sales Revenue', credit: sellingPrice },
        ],
      });
    }

    setJournalEntries(prev => [...newEntries, ...prev]);
    setSaleGroups(prev => [...prev, { id: saleGroupId, journalEntryIds, restorations }]);
  };

  const handleUndoSale = (saleGroupId: string) => {
    const saleGroup = saleGroups.find(sg => sg.id === saleGroupId);
    if (!saleGroup) return;

    setJournalEntries(prev => prev.filter(e => !saleGroup.journalEntryIds.includes(e.id)));

    setBatches(prev => {
      const newBatches = [...prev];
      for (const r of saleGroup.restorations) {
        const idx = newBatches.findIndex(b => b.id === r.batchId);
        if (idx !== -1) {
          newBatches[idx] = {
            ...newBatches[idx],
            quantity: newBatches[idx].quantity + r.quantityToRestore,
            totalCost: newBatches[idx].totalCost + r.costToRestore,
          };
        } else {
          newBatches.push({
            id: r.batchId,
            date: r.batchDate,
            sortTimestamp: r.batchSortTimestamp,
            quantity: r.quantityToRestore,
            totalCost: r.costToRestore,
          });
        }
      }
      return sortBatches(newBatches);
    });

    setSoldItems(prev => prev.filter(item => item.saleGroupId !== saleGroupId));
    setSaleGroups(prev => prev.filter(sg => sg.id !== saleGroupId));
  };

  const totalCostOfSales = journalEntries
    .filter(e => e.type === 'sale')
    .reduce((sum, e) => sum + (e.entries.find(l => l.account === 'Cost of Sales')?.debit ?? 0), 0);

  const totalSalesRevenue = journalEntries
    .filter(e => e.type === 'revenue')
    .reduce((sum, e) => sum + (e.entries.find(l => l.account === 'Sales Revenue')?.credit ?? 0), 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
        {/* Created By Header */}
        <div className="absolute top-20 left-6 z-10 hidden md:block">
          <div className="text-white/90 text-sm font-semibold">Created by Mr. Daniel</div>
          <div className="text-white/60 text-xs">A visual kit for Principles of Accounts</div>
        </div>

        {/* Header */}
        <header className="bg-slate-700/50 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                className="text-white hover:bg-white/10 text-xs md:text-sm"
              >
                <Menu className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
                <span className="hidden md:inline">Component Library</span>
              </Button>
            </div>
            <h1 className="text-white text-lg md:text-2xl font-semibold">Inventory Pipe</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 md:w-10 md:h-10">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 md:w-10 md:h-10">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Creator Header */}
        <div className="md:hidden bg-slate-800/50 border-b border-white/10 px-4 py-3">
          <div className="text-white/90 text-sm font-semibold">Created by Mr. Daniel</div>
          <div className="text-white/60 text-xs">A visual kit for Principles of Accounts</div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 md:gap-8 p-4 md:p-8 min-h-[calc(100vh-64px)]">
          {/* Left: Inventory Pipe */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <InventoryPipe
              batches={batches}
              onAddBatch={handleAddBatch}
              onRemoveBatch={handleRemoveBatch}
            />
          </div>

          {/* Middle: Controls */}
          <div className="flex flex-col gap-4 md:gap-6 w-full lg:w-96">
            <AddPurchases onAddBatch={handleAddBatch} />
            <ManagePartialSplits
              batches={batches}
              onSellStock={handleSellStock}
              soldItems={soldItems}
            />
          </div>

          {/* Right: Journal Entries and Inventory Summary */}
          <div className="flex flex-col gap-4 md:gap-6 w-full lg:w-96">
            <div className="bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold">JOURNAL ENTRIES</h3>
              </div>

              <div className="space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2">
                {journalEntries.length === 0 ? (
                  <div className="text-white/40 text-sm text-center py-8">
                    Journal entries will appear here when you make purchases or sales
                  </div>
                ) : (
                  journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`bg-slate-700/60 rounded-lg p-3 border ${
                        entry.type === 'purchase'
                          ? 'border-blue-400/30'
                          : entry.type === 'revenue'
                          ? 'border-purple-400/30'
                          : 'border-green-400/30'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {entry.type === 'purchase' ? (
                            <div className="w-6 h-6 rounded bg-blue-600/40 flex items-center justify-center">
                              <Plus className="w-4 h-4 text-blue-300" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded bg-green-600/40 flex items-center justify-center">
                              <Minus className="w-4 h-4 text-green-300" />
                            </div>
                          )}
                          <span className="text-white/90 text-sm font-semibold uppercase">
                            {entry.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-xs">{entry.date}</span>
                          {entry.saleGroupId && (
                            <button
                              onClick={() => handleUndoSale(entry.saleGroupId!)}
                              className="p-1 rounded transition-colors text-red-400/50 hover:text-red-400 hover:bg-red-500/20"
                              title="Undo this sale"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/70 text-xs mb-3 italic">{entry.description}</p>

                      {/* Entries Table */}
                      <div className="bg-slate-800/60 rounded border border-white/10">
                        {/* Header Row */}
                        <div className="grid grid-cols-3 gap-2 p-2 border-b border-white/10 text-white/60 text-xs font-semibold">
                          <div>Account</div>
                          <div className="text-right">Debit</div>
                          <div className="text-right">Credit</div>
                        </div>

                        {/* Entry Rows */}
                        {entry.entries.map((line, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-2 p-2 text-white text-xs border-b border-white/5 last:border-b-0"
                          >
                            <div className="text-white/90">{line.account}</div>
                            <div className="text-right font-mono">
                              {line.debit !== undefined ? `$${line.debit.toFixed(2)}` : '—'}
                            </div>
                            <div className="text-right font-mono">
                              {line.credit !== undefined ? `$${line.credit.toFixed(2)}` : '—'}
                            </div>
                          </div>
                        ))}

                        {/* Totals Row */}
                        <div className="grid grid-cols-3 gap-2 p-2 bg-slate-900/40 text-white/80 text-xs font-semibold">
                          <div>Total</div>
                          <div className="text-right font-mono">
                            ${entry.entries.reduce((sum, e) => sum + (e.debit || 0), 0).toFixed(2)}
                          </div>
                          <div className="text-right font-mono">
                            ${entry.entries.reduce((sum, e) => sum + (e.credit || 0), 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-white/60 text-xs">
                  <p className="font-semibold mb-1">Note:</p>
                  <p>• Purchase entries record inventory acquired</p>
                  <p>• Sale entries record cost of sales using FIFO method</p>
                  <p>• Click the trash icon on a sale entry to undo the entire sale</p>
                </div>
              </div>
            </div>

            {/* Inventory Summary Below Journal Entries */}
            <InventorySummary
              batches={batches}
              totalCostOfSales={totalCostOfSales}
              totalSalesRevenue={totalSalesRevenue}
            />
          </div>
        </div>

        {/* Component Library Panel */}
        <ComponentLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />

        {/* Instructions */}
        <InstructionsPanel />
      </div>
    </DndProvider>
  );
}
