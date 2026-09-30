import { Calculator } from 'lucide-react';
import { Batch } from './BatchComponent';

interface InventorySummaryProps {
  batches: Batch[];
  totalCostOfSales: number;
  totalSalesRevenue: number;
}

export function InventorySummary({ batches, totalCostOfSales, totalSalesRevenue }: InventorySummaryProps) {
  // Calculate ending inventory from remaining batches
  const endingInventory = batches.reduce((sum, batch) => sum + batch.totalCost, 0);

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">INVENTORY SUMMARY</h3>
      </div>

      <div className="space-y-3">
        {/* Sales Revenue */}
        <div className="bg-slate-700/60 rounded-lg p-3 border border-blue-400/30">
          <div className="text-white/70 text-xs mb-1">Total Sales Revenue</div>
          <div className="text-white text-2xl font-bold">
            ${totalSalesRevenue.toFixed(2)}
          </div>
        </div>

        {/* Cost of Sales */}
        <div className="bg-slate-700/60 rounded-lg p-3 border border-red-400/30">
          <div className="text-white/70 text-xs mb-1">Total Cost of Sales</div>
          <div className="text-white text-2xl font-bold">
            ${totalCostOfSales.toFixed(2)}
          </div>
        </div>

        {/* Ending Inventory */}
        <div className="bg-slate-700/60 rounded-lg p-3 border border-green-400/30">
          <div className="text-white/70 text-xs mb-1">Ending Inventory</div>
          <div className="text-white text-2xl font-bold">
            ${endingInventory.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-white/60 text-xs">
          <p className="font-semibold mb-1">Calculation:</p>
          <p>• Sales Revenue: Sum of all revenue journal entries</p>
          <p>• Cost of Sales: Sum of all sale journal entries</p>
          <p>• Ending Inventory: Sum of remaining batches in pipe</p>
        </div>
      </div>
    </div>
  );
}