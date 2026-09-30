import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Batch } from './BatchComponent';

interface AddPurchasesProps {
  onAddBatch: (batch: Batch, paymentAccount?: string) => void;
}

export function AddPurchases({ onAddBatch }: AddPurchasesProps) {
  const [date, setDate] = useState('Jan 15, 2022');
  const [quantity, setQuantity] = useState('20');
  const [totalCost, setTotalCost] = useState('200');
  const [paymentAccount, setPaymentAccount] = useState('Trade Payables');

  const handleAdd = () => {
    const batch: Batch = {
      id: Date.now().toString() + Math.random(),
      date,
      quantity: parseInt(quantity) || 0,
      totalCost: parseFloat(totalCost) || 0,
    };
    onAddBatch(batch, paymentAccount);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-red-400/40 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">ADD PURCHASES</h3>
      </div>

      <div className="bg-slate-700/60 rounded-lg p-3 border border-white/10">
        <h4 className="text-white/90 text-sm font-semibold mb-3">Customizable Batch</h4>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <Label className="text-white/70">Date</Label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-32 h-7 text-xs bg-slate-600/50 border-white/20 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white/70">Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-32 h-7 text-xs bg-slate-600/50 border-white/20 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white/70">Total Cost</Label>
            <Input
              type="number"
              step="0.01"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="w-32 h-7 text-xs bg-slate-600/50 border-white/20 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white/70">Payment Account</Label>
            <Input
              value={paymentAccount}
              onChange={(e) => setPaymentAccount(e.target.value)}
              className="w-32 h-7 text-xs bg-slate-600/50 border-white/20 text-white"
            />
          </div>

          <Button
            onClick={handleAdd}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Add to Pipe
          </Button>
        </div>
      </div>
    </div>
  );
}