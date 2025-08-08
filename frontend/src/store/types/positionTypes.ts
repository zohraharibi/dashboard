import type { Stock } from './stockTypes';

// Position entity types
export interface Position {
  id: number;
  user_id: number;
  stock_id: number;
  stock: Stock;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  total_value: number;
  created_at: string;
  updated_at: string;
}

// Portfolio summary type
export interface PortfolioSummary {
  total_value: number;
  total_positions: number;
  total_stocks: number;
  positions: Position[];
}

// API request/response types
export interface CreatePositionRequest {
  stock_id: number;
  quantity: number;
  purchase_price: number;
}

export interface UpdatePositionRequest {
  quantity?: number;
  purchase_price?: number;
}

export interface BuySharesRequest {
  stockId: number;
  quantity: number;
  purchasePrice: number;
}

export interface SellSharesRequest {
  positionId: number;
  quantity: number;
}

export interface PositionResponse {
  id: number;
  user_id: number;
  stock_id: number;
  stock: Stock;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  total_value: number;
  created_at: string;
  updated_at: string;
}

// Redux state type
export interface PositionsState {
  positions: Position[];
  portfolioSummary: PortfolioSummary | null;
  isLoading: boolean;
  error: string | null;
}
