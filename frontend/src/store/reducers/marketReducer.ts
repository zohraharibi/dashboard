import { createSlice } from '@reduxjs/toolkit';
import type { MarketState } from '../types/marketTypes';
import { fetchMarketQuotes } from '../actions/marketActions';

const initialState: MarketState = {
  quotes: [],
  isLoading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearMarketError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch market quotes
      .addCase(fetchMarketQuotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketQuotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes = action.payload;
        state.error = null;
      })
      .addCase(fetchMarketQuotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch market quotes';
      });
  },
});

export const { clearMarketError } = marketSlice.actions;
export default marketSlice.reducer;
