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
