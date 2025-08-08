import type { Stock } from './stockTypes';

// Watchlist entity types
export interface WatchlistItem {
  id: number;
  user_id: number;
  stock_id: number;
  stock: Stock;
  notes?: string;
  added_date: string;
  created_at: string;
  updated_at: string;
}

// Watchlist summary type
export interface WatchlistSummary {
  total_items: number;
  unique_stocks: number;
  items: WatchlistItem[];
}

// API request/response types
export interface AddToWatchlistRequest {
  stock_id: number;
  notes?: string;
}

export interface UpdateWatchlistRequest {
  notes?: string;
}

export interface WatchlistItemResponse {
  id: number;
  user_id: number;
  stock_id: number;
  stock: Stock;
  notes?: string;
  added_date: string;
  created_at: string;
  updated_at: string;
}

// Redux state type
export interface WatchlistState {
  watchlistItems: WatchlistItem[];
  watchlistSummary: WatchlistSummary | null;
  isLoading: boolean;
  error: string | null;
}
