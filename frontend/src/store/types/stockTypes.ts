// Stock entity types
export interface Stock {
  id: number;
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  currency: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Market data types
export interface StockMarketData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  volume: number;
  avg_volume: number;
  week_52_high: number;
  week_52_low: number | null;
  dividend: number;
  market_cap: string;
  pe_ratio: number;
  current_price: number;
  change: number;
  change_percent: number;
  last_updated: string;
}

// Combined stock with market data
export interface StockWithMarketData extends Stock {
  market_data?: StockMarketData;
}

// API request/response types
export interface CreateStockRequest {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  currency?: string;
}

export interface UpdateStockRequest {
  symbol?: string;
  name?: string;
  sector?: string;
  exchange?: string;
  currency?: string;
}

export interface SearchStocksRequest {
  query: string;
}

export interface StockResponse {
  id: number;
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Redux state type
export interface StocksState {
  stocks: Stock[];
  currentStock: Stock | null;
  isLoading: boolean;
  error: string | null;
}
