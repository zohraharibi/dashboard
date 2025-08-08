import React, { useEffect } from 'react';
import { usePositions, useWatchlist } from '../store/hooks';
import { fetchPositions } from '../store/actions/positionActions';
import { fetchWatchlistItems } from '../store/actions/watchlistActions';


const SideBlock: React.FC = () => {

  const { positions, dispatch: positionsDispatch } = usePositions();
  const { watchlistItems, dispatch: watchlistDispatch } = useWatchlist();

  // Fetch data on component mount
  useEffect(() => {
    positionsDispatch(fetchPositions());
    watchlistDispatch(fetchWatchlistItems());
  }, [positionsDispatch, watchlistDispatch]);


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
            <div key={index} className="watchlist-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="watchlist-item-left d-flex flex-column">
                  <div className="watchlist-item-symbol">{item.stock.symbol}</div>
                  <small className="watchlist-item-label">{item.quantity} SHARES</small>
                </div>
                {/* <div className="watchlist-item-center d-flex align-items-center">
                  <div className="watchlist-chart">
                    <svg width="100%" height="20" className="position-absolute">
                      <polyline
                        fill="none"
                        stroke={ "var(--chart-positive)"}
                        strokeWidth="1.5"
                        points={"0,18 20,15 40,12 60,8 80,6 100,3"}
                      />
                    </svg>
                  </div>
                </div> */}
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
            <div key={index} className="watchlist-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="watchlist-item-left d-flex flex-column">
                  <div className="watchlist-item-symbol">{item.stock.symbol}</div>
                  <small className="watchlist-item-label">Watchlist</small>
                </div>
                {/* <div className="watchlist-item-center d-flex align-items-center">
                  <div className="watchlist-chart">
                    <svg width="100%" height="20" className="position-absolute">
                      <polyline
                        fill="none"
                        stroke={item.positive ? "var(--chart-positive)" : "var(--chart-negative)"}
                        strokeWidth="1.5"
                        points={item.positive ? "0,18 20,15 40,12 60,8 80,6 100,3" : "0,3 20,6 40,9 60,12 80,15 100,18"}
                      />
                    </svg>
                  </div>
                </div> */}
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
