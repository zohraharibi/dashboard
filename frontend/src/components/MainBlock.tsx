import React, { useEffect, useState, useMemo } from 'react';
import { useSelectedStock, useStocks, usePositions, useWatchlist } from '../store/hooks';
import { getStockQuote, getStockProfile, getStockChart } from '../store/actions/stockActions';
import { buyShares, sellShares, fetchPositions } from '../store/actions/positionActions';
import { fetchWatchlistItems, addToWatchlist, removeFromWatchlist } from '../store/actions/watchlistActions';
import TradeModal from './TradeModal';

const MainBlock: React.FC = () => {
  const { selectedStock } = useSelectedStock();
  const { 
    currentQuote, 
    currentProfile, 
    currentChart, 
    isQuoteLoading, 
    isProfileLoading, 
    isChartLoading, 
    dispatch: stocksDispatch 
  } = useStocks();
  const { positions, dispatch: positionsDispatch } = usePositions();
  const { watchlistItems, dispatch: watchlistDispatch } = useWatchlist();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isTradeLoading, setIsTradeLoading] = useState(false);

  // Fetch watchlist data on component mount
  useEffect(() => {
    watchlistDispatch(fetchWatchlistItems());
  }, [watchlistDispatch]);

  // Use selected stock or first item from watchlist, otherwise show empty block
  const stock = selectedStock || (watchlistItems.length > 0 ? watchlistItems[0].stock : null);

  // Fetch Finnhub data when stock changes
  useEffect(() => {
    if (stock?.symbol) {
      stocksDispatch(getStockQuote(stock.symbol));
      stocksDispatch(getStockProfile(stock.symbol));
      stocksDispatch(getStockChart({ symbol: stock.symbol, timeframe: selectedTimeframe }));
    }
  }, [stock?.symbol, selectedTimeframe, stocksDispatch]);

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  // Find current position for the selected stock
  const currentPosition = useMemo(() => {
    return positions.find(pos => pos.stock.id === stock?.id);
  }, [positions, stock?.id]);

  // Find current watchlist item for the selected stock
  const currentWatchlistItem = useMemo(() => {
    return watchlistItems.find(item => item.stock.id === stock?.id);
  }, [watchlistItems, stock?.id]);

  // Determine if stock is in positions or watchlist
  const isInPositions = !!currentPosition;
  const isInWatchlist = !!currentWatchlistItem;

  // Handle buy button click
  const handleBuyClick = () => {
    setTradeType('buy');
    setShowTradeModal(true);
  };

  // Handle sell button click
  const handleSellClick = () => {
    if (!isInPositions) {
      alert('You cannot sell a stock you don\'t own!');
      return;
    }
    setTradeType('sell');
    setShowTradeModal(true);
  };

  // Handle trade confirmation
  const handleTradeConfirm = async (quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!stock) {
      return { success: false, message: 'No stock selected' };
    }

    try {
      setIsTradeLoading(true);

      if (tradeType === 'buy') {
        // Buy shares logic
        await positionsDispatch(buyShares({
          stockId: stock.id,
          quantity,
          purchasePrice: currentQuote?.current_price || 100
        })).unwrap();

        // If buying from watchlist, remove from watchlist
        if (isInWatchlist && currentWatchlistItem) {
          await watchlistDispatch(removeFromWatchlist(currentWatchlistItem.id));
        }

        // Refresh positions to get updated data
        await positionsDispatch(fetchPositions());

        return { 
          success: true, 
          message: `Successfully bought ${quantity} share${quantity !== 1 ? 's' : ''} of ${stock.symbol}!` 
        };
      } else {
        // Sell shares logic
        if (!currentPosition) {
          return { success: false, message: 'You don\'t own this stock!' };
        }

        if (quantity > currentPosition.quantity) {
          return { 
            success: false, 
            message: `You can only sell up to ${currentPosition.quantity} share${currentPosition.quantity !== 1 ? 's' : ''}!` 
          };
        }

        await positionsDispatch(sellShares({
          positionId: currentPosition.id,
          quantity
        })).unwrap();

        // If selling all shares, add to watchlist
        if (quantity === currentPosition.quantity) {
          await watchlistDispatch(addToWatchlist({
            stock_id: stock.id,
            notes: `Previously owned ${currentPosition.quantity} shares`
          }));
        }

        // Refresh positions to get updated quantities
        await positionsDispatch(fetchPositions());

        return { 
          success: true, 
          message: `Successfully sold ${quantity} share${quantity !== 1 ? 's' : ''} of ${stock.symbol}!` 
        };
      }
    } catch (error: any) {
      console.error('Trade failed:', error);
      return { 
        success: false, 
        message: `Trade failed: ${error.message || 'Unknown error'}` 
      };
    } finally {
      setIsTradeLoading(false);
    }
  };


  // If no stock available, show empty block
  if (!stock) {
    return (
      <div className="main-block-container">
        <div className="text-center text-muted py-5">
          <h5>No stocks available</h5>
          <p>Add stocks to your watchlist to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-block-container">
      <div className="row mb-2">
        <div className="col-8">
          <h2 className="main-block-portfolio-value text-xl">
            {isQuoteLoading ? 'Loading...' : currentQuote ? `$${currentQuote.current_price.toFixed(2)}` : '$1037.40'}
          </h2>
          <div className="main-block-performance">
            {isQuoteLoading ? (
              <span className="performance-today text-muted">Loading performance...</span>
            ) : currentQuote ? (
              <span className={`performance-today ${currentQuote.direction === 'up' ? 'text-success' : currentQuote.direction === 'down' ? 'text-danger' : 'text-muted'}`}>
                {currentQuote.change > 0 ? '+' : ''}{currentQuote.change.toFixed(2)} ({currentQuote.percent_change > 0 ? '+' : ''}{currentQuote.percent_change.toFixed(2)}%) Today
              </span>
            ) : (
              <span className="performance-today text-success">31.96 (+3.18%) Today</span>
            )}
          </div>
          <div className="main-block-after-hours">
            <i className="bi bi-arrow-up"></i>
            <span className="ms-1">0.26 (0.03%) After Hours</span>
          </div>
        </div>
        <div className="col-4">
          <div className="stock-info-container">
            <div className="stock-info mb-2">
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-name">
                {isProfileLoading ? 'Loading...' : currentProfile?.name || stock.name}
              </div>
            </div>
            <div className="indicators-and-actions">
              <div className="main-block-icons">
                <div>
                  <i className="bi bi-people-fill text-muted"></i>
                  <span className="ms-1 text-muted">25,100</span>
                </div>
                <div>
                  <i className="bi bi-bag-fill text-muted"></i>
                  <span className="ms-1 text-muted">86% BUY</span>
                </div>
              </div>
              <div className="main-block-actions">
                <button className="action-tab-btn active">NEWS</button>
                <button className="action-tab-btn">Stock Units</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Long horizontal separator */}
      <div className="main-block-bottom-separator"></div>

      {/* Chart - Fixed Small Height */}
      <div className="row mb-2">
        <div className="col">
          <div className="rounded p-2 main-block-chart-container">
            {isChartLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading chart...</span>
                </div>
              </div>
            ) : currentChart ? (
              <svg width="100%" height="160" className="main-block-chart-svg" viewBox={currentChart.viewBox}>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <polyline
                  fill="none"
                  stroke="#20c997"
                  strokeWidth="2"
                  points={currentChart.points}
                />
                {currentChart.points && (() => {
                  const points = currentChart.points.split(' ');
                  const lastPoint = points[points.length - 1];
                  if (lastPoint) {
                    const [x, y] = lastPoint.split(',');
                    return <circle cx={x} cy={y} r="2" fill="#20c997" />;
                  }
                  return null;
                })()}
              </svg>
            ) : null}
          </div>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <div className="chart-controls-container">
            <div className="chart-time-buttons">
              <button 
                type="button" 
                className={`chart-time-btn ${selectedTimeframe === '1D' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('1D')}
                disabled={isChartLoading}
              >
                1D
              </button>
              <button 
                type="button" 
                className={`chart-time-btn ${selectedTimeframe === '1W' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('1W')}
                disabled={isChartLoading}
              >
                1W
              </button>
              <button 
                type="button" 
                className={`chart-time-btn ${selectedTimeframe === '1Y' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('1Y')}
                disabled={isChartLoading}
              >
                1Y
              </button>
              <button 
                type="button" 
                className={`chart-time-btn ${selectedTimeframe === '5Y' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('5Y')}
                disabled={isChartLoading}
              >
                5Y
              </button>
              <button type="button" className="chart-time-btn" disabled>
                INTERACTIVE CHART
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-3"></div>
      
      {/* Stock Details Section */}
      <div className="row">
        <div className="col">
          <div className="main-block-stats-container">
            <div className="row">
              <div className="col-6">
                <div className="main-block-section-title">STATS</div>
                <table className="table table-sm main-block-stats-table">
                  <tbody>
                    <tr>
                      <td>Open</td>
                      <td className="text-end">{currentQuote?.current_price || '—'}</td>
                    </tr>
                    <tr>
                      <td>High</td>
                      <td className="text-end">{currentQuote?.current_price || '—'}</td>
                    </tr>
                    <tr>
                      <td>Low</td>
                      <td className="text-end">{currentQuote?.current_price || '—'}</td>
                    </tr>
                    <tr>
                      <td>Volume</td>
                      <td className="text-end">{'—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-6 stats-about-separator">
                <div className="main-block-section-title">ABOUT</div>
                <table className="table table-sm main-block-stats-table">
                  <tbody>
                    <tr>
                      <td>Market Cap</td>
                      <td className="text-end">{currentProfile?.name || '—'}</td>
                    </tr>
                    <tr>
                      <td>P/E Ratio</td>
                      <td className="text-end">{'—'}</td>
                    </tr>
                    <tr>
                      <td>52W High</td>
                      <td className="text-end">{'—'}</td>
                    </tr>
                    <tr>
                      <td>52W Low</td>
                      <td className="text-end">{'—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end gap-2">
            <button 
              className={`btn px-5 main-block-action-btn ${!isInPositions ? 'disabled' : ''}`}
              onClick={handleSellClick}
              disabled={!isInPositions}
              title={!isInPositions ? 'You must own this stock to sell it' : `Sell ${currentPosition?.quantity || 0} shares`}
            >
              SELL
            </button>
            <button 
              className="btn px-5 main-block-action-btn"
              onClick={handleBuyClick}
              title="Buy shares of this stock"
            >
              BUY
            </button>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && stock && (
        <TradeModal
          show={showTradeModal}
          onHide={() => setShowTradeModal(false)}
          onConfirm={handleTradeConfirm}
          tradeType={tradeType}
          stockSymbol={stock.symbol}
          currentPrice={100} // Use real price from stock quote
          isLoading={isTradeLoading}

        />
      )}
    </div>
  );
};

export default MainBlock;
