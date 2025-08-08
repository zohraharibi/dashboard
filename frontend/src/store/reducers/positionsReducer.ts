import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PositionsState, Position, PortfolioSummary } from '../types/positionTypes';
import {
  fetchPositions,
  fetchPortfolioSummary,
  getPositionById,
  getPositionsByUserId,
  createPosition,
  updatePosition,
  deletePosition,
  buyShares,
  sellShares
} from '../actions/positionActions';

// Initial state
const initialState: PositionsState = {
  positions: [],
  portfolioSummary: null,
  isLoading: false,
  error: null,
};

// Create the positions slice
const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    // Synchronous reducers
    clearPortfolioSummary: (state) => {
      state.portfolioSummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch positions
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<Position[]>) => {
        state.isLoading = false;
        state.positions = action.payload;
        state.error = null;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch portfolio summary
    builder
      .addCase(fetchPortfolioSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioSummary.fulfilled, (state, action: PayloadAction<PortfolioSummary>) => {
        state.isLoading = false;
        state.portfolioSummary = action.payload;
        state.positions = action.payload.positions;
        state.error = null;
      })
      .addCase(fetchPortfolioSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get position by ID
    builder
      .addCase(getPositionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPositionById.fulfilled, (state, action: PayloadAction<Position>) => {
        state.isLoading = false;
        const index = state.positions.findIndex(pos => pos.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        } else {
          state.positions.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getPositionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get positions by user ID
    builder
      .addCase(getPositionsByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPositionsByUserId.fulfilled, (state, action: PayloadAction<Position[]>) => {
        state.isLoading = false;
        state.positions = action.payload;
        state.error = null;
      })
      .addCase(getPositionsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create position
    builder
      .addCase(createPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, action: PayloadAction<Position>) => {
        state.isLoading = false;
        state.positions.push(action.payload);
        state.error = null;
      })
      .addCase(createPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update position
    builder
      .addCase(updatePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action: PayloadAction<Position>) => {
        state.isLoading = false;
        const index = state.positions.findIndex(pos => pos.id === action.payload.id);
        if (index !== -1) {
          state.positions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete position
    builder
      .addCase(deletePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.positions = state.positions.filter(pos => pos.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Buy shares
    builder
      .addCase(buyShares.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyShares.fulfilled, (state, action: PayloadAction<Position>) => {
        state.isLoading = false;
        const existingIndex = state.positions.findIndex(pos => 
          pos.stock_id === action.payload.stock_id
        );
        
        if (existingIndex !== -1) {
          // Update existing position
          state.positions[existingIndex] = action.payload;
        } else {
          // Add new position
          state.positions.push(action.payload);
        }
        state.error = null;
      })
      .addCase(buyShares.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sell shares
    builder
      .addCase(sellShares.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellShares.fulfilled, (state, action: PayloadAction<{ positionId: number; remainingPosition?: Position }>) => {
        state.isLoading = false;
        const { positionId, remainingPosition } = action.payload;
        
        if (remainingPosition) {
          // Update the position with remaining shares
          const index = state.positions.findIndex(pos => pos.id === positionId);
          if (index !== -1) {
            state.positions[index] = remainingPosition;
          }
        } else {
          // Remove the position completely (all shares sold)
          state.positions = state.positions.filter(pos => pos.id !== positionId);
        }
        state.error = null;
      })
      .addCase(sellShares.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearPortfolioSummary, clearError, setLoading } = positionsSlice.actions;
export default positionsSlice.reducer;
