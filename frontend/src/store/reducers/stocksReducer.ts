import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StocksState, Stock } from '../types/stockTypes';
import {
  fetchStocks,
  searchStocks,
  getStockById,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock
} from '../actions/stockActions';

// Initial state
const initialState: StocksState = {
  stocks: [],
  currentStock: null,
  isLoading: false,
  error: null,
};

// Create the stocks slice
const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    // Synchronous reducers
    clearCurrentStock: (state) => {
      state.currentStock = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch stocks
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action: PayloadAction<Stock[]>) => {
        state.isLoading = false;
        state.stocks = action.payload;
        state.error = null;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search stocks
    builder
      .addCase(searchStocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchStocks.fulfilled, (state, action: PayloadAction<Stock[]>) => {
        state.isLoading = false;
        state.stocks = action.payload;
        state.error = null;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get stock by ID
    builder
      .addCase(getStockById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStockById.fulfilled, (state, action: PayloadAction<Stock>) => {
        state.isLoading = false;
        state.currentStock = action.payload;
        state.error = null;
      })
      .addCase(getStockById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get stock by symbol
    builder
      .addCase(getStockBySymbol.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStockBySymbol.fulfilled, (state, action: PayloadAction<Stock>) => {
        state.isLoading = false;
        state.currentStock = action.payload;
        state.error = null;
      })
      .addCase(getStockBySymbol.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create stock
    builder
      .addCase(createStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStock.fulfilled, (state, action: PayloadAction<Stock>) => {
        state.isLoading = false;
        state.stocks.push(action.payload);
        state.error = null;
      })
      .addCase(createStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update stock
    builder
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action: PayloadAction<Stock>) => {
        state.isLoading = false;
        const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
        if (index !== -1) {
          state.stocks[index] = action.payload;
        }
        if (state.currentStock && state.currentStock.id === action.payload.id) {
          state.currentStock = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete stock
    builder
      .addCase(deleteStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStock.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.stocks = state.stocks.filter(stock => stock.id !== action.payload);
        if (state.currentStock && state.currentStock.id === action.payload) {
          state.currentStock = null;
        }
        state.error = null;
      })
      .addCase(deleteStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearCurrentStock, clearError, setLoading } = stocksSlice.actions;
export default stocksSlice.reducer;
