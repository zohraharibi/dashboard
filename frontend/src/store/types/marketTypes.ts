// Market data types for topbar quotes
export interface StockQuote {
  symbol: string;
  current_price: number;
  change: number;
  percent_change: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface MarketState {
  quotes: StockQuote[];
  isLoading: boolean;
  error: string | null;
}

export interface FetchQuotesRequest {
  symbols: string[];
}
