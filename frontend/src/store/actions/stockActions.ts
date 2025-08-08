import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  Stock, 
  CreateStockRequest, 
  UpdateStockRequest, 
  SearchStocksRequest 
} from '../types/stockTypes';

// API base URL - should match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Custom error class for API errors
class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Async thunk actions for stocks
export const fetchStocks = createAsyncThunk<Stock[]>(
  'stocks/fetchStocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to fetch stocks', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const searchStocks = createAsyncThunk<Stock[], SearchStocksRequest>(
  'stocks/searchStocks',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/search?query=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to search stocks', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const getStockById = createAsyncThunk<Stock, number>(
  'stocks/getStockById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to get stock', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const getStockBySymbol = createAsyncThunk<Stock, string>(
  'stocks/getStockBySymbol',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/symbol/${symbol}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to get stock by symbol', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createStock = createAsyncThunk<Stock, CreateStockRequest>(
  'stocks/createStock',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(stockData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to create stock', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateStock = createAsyncThunk<Stock, { id: number; data: UpdateStockRequest }>(
  'stocks/updateStock',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to update stock', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deleteStock = createAsyncThunk<number, number>(
  'stocks/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to delete stock', response.status);
      }

      return id;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);
