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

// Finnhub API types
export interface StockQuote {
  current_price: number;
  change: number;
  percent_change: number;
  high_price: number;
  low_price: number;
  open_price: number;
  previous_close: number;
  direction: 'up' | 'down' | 'neutral';
  last_updated: string;
}

export interface StockProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface ChartData {
  symbol: string;
  timeframe: string;
  points: string;
  viewBox: string;
}

// Redux state type
export interface StocksState {
  stocks: Stock[];
  currentStock: Stock | null;
  currentQuote: StockQuote | null;
  currentProfile: StockProfile | null;
  currentChart: ChartData | null;
  isLoading: boolean;
  isQuoteLoading: boolean;
  isProfileLoading: boolean;
  isChartLoading: boolean;
  error: string | null;
}
