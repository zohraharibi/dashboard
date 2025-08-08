import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for each slice
export const useStocks = () => {
  const dispatch = useAppDispatch();
  const { stocks, currentStock, isLoading, error } = useAppSelector((state) => state.stocks);

  return {
    stocks,
    currentStock,
    isLoading,
    error,
    dispatch,
  };
};

export const usePositions = () => {
  const dispatch = useAppDispatch();
  const { positions, portfolioSummary, isLoading, error } = useAppSelector((state) => state.positions);

  return {
    positions,
    portfolioSummary,
    isLoading,
    error,
    dispatch,
  };
};

export const useWatchlist = () => {
  const dispatch = useAppDispatch();
  const { watchlistItems, watchlistSummary, isLoading, error } = useAppSelector((state) => state.watchlist);

  return {
    watchlistItems,
    watchlistSummary,
    isLoading,
    error,
    dispatch,
  };
};

// Combined hook for dashboard usage
export const useDashboard = () => {
  const stocks = useStocks();
  const positions = usePositions();
  const watchlist = useWatchlist();

  return {
    stocks,
    positions,
    watchlist,
    isLoading: stocks.isLoading || positions.isLoading || watchlist.isLoading,
    hasError: !!(stocks.error || positions.error || watchlist.error),
    errors: {
      stocks: stocks.error,
      positions: positions.error,
      watchlist: watchlist.error,
    },
  };
};
