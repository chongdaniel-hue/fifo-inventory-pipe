import { useDrag } from 'react-dnd';
import { X } from 'lucide-react';

export interface Batch {
  id: string;
  date: string;
  quantity: number;
  totalCost: number;
  sortTimestamp?: number;
}

interface BatchComponentProps {
  batch: Batch;
  variant?: '5' | '10' | '15' | '20' | 'custom';
  onRemove?: () => void;
  isDraggable?: boolean;
  className?: string;
}

const COLORS = {
  '5': 'bg-blue-600',
  '10': 'bg-green-600',
  '15': 'bg-yellow-600',
  '20': 'bg-red-600',
  'custom': 'bg-gray-600'
};

const HEIGHTS = {
  '5': 'h-16',
  '10': 'h-24',
  '15': 'h-32',
  '20': 'h-40',
  'custom': 'h-28'
};

export function BatchComponent({ 
  batch, 
  variant = 'custom', 
  onRemove, 
  isDraggable = false,
  className = ''
}: BatchComponentProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'BATCH',
      item: { batch },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: isDraggable,
    }),
    [batch, isDraggable]
  );

  const colorClass = COLORS[variant];
  const heightClass = HEIGHTS[variant];

  return (
    <div
      ref={isDraggable ? drag : null}
      className={`relative ${heightClass} ${colorClass} rounded-lg border-2 border-white/30 
                  backdrop-blur-sm flex flex-col items-center justify-center text-white 
                  shadow-lg transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}
                  ${isDraggable ? 'cursor-move hover:scale-105' : ''} ${className}`}
      style={{ minWidth: '160px' }}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <div className="text-center px-3">
        <div className="text-lg font-semibold">
          {batch.quantity} Units
        </div>
        <div className="text-sm opacity-90">{batch.date}</div>
        <div className="text-xs opacity-75 mt-1">
          Total: ${batch.totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  );
}