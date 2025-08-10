// Trade history types
export interface TradeHistoryItem {
  id: number;
  trade_type: 'BUY' | 'SELL';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  trade_date: string;
  notes?: string;
  stock: {
    symbol: string;
    name: string;
  };
}

export interface TradeHistoryState {
  trades: TradeHistoryItem[];
  isLoading: boolean;
  error: string | null;
}
