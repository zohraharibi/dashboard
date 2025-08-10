import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TradeHistoryItem } from '../types/tradeHistoryTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fetch trade history
export const fetchTradeHistory = createAsyncThunk<
  TradeHistoryItem[],
  void,
  { rejectValue: string }
>(
  'tradeHistory/fetchTradeHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/trade-history/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        return rejectWithValue('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);
