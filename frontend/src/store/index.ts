import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './reducers/stocksReducer';
import positionsReducer from './reducers/positionsReducer';
import watchlistReducer from './reducers/watchlistReducer';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    positions: positionsReducer,
    watchlist: watchlistReducer,
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
