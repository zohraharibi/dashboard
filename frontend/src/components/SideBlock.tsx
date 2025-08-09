import React, { useEffect, useState } from 'react';
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
  
  // State to store chart data for each stock symbol
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  
  // Add debugging
  console.log('Current chart data:', chartData);

  // Fetch data on component mount
  useEffect(() => {
    positionsDispatch(fetchPositions());
    watchlistDispatch(fetchWatchlistItems());
  }, [positionsDispatch, watchlistDispatch]);

  // Fetch chart data for all stocks (1Y timeframe)
  useEffect(() => {
    const allSymbols = new Set<string>();
    
    // Collect all unique symbols from positions and watchlist
    positions.forEach(position => allSymbols.add(position.stock.symbol));
    watchlistItems.forEach(item => allSymbols.add(item.stock.symbol));
    
    // Fetch 1Y chart data for each symbol
    allSymbols.forEach(async (symbol) => {
      try {
        console.log(`Fetching chart data for ${symbol}`);
        const result = await stocksDispatch(getStockChart({ symbol, timeframe: '1Y' }));
        if (getStockChart.fulfilled.match(result)) {
          console.log(`Chart data received for ${symbol}:`, result.payload);
          setChartData(prev => ({
            ...prev,
            [symbol]: result.payload
          }));
        } else {
          console.log(`Chart fetch failed for ${symbol}:`, result);
        }
      } catch (error) {
        console.error(`Failed to fetch chart for ${symbol}:`, error);
      }
    });
  }, [positions, watchlistItems, stocksDispatch]);

  // Handle position item click
  const handlePositionClick = (position: Position) => {
    selectedStockDispatch(setSelectedStock({
      stock: position.stock,
      stockId: position.stock.id
    }));
  };

  // Handle watchlist item click
  const handleWatchlistClick = (watchlistItem: WatchlistItem) => {
    selectedStockDispatch(setSelectedStock({
      stock: watchlistItem.stock,
      stockId: watchlistItem.stock.id
    }));
  };

  // Helper function to scale chart points for mini charts
  const scaleChartPoints = (points: string, targetWidth: number = 60, targetHeight: number = 20): string => {
    try {
      const pointPairs = points.split(' ');
      const scaledPoints = pointPairs.map(point => {
        const [x, y] = point.split(',').map(Number);
        // Scale x to fit in targetWidth, scale y to fit in targetHeight
        const scaledX = (x / 360) * targetWidth; // Assuming original width ~360
        const scaledY = (y / 150) * targetHeight; // Assuming original height ~150
        return `${scaledX.toFixed(1)},${scaledY.toFixed(1)}`;
      });
      return scaledPoints.join(' ');
    } catch (error) {
      console.error('Error scaling chart points:', error);
      return "0,18 10,15 20,12 30,8 40,6 50,3"; // fallback
    }
  };


  // const positions = [
  //   { symbol: 'GOOGL', shares: '125 SHARES', price: '$1037.40', change: '+$1037.40', positive: true },
  //   { symbol: 'TSLA', shares: '100 SHARES', price: '$259.40', change: '', positive: false },
  //   { symbol: 'AMZN', shares: '50 SHARES', price: '$1443.65', change: '', positive: true },
  //   { symbol: 'QCOM', shares: '200 SHARES', price: '$55.30', change: '', positive: true },
  // ];

  // const watchlist = [
  //   { symbol: 'DIS', price: '$100.14', positive: true },
  //   { symbol: 'AAPL', shares: 'Watchlist', price: '$168.17', positive: false },
  //   { symbol: 'NFLX', price: '$296.00', positive: true },
  //   { symbol: 'NVDA', shares: 'Watchlist', price: '$232.12', positive: true },
  //   { symbol: 'FB', price: '$160.05', positive: true },
  // ];



  return (
    <div className="watchlist-container px-2">
      <div className="mb-3">
        <h6 className="watchlist-section-title">Positions</h6>
        <div>
          {positions.map((item, index) => (
            <div 
              key={index} 
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
                      {chartData[item.stock.symbol] ? (
                        <polyline
                          fill="none"
                          stroke="var(--chart-positive)"
                          strokeWidth="1.5"
                          points={chartData[item.stock.symbol].points}
                          vectorEffect="non-scaling-stroke"
                          transform="scale(0.6, 1)"
                        />
                      ) : (
                        <polyline
                          fill="none"
                          stroke="var(--chart-positive)"
                          strokeWidth="1.5"
                          points="0,18 10,15 20,12 30,8 40,6 50,3"
                        />
                      )}
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
          {watchlistItems.map((item, index) => (
            <div 
              key={index} 
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
                    <svg width="60" height="20" className="position-relative">
                      {chartData[item.stock.symbol] ? (
                        <polyline
                          fill="none"
                          stroke="var(--chart-positive)"
                          strokeWidth="1.5"
                          points={chartData[item.stock.symbol].points}
                          vectorEffect="non-scaling-stroke"
                          transform="scale(0.6, 1)"
                        />
                      ) : (
                        <polyline
                          fill="none"
                          stroke="var(--chart-positive)"
                          strokeWidth="1.5"
                          points="0,18 10,15 20,12 30,8 40,6 50,3"
                        />
                      )}
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

export default SideBlock;
