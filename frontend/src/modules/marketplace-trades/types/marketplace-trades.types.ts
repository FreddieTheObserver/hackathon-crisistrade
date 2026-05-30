import type { z } from 'zod';
import type { 
      tradeSchema,
      tradeFormSchema,
      ItemType,
      Urgency,
      Status,
} from '../schemas/marketplace-trades.schemas';

export type Trade = z.infer<typeof tradeSchema>;

export type TradeFormValues = z.infer<typeof tradeFormSchema>;

export interface TradeFilters {
      search: string;
      area: string;
      itemType: ItemType | '';
      urgency: Urgency | '';
      status: Status | '';
}