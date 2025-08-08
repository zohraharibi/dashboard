import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Stock } from '../types/stockTypes';

// Selected stock state type
export interface SelectedStockState {
  selectedStock: Stock | null;
  selectedStockId: number | null;
}

// Initial state
const initialState: SelectedStockState = {
  selectedStock: null,
  selectedStockId: null,
};

// Selected stock slice
const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<{ stock: Stock; stockId: number }>) => {
      state.selectedStock = action.payload.stock;
      state.selectedStockId = action.payload.stockId;
    },
    clearSelectedStock: (state) => {
      state.selectedStock = null;
      state.selectedStockId = null;
    },
  },
});

// Export actions
export const { setSelectedStock, clearSelectedStock } = selectedStockSlice.actions;

// Export reducer
export default selectedStockSlice.reducer;
