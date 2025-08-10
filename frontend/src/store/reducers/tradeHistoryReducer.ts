import { createSlice } from '@reduxjs/toolkit';
import type { TradeHistoryState } from '../types/tradeHistoryTypes';
import { fetchTradeHistory } from '../actions/tradeHistoryActions';

const initialState: TradeHistoryState = {
  trades: [],
  isLoading: false,
  error: null,
};

const tradeHistorySlice = createSlice({
  name: 'tradeHistory',
  initialState,
  reducers: {
    clearTradeHistoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trade history
      .addCase(fetchTradeHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trades = action.payload;
        state.error = null;
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch trade history';
      });
  },
});

export const { clearTradeHistoryError } = tradeHistorySlice.actions;
export default tradeHistorySlice.reducer;
