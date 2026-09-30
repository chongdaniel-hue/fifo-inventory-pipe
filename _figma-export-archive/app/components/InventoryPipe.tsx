import { useDrop } from 'react-dnd';
import { BatchComponent, Batch } from './BatchComponent';
import { ArrowDown } from 'lucide-react';

interface InventoryPipeProps {
  batches: Batch[];
  onAddBatch: (batch: Batch, paymentAccount?: string) => void;
  onRemoveBatch: (id: string) => void;
}

export function InventoryPipe({ batches, onAddBatch, onRemoveBatch }: InventoryPipeProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'BATCH',
      drop: (item: { batch: Batch }) => {
        onAddBatch({
          ...item.batch,
          id: Date.now().toString() + Math.random(),
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onAddBatch]
  );

  const getVariant = (quantity: number): '5' | '10' | '15' | '20' | 'custom' => {
    if (quantity === 5) return '5';
    if (quantity === 10) return '10';
    if (quantity === 15) return '15';
    if (quantity === 20) return '20';
    return 'custom';
  };

  return (
    <div className="flex flex-col items-center gap-4 h-full">
      <div className="text-white/60 text-sm flex items-center gap-2">
        <span className="font-semibold">TOP: Purchases Enter</span>
        <ArrowDown className="w-4 h-4" />
      </div>
      
      <div
        ref={drop}
        className={`flex-1 w-80 border-l-4 border-r-4 border-white/40 bg-gradient-to-b 
                    from-white/5 to-white/10 rounded-lg p-4 flex flex-col gap-3 
                    transition-all min-h-[600px] relative overflow-y-auto
                    ${isOver ? 'border-cyan-400 bg-cyan-500/20' : ''}`}
      >
        {batches.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-white/40 text-center">
            <div>
              <p className="text-lg">Drag batches here</p>
              <p className="text-sm mt-2">New batches appear at the top</p>
            </div>
          </div>
        ) : (
          <>
            {batches.map((batch, index) => (
              <div key={batch.id} className="relative">
                <BatchComponent
                  batch={batch}
                  variant={getVariant(batch.quantity)}
                  onRemove={() => onRemoveBatch(batch.id)}
                />
                {index < batches.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                {index === batches.length - 1 && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                    Oldest
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="text-white/60 text-sm flex items-center gap-2">
        <span className="font-semibold">BOTTOM: Sales Exit</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </div>
  );
}
