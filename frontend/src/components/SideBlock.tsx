import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePositions, useWatchlist, useSelectedStock, useStocks } from '../store/hooks';
import { fetchPositions } from '../store/actions/positionActions';
import { fetchWatchlistItems } from '../store/actions/watchlistActions';
import { getStockChart } from '../store/actions/stockActions';
import { setSelectedStock } from '../store/reducers/selectedStockReducer';
import type { Position } from '../store/types/positionTypes';
import type { WatchlistItem } from '../store/types/watchlistTypes';
import type { ChartData } from '../store/types/stockTypes';

const SideBlock: React.FC = () => {
  const { positions, dispatch: positionsDispatch } = usePositions();
  const { watchlistItems, dispatch: watchlistDispatch } = useWatchlist();
  const { dispatch: selectedStockDispatch } = useSelectedStock();
  const { dispatch: stocksDispatch } = useStocks();
  
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // Memoize the combined list of symbols to prevent unnecessary re-renders
  const allSymbols = useMemo(() => {
    const symbols = new Set<string>();
    positions.forEach(p => symbols.add(p.stock.symbol));
    watchlistItems.forEach(w => symbols.add(w.stock.symbol));
    return Array.from(symbols);
  }, [positions, watchlistItems]);

  // Fetch initial data
  useEffect(() => {
    positionsDispatch(fetchPositions());
    watchlistDispatch(fetchWatchlistItems());
  }, [positionsDispatch, watchlistDispatch]);

  // Stable fetch function with error handling
  const fetchChartData = useCallback(async (symbol: string) => {
    if (chartData[symbol] || isLoading[symbol]) return;
    
    try {
      setIsLoading(prev => ({ ...prev, [symbol]: true }));
      const result = await stocksDispatch(getStockChart({ symbol, timeframe: '1Y' }));
      
      if (getStockChart.fulfilled.match(result)) {
        setChartData(prev => ({
          ...prev,
          [symbol]: result.payload
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch chart for ${symbol}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [symbol]: false }));
    }
  }, [chartData, isLoading, stocksDispatch]);

  // Fetch chart data only when symbols change
  useEffect(() => {
    allSymbols.forEach(symbol => {
      fetchChartData(symbol);
    });
  }, [allSymbols, fetchChartData]);

  // Memoized click handlers
  const handlePositionClick = useCallback((position: Position) => {
    selectedStockDispatch(setSelectedStock({
      stock: position.stock,
      stockId: position.stock.id
    }));
  }, [selectedStockDispatch]);

  const handleWatchlistClick = useCallback((watchlistItem: WatchlistItem) => {
    selectedStockDispatch(setSelectedStock({
      stock: watchlistItem.stock,
      stockId: watchlistItem.stock.id
    }));
  }, [selectedStockDispatch]);

  // Memoized scaled chart points
  const getScaledPoints = useCallback((points: string = "", targetWidth: number = 60, targetHeight: number = 20): string => {
    if (!points) return "";
    
    try {
      return points.split(' ').map(point => {
        const [x, y] = point.split(',').map(Number);
        const scaledX = (x / 360) * targetWidth;
        const scaledY = (y / 150) * targetHeight;
        return `${scaledX.toFixed(1)},${scaledY.toFixed(1)}`;
      }).join(' ');
    } catch {
      return "";
    }
  }, []);

  return (
    <div className="watchlist-container px-2">
      {/* Positions Section */}
      <div className="mb-3">
        <h6 className="watchlist-section-title">Positions</h6>
        <div>
          {positions.map((item) => (
            <div 
              key={`position-${item.stock.id}`}
              className="watchlist-item" 
              onClick={() => handlePositionClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="watchlist-item-left d-flex flex-column">
                  <div className="watchlist-item-symbol">{item.stock.symbol}</div>
                  <small className="watchlist-item-label">{item.quantity} SHARES</small>
                </div>
                <div className="watchlist-item-center d-flex align-items-center">
                  <div className="watchlist-chart">
                    <svg width="60" height="20" className="position-relative">
                      <polyline
                        fill="none"
                        stroke="var(--chart-positive)"
                        strokeWidth="1.5"
                        points={getScaledPoints(chartData[item.stock.symbol]?.points)}
                        // vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
                <div className="watchlist-item-right text-end">
                  <div className={`watchlist-item-price positive`}>
                    {item.total_value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div>
        <h6 className="watchlist-section-title">Watchlist</h6>
        <div>
          {watchlistItems.map((item) => (
            <div 
              key={`watchlist-${item.stock.id}`}
              className="watchlist-item"
              onClick={() => handleWatchlistClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="watchlist-item-left d-flex flex-column">
                  <div className="watchlist-item-symbol">{item.stock.symbol}</div>
                  <small className="watchlist-item-label">Watchlist</small>
                </div>
                <div className="watchlist-item-center d-flex align-items-center">
                  <div className="watchlist-chart">
                    <svg width="80" height="30" className="position-relative">
                      <polyline
                        fill="none"
                        stroke="var(--chart-positive)"
                        strokeWidth="1.5"
                        points={getScaledPoints(chartData[item.stock.symbol]?.points)}
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
                <div className="watchlist-item-right text-end">
                  <div className={`watchlist-item-price positive`}>
                    100
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SideBlock);