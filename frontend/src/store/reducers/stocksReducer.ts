import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StocksState, Stock } from '../types/stockTypes';
import {
  fetchStocks,
  searchStocks,
  getStockById,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock,
  getStockQuote,
  getStockProfile,
  getStockChart
} from '../actions/stockActions';

// Initial state
const initialState: StocksState = {
  stocks: [],
  currentStock: null,
  currentQuote: null,
  currentProfile: null,
  chartData: {},
  isLoading: false,
  isQuoteLoading: false,
  isProfileLoading: false,
  isChartLoading: false,
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
    clearCurrentQuote: (state) => {
      state.currentQuote = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearCurrentChart: (state) => {
      state.chartData = {};
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

    // Get stock quote (Finnhub)
    builder
      .addCase(getStockQuote.pending, (state) => {
        state.isQuoteLoading = true;
        state.error = null;
      })
      .addCase(getStockQuote.fulfilled, (state, action) => {
        state.isQuoteLoading = false;
        state.currentQuote = action.payload;
        state.error = null;
      })
      .addCase(getStockQuote.rejected, (state, action) => {
        state.isQuoteLoading = false;
        state.error = action.payload as string;
      });

    // Get stock profile (Finnhub)
    builder
      .addCase(getStockProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.error = null;
      })
      .addCase(getStockProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(getStockProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload as string;
      });

    // Get stock chart
    builder
      .addCase(getStockChart.pending, (state) => {
        state.isChartLoading = true;
        state.error = null;
      })
      .addCase(getStockChart.fulfilled, (state, action) => {
        state.isChartLoading = false;
        const chartKey = `${action.payload.symbol}-${action.payload.timeframe}`;
        state.chartData[chartKey] = action.payload;
        state.error = null;
      })
      .addCase(getStockChart.rejected, (state, action) => {
        state.isChartLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { 
  clearCurrentStock, 
  clearCurrentQuote, 
  clearCurrentProfile, 
  clearCurrentChart, 
  clearError, 
  setLoading 
} = stocksSlice.actions;
export default stocksSlice.reducer;
