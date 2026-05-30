import type { Trade, Status } from '../types/marketplace-trades.types';
import { TradeCard } from './TradeCard';

interface TradeGridProps {
      trades: Trade[];
      highlightId: string | null;
      onEdit: (trade: Trade) => void;
      onDelete: (trade: Trade) => void;
      onStatusChange: (trade: Trade, status: Status) => void;
}

export function TradeGrid({
      trades,
      highlightId,
      onEdit,
      onDelete,
      onStatusChange,
}: TradeGridProps) {
      return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {trades.map((trade) => (
                        <TradeCard 
                              key={trade.id}
                              trade={trade}
                              highlighted={trade.id === highlightId}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onStatusChange={onStatusChange}
                        />
                  ))}
            </div>
      );
}