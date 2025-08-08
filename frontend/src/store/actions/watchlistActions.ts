import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  WatchlistItem, 
  WatchlistSummary,
  AddToWatchlistRequest, 
  UpdateWatchlistRequest
} from '../types/watchlistTypes';

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

// Async thunk actions for watchlist
export const fetchWatchlistItems = createAsyncThunk<WatchlistItem[]>(
  'watchlist/fetchWatchlistItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to fetch watchlist items', response.status);
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

export const getWatchlistSummary = createAsyncThunk<WatchlistSummary>(
  'watchlist/getWatchlistSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/summary`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to fetch watchlist summary', response.status);
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

export const getWatchlistItemById = createAsyncThunk<WatchlistItem, number>(
  'watchlist/getWatchlistItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to get watchlist item', response.status);
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

export const addToWatchlist = createAsyncThunk<WatchlistItem, AddToWatchlistRequest>(
  'watchlist/addToWatchlist',
  async (watchlistData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(watchlistData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to add to watchlist', response.status);
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

export const updateWatchlistItem = createAsyncThunk<WatchlistItem, { id: number; data: UpdateWatchlistRequest }>(
  'watchlist/updateWatchlistItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to update watchlist item', response.status);
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

export const removeFromWatchlist = createAsyncThunk<number, number>(
  'watchlist/removeFromWatchlist',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to remove from watchlist', response.status);
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
