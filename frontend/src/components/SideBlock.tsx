import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePositions, useWatchlist, useSelectedStock, useStocks } from '../store/hooks';
import { fetchPositions } from '../store/actions/positionActions';
import { fetchWatchlistItems } from '../store/actions/watchlistActions';
import { getStockChart } from '../store/actions/stockActions';
import { setSelectedStock } from '../store/reducers/selectedStockReducer';
import type { Position } from '../store/types/positionTypes';
import type { WatchlistItem } from '../store/types/watchlistTypes';
import type { ChartData } from '../store/types/stockTypes';
import { LineChart } from '@mui/x-charts/LineChart';

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
                    {chartData[item.stock.symbol]?.y_values && chartData[item.stock.symbol].y_values.length > 0 ? (
                      <LineChart
                        width={120}
                        height={60}
                        series={[
                          {
                            data: chartData[item.stock.symbol].y_values,
                            color: '#20c997'
                          }
                        ]}
                        margin={{ left: 15, right: 15, top: 15, bottom: 15 }}
                        xAxis={[{ 
                          hideTooltip: true, 
                          disableLine: true, 
                          disableTicks: true,
                          data: chartData[item.stock.symbol].y_values.map((_, index) => index)
                        }]}
                        yAxis={[{ 
                          hideTooltip: true, 
                          disableLine: true, 
                          disableTicks: true
                        }]}
                      />
                    ) : (
                      <div style={{ width: '120px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>
                        {isLoading[item.stock.symbol] ? 'Loading...' : 'No chart'}
                      </div>
                    )}
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
                    {chartData[item.stock.symbol]?.y_values && chartData[item.stock.symbol].y_values.length > 0 ? (
                      <LineChart
                        width={200}
                        height={100}
                        series={[
                          {
                            data: chartData[item.stock.symbol].y_values,
                            color: '#20c997',
                            showMark: false,
                            curve: 'linear'
                          }
                        ]}
                        margin={{ left: 15, right: 15, top: 15}}
                        xAxis={[{ 
                          hideTooltip: true, 
                          disableLine: true, 
                          disableTicks: true,
                          data: chartData[item.stock.symbol].y_values.map((_, index) => index),
                          tickLabelStyle: { display: 'none' }
                        }]}
                        yAxis={[{ 
                          hideTooltip: true, 
                          disableLine: true, 
                          disableTicks: true,
                          tickLabelStyle: { display: 'none' },
                        }]}
                      />
                    ) : (
                      <div style={{ width: '120px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>
                        {isLoading[item.stock.symbol] ? 'Loading...' : 'No chart'}
                      </div>
                    )}
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
