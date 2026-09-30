import { BookOpen, Plus, Minus } from 'lucide-react';

export interface JournalEntry {
  id: string;
  date: string;
  type: 'purchase' | 'sale' | 'revenue';
  entries: Array<{
    account: string;
    debit?: number;
    credit?: number;
  }>;
  description: string;
  batchId?: string;
  saleGroupId?: string;
}

interface JournalEntriesProps {
  entries: JournalEntry[];
}

export function JournalEntries({ entries }: JournalEntriesProps) {
  return (
    <div className="fixed right-6 top-20 bottom-6 w-96 bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-xl flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">JOURNAL ENTRIES</h3>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {entries.length === 0 ? (
          <div className="text-white/40 text-sm text-center py-8">
            Journal entries will appear here when you make purchases or sales
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-slate-700/60 rounded-lg p-3 border ${
                entry.type === 'purchase'
                  ? 'border-blue-400/30'
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
                <span className="text-white/60 text-xs">{entry.date}</span>
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
                    $
                    {entry.entries
                      .reduce((sum, e) => sum + (e.debit || 0), 0)
                      .toFixed(2)}
                  </div>
                  <div className="text-right font-mono">
                    $
                    {entry.entries
                      .reduce((sum, e) => sum + (e.credit || 0), 0)
                      .toFixed(2)}
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
        </div>
      </div>
    </div>
  );
}