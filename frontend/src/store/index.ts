import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './reducers/stocksReducer';
import positionsReducer from './reducers/positionsReducer';
import watchlistReducer from './reducers/watchlistReducer';
import selectedStockReducer from './reducers/selectedStockReducer';
import authReducer from './reducers/authReducer';
import marketReducer from './reducers/marketReducer';
import tradeHistoryReducer from './reducers/tradeHistoryReducer';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stocksReducer,
    positions: positionsReducer,
    watchlist: watchlistReducer,
    selectedStock: selectedStockReducer,
    market: marketReducer,
    tradeHistory: tradeHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
