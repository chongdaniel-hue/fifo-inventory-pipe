import { useState } from 'react';
import { BatchComponent, Batch } from './BatchComponent';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Edit } from 'lucide-react';

interface ComponentLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComponentLibrary({ isOpen, onClose }: ComponentLibraryProps) {
  const [customDate, setCustomDate] = useState('Jan 15, 2022');
  const [customQuantity, setCustomQuantity] = useState('20');
  const [customUnitCost, setCustomUnitCost] = useState('10');

  if (!isOpen) return null;

  const presetBatches: Array<{ quantity: number; variant: '5' | '10' | '15' | '20' }> = [
    { quantity: 5, variant: '5' },
    { quantity: 10, variant: '10' },
    { quantity: 15, variant: '15' },
    { quantity: 20, variant: '20' },
  ];

  const createBatch = (quantity: number, unitCost: number = 10): Batch => ({
    id: Date.now().toString(),
    date: 'Mar 15, 2022',
    quantity,
    unitCost,
  });

  const createCustomBatch = (): Batch => ({
    id: Date.now().toString(),
    date: customDate,
    quantity: parseInt(customQuantity) || 20,
    unitCost: parseFloat(customUnitCost) || 10,
  });

  return (
    <div className="fixed left-0 top-0 bottom-0 w-96 bg-slate-800/95 backdrop-blur-md border-r border-white/20 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Component Library</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Batch Components Section */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-2">Batch Components</h3>
          <p className="text-white/60 text-sm mb-4">
            Draggable and configurable. Students commits for built variants and configurable batch components.
          </p>

          <div className="space-y-3">
            {presetBatches.map(({ quantity, variant }) => (
              <div key={quantity} className="flex justify-center">
                <BatchComponent
                  batch={createBatch(quantity)}
                  variant={variant}
                  isDraggable={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customizable Batch */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Edit className="w-4 h-4 text-white" />
            <h3 className="text-white font-semibold">Customizable Batch</h3>
          </div>
          <p className="text-white/60 text-sm mb-4">Type in custom values</p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-date" className="text-white/80 text-sm">
                Date
              </Label>
              <Input
                id="custom-date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                placeholder="Date of Purchase"
                className="bg-slate-600/50 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="custom-quantity" className="text-white/80 text-sm">
                Quantity
              </Label>
              <Input
                id="custom-quantity"
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                className="bg-slate-600/50 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="custom-unit-cost" className="text-white/80 text-sm">
                Unit Cost
              </Label>
              <Input
                id="custom-unit-cost"
                type="number"
                step="0.01"
                value={customUnitCost}
                onChange={(e) => setCustomUnitCost(e.target.value)}
                className="bg-slate-600/50 border-white/20 text-white"
              />
            </div>

            <div className="mt-4">
              <BatchComponent
                batch={createCustomBatch()}
                variant="custom"
                isDraggable={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
