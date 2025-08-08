import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WatchlistState, WatchlistItem, WatchlistSummary } from '../types/watchlistTypes';
import {
  fetchWatchlistItems,
  getWatchlistSummary,
  getWatchlistItemById,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist
} from '../actions/watchlistActions';

// Initial state
const initialState: WatchlistState = {
  watchlistItems: [],
  watchlistSummary: null,
  isLoading: false,
  error: null,
};

// Create the watchlist slice
const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    // Synchronous reducers
    clearWatchlistSummary: (state) => {
      state.watchlistSummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch watchlist items
    builder
      .addCase(fetchWatchlistItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWatchlistItems.fulfilled, (state, action: PayloadAction<WatchlistItem[]>) => {
        state.isLoading = false;
        state.watchlistItems = action.payload;
        state.error = null;
      })
      .addCase(fetchWatchlistItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get watchlist summary
    builder
      .addCase(getWatchlistSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWatchlistSummary.fulfilled, (state, action: PayloadAction<WatchlistSummary>) => {
        state.isLoading = false;
        state.watchlistSummary = action.payload;
        state.watchlistItems = action.payload.items;
        state.error = null;
      })
      .addCase(getWatchlistSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get watchlist item by ID
    builder
      .addCase(getWatchlistItemById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWatchlistItemById.fulfilled, (state, action: PayloadAction<WatchlistItem>) => {
        state.isLoading = false;
        const index = state.watchlistItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.watchlistItems[index] = action.payload;
        } else {
          state.watchlistItems.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getWatchlistItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to watchlist
    builder
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state, action: PayloadAction<WatchlistItem>) => {
        state.isLoading = false;
        state.watchlistItems.push(action.payload);
        state.error = null;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update watchlist item
    builder
      .addCase(updateWatchlistItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWatchlistItem.fulfilled, (state, action: PayloadAction<WatchlistItem>) => {
        state.isLoading = false;
        const index = state.watchlistItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.watchlistItems[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateWatchlistItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from watchlist
    builder
      .addCase(removeFromWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.watchlistItems = state.watchlistItems.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearWatchlistSummary, clearError, setLoading } = watchlistSlice.actions;
export default watchlistSlice.reducer;
