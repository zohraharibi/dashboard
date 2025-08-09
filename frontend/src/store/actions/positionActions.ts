import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  Position, 
  PortfolioSummary,
  CreatePositionRequest, 
  UpdatePositionRequest, 
  BuySharesRequest,
  SellSharesRequest
} from '../types/positionTypes';

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

// Async thunk actions for positions
export const fetchPositions = createAsyncThunk<Position[]>(
  'positions/fetchPositions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to fetch positions', response.status);
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

export const fetchPortfolioSummary = createAsyncThunk<PortfolioSummary>(
  'positions/fetchPortfolioSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/portfolio-summary`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to fetch portfolio summary', response.status);
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

export const getPositionById = createAsyncThunk<Position, number>(
  'positions/getPositionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to get position', response.status);
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

export const getPositionsByUserId = createAsyncThunk<Position[], number>(
  'positions/getPositionsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/user/${userId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to get positions by user ID', response.status);
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

export const createPosition = createAsyncThunk<Position, CreatePositionRequest>(
  'positions/createPosition',
  async (positionData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(positionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to create position', response.status);
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

export const updatePosition = createAsyncThunk<Position, { id: number; data: UpdatePositionRequest }>(
  'positions/updatePosition',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to update position', response.status);
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

export const deletePosition = createAsyncThunk<number, number>(
  'positions/deletePosition',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to delete position', response.status);
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

export const buyShares = createAsyncThunk<Position, BuySharesRequest>(
  'positions/buyShares',
  async ({ stockId, quantity, purchasePrice }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          stock_id: stockId,
          quantity,
          purchase_price: purchasePrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to buy shares', response.status);
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

export const sellShares = createAsyncThunk<{ positionId: number; remainingPosition?: Position }, SellSharesRequest>(
  'positions/sellShares',
  async ({ positionId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${positionId}/sell?quantity=${quantity}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.detail || 'Failed to sell shares', response.status);
      }

      const result = await response.json();
      return {
        positionId,
        remainingPosition: result.message ? null : result, // If message exists, position was deleted
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);
