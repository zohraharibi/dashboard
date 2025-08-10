import { createAsyncThunk } from '@reduxjs/toolkit';
import type { StockQuote, FetchQuotesRequest } from '../types/marketTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fetch market quotes for multiple stocks
export const fetchMarketQuotes = createAsyncThunk<
  StockQuote[],
  FetchQuotesRequest,
  { rejectValue: string }
>(
  'market/fetchQuotes',
  async ({ symbols }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const quotePromises = symbols.map(async (symbol) => {
        try {
          const response = await fetch(`${API_BASE_URL}/stocks/${symbol}/quote`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            return { symbol, ...data };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching quote for ${symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(quotePromises);
      const validQuotes = results.filter((quote): quote is StockQuote => quote !== null);
      
      return validQuotes;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch market quotes');
    }
  }
);
