import { Info, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function InstructionsPanel() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-3 shadow-xl hover:bg-slate-700/90 transition-colors"
      >
        <Info className="w-5 h-5 text-cyan-400" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-4 max-w-md shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Instructions</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0 hover:bg-white/10"
        >
          <X className="w-4 h-4 text-white/60" />
        </Button>
      </div>

      <div className="space-y-2 text-white/80 text-sm">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/60 flex items-center justify-center text-white text-xs">
            1
          </div>
          <p>Use "Add Purchases" section to create a customizable batch and add inventory to the pipe</p>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600/60 flex items-center justify-center text-white text-xs">
            2
          </div>
          <p>New inventory enters at the TOP (newest batches)</p>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-600/60 flex items-center justify-center text-white text-xs">
            3
          </div>
          <p>Oldest inventory stays at the BOTTOM</p>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/60 flex items-center justify-center text-white text-xs">
            4
          </div>
          <p>To make a sale, enter the "Date of Sale" and "Units to Sell" in the "Make a Sale" section, then click the Sell button</p>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600/60 flex items-center justify-center text-white text-xs">
            5
          </div>
          <p>When a sale is made, inventory from the BOTTOM (oldest inventory) is removed first (FIFO)</p>
        </div>
      </div>
    </div>
  );
}