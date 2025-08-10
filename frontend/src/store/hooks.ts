import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    dispatch,
  };
};

// Custom hooks for each slice
export const useStocks = () => {
  const dispatch = useAppDispatch();
  const { 
    stocks, 
    currentStock, 
    currentQuote, 
    currentProfile, 
    chartData, 
    isLoading, 
    isQuoteLoading, 
    isProfileLoading, 
    isChartLoading, 
    error 
  } = useAppSelector((state) => state.stocks);

  // Helper function to get chart for specific stock and timeframe
  const getChartData = (symbol: string, timeframe: string) => {
    const chartKey = `${symbol}-${timeframe}`;
    return chartData[chartKey] || null;
  };

  return {
    stocks,
    currentStock,
    currentQuote,
    currentProfile,
    chartData,
    getChartData,
    isLoading,
    isQuoteLoading,
    isProfileLoading,
    isChartLoading,
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

export const useSelectedStock = () => {
  const dispatch = useAppDispatch();
  const { selectedStock, selectedStockId } = useAppSelector((state) => state.selectedStock);

  return {
    selectedStock,
    selectedStockId,
    dispatch,
  };
};

export const useMarket = () => {
  const dispatch = useAppDispatch();
  const { quotes, isLoading, error } = useAppSelector((state) => state.market);

  return {
    quotes,
    isLoading,
    error,
    dispatch,
  };
};

export const useTradeHistory = () => {
  const dispatch = useAppDispatch();
  const { trades, isLoading, error } = useAppSelector((state) => state.tradeHistory);

  return {
    trades,
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
