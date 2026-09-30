import { useState } from 'react';
import { Scissors, ShoppingCart, ArrowDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Batch } from './BatchComponent';
import { Label } from './ui/label';

interface ManagePartialSplitsProps {
  batches: Batch[];
  onSellStock: (quantity: number, saleDate: string, sellingPrice?: number) => void;
  soldItems: Array<{ batch: Batch; quantitySold: number; saleGroupId: string }>;
}

export function ManagePartialSplits({ batches, onSellStock, soldItems }: ManagePartialSplitsProps) {
  const [sellQuantity, setSellQuantity] = useState('15');
  const [saleDate, setSaleDate] = useState('Mar 17, 2026');
  const [sellingPrice, setSellingPrice] = useState('');

  const bottomBatch = batches[batches.length - 1];

  const handleSell = () => {
    const quantity = parseInt(sellQuantity) || 0;
    const price = sellingPrice ? parseFloat(sellingPrice) : undefined;
    if (quantity > 0) {
      onSellStock(quantity, saleDate, price);
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Scissors className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">MAKE A SALE</h3>
      </div>

      {bottomBatch ? (
        <div className="space-y-4">
          {/* Sell Input */}
          <div className="bg-slate-700/60 rounded-lg p-3 border border-white/10">
            <div className="space-y-2">
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Date of Sale</Label>
                <Input
                  type="text"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full bg-slate-600/50 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Units to Sell</Label>
                <Input
                  type="number"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  className="w-full bg-slate-600/50 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Total Selling Price (Optional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Leave blank to skip"
                  className="w-full bg-slate-600/50 border-white/20 text-white placeholder:text-white/30"
                />
              </div>
              <Button
                onClick={handleSell}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Sell
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white/40 text-sm text-center py-8">
          Add batches to the pipe to manage sales
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-start gap-2 text-white/60 text-xs">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/40 flex items-center justify-center text-white">
            1
          </div>
          <p>New purchases go on top, oldest purchases move down the Inventory Pipe.</p>
        </div>
        <div className="flex items-start gap-2 text-white/60 text-xs mt-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600/40 flex items-center justify-center text-white">
            2
          </div>
          <div>
            <p className="font-semibold">SELL STOCK (FIFO)</p>
            <p className="mt-1">Sell from bottom; The oldest stock is removed first.</p>
          </div>
        </div>
      </div>

      {/* Sold Items Display */}
      {soldItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-green-400" />
            <h4 className="text-white/80 text-sm font-semibold">Sale</h4>
          </div>
          <div className="space-y-2">
            {soldItems.map((item, index) => {
              const unitCost = item.batch.totalCost / item.batch.quantity;
              return (
                <div
                  key={index}
                  className="bg-green-900/30 rounded px-3 py-2 border border-green-500/30"
                >
                  <div className="text-white text-xs">
                    Sold {item.quantitySold} units @ ${unitCost.toFixed(2)}
                  </div>
                  <div className="text-white/60 text-xs">{item.batch.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}