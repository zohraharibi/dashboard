import React, { useEffect, useState, useMemo } from 'react';
import { useSelectedStock, useStocks, usePositions, useWatchlist } from '../store/hooks';
import { getStockQuote, getStockProfile, getStockChart } from '../store/actions/stockActions';
import { buyShares, sellShares, fetchPositions } from '../store/actions/positionActions';
import { fetchWatchlistItems, addToWatchlist, removeFromWatchlist } from '../store/actions/watchlistActions';
import TradeModal from './TradeModal';
import { toast } from 'react-toastify';
import { LineChart } from '@mui/x-charts/LineChart';
import { formatCurrency } from '../utils/helpers/formatters';

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

  // Fetch quote and profile data only when stock changes
  useEffect(() => {
    if (stock?.symbol) {
      stocksDispatch(getStockQuote(stock.symbol));
      stocksDispatch(getStockProfile(stock.symbol));
    }
  }, [stock?.symbol, stocksDispatch]);

  // Fetch chart data when stock OR timeframe changes
  useEffect(() => {
    if (stock?.symbol) {
      stocksDispatch(getStockChart({ symbol: stock.symbol, timeframe: selectedTimeframe }));
    }
  }, [stock?.symbol, selectedTimeframe, stocksDispatch]);

  // Find current position and watchlist item
  const currentPosition = useMemo(() => {
    return positions.find(pos => pos.stock.id === stock?.id);
  }, [positions, stock?.id]);

  const currentWatchlistItem = useMemo(() => {
    return watchlistItems.find(item => item.stock.id === stock?.id);
  }, [watchlistItems, stock?.id]);

  const isInPositions = !!currentPosition;
  const isInWatchlist = !!currentWatchlistItem;
  const isFromTopbar = selectedStock && !isInPositions && !isInWatchlist;

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  // Handle buy button click
  const handleBuyClick = () => {
    setTradeType('buy');
    setShowTradeModal(true);
  };

  // Handle sell button click
  const handleSellClick = () => {
    if (!isInPositions) {
      toast.warning('You cannot sell a stock you don\'t own!');
      return;
    }
    setTradeType('sell');
    setShowTradeModal(true);
  };

  // Handle watchlist toggle for topbar stocks
  const handleWatchlistToggle = async () => {
    if (!stock) return;

    try {
      if (isInWatchlist && currentWatchlistItem) {
        await watchlistDispatch(removeFromWatchlist(currentWatchlistItem.id));
        toast.success(`${stock.symbol} removed from watchlist!`);
      } else {
        await watchlistDispatch(addToWatchlist({
          stock_id: stock.id,
          notes: `Added ${stock.symbol} to watchlist`
        }));
        toast.success(`${stock.symbol} added to watchlist!`);
      }
      await watchlistDispatch(fetchWatchlistItems());
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      toast.error('Failed to update watchlist. Please try again.');
    }
  };

  // Handle trade confirmation
  const handleTradeConfirm = async (quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!stock) {
      return { success: false, message: 'No stock selected' };
    }

    try {
      setIsTradeLoading(true);

      if (tradeType === 'buy') {
        await positionsDispatch(buyShares({
          stockId: stock.id,
          quantity,
          purchasePrice: currentQuote?.current_price || 100
        })).unwrap();

        if (isInWatchlist && currentWatchlistItem) {
          await watchlistDispatch(removeFromWatchlist(currentWatchlistItem.id));
        }

        await positionsDispatch(fetchPositions());
        return { 
          success: true, 
          message: `Successfully bought ${quantity} share${quantity !== 1 ? 's' : ''} of ${stock.symbol}!` 
        };
      } else {
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

        if (quantity === currentPosition.quantity) {
          await watchlistDispatch(addToWatchlist({
            stock_id: stock.id,
            notes: `Added ${stock.symbol} to watchlist after selling all shares`
          }));
        }

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
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center text-muted">
            <h5>Select a stock to view details</h5>
            <p>Choose a stock from your positions or watchlist to see detailed information and trading options.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-block-container">
      {/* Header Section */}
      <div className="row mb-2">
        <div className="col-8">
          <h2 className="main-block-portfolio-value text-xl">
            {isQuoteLoading ? 'Loading...' : currentQuote ? formatCurrency(currentQuote.current_price, stock?.currency || 'USD') : '$1037.40'}
          </h2>
          <div className="main-block-performance">
            {isQuoteLoading ? (
              <span className="performance-today text-muted">Loading performance...</span>
            ) : currentQuote ? (
              <span className={`performance-today ${currentQuote.direction === 'up' ? 'text-success' : currentQuote.direction === 'down' ? 'text-danger' : 'text-muted'}`}>
                {currentQuote.change > 0 ? '+' : ''}{formatCurrency(Math.abs(currentQuote.change), stock?.currency || 'USD').replace(/^./, '')} ({currentQuote.percent_change > 0 ? '+' : ''}{currentQuote.percent_change.toFixed(2)}%) Today
              </span>
            ) : (
              <span className="performance-today text-success">31.96 (+3.18%) Today</span>
            )}
          </div>
          <div className="main-block-after-hours">
            <i className="bi bi-arrow-up"></i>
            <span className="ms-1">0.26 (0.03%) After Hours</span>
          </div>
          <div className="main-block-actions">
            <button className="action-tab-btn active">NEWS</button>
            <button className="action-tab-btn">Stock Units</button>
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Long horizontal separator */}
      <div className="main-block-bottom-separator"></div>

      {/* Chart Section */}
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
                <LineChart
                  width={800}
                  height={200}
                  series={[
                    {
                      data: currentChart.y_values,
                      color: 'var(--primary-green)',
                      showMark: false,
                      curve: 'linear'
                    }
                  ]}
                  xAxis={[{ 
                    disableLine: true, 
                    disableTicks: true,
                    tickLabelStyle: { display: 'none' },
                    data: currentChart.y_values.map((_, index) => index)
                  }]}
                  yAxis={[{ 
                    disableLine: true, 
                    disableTicks: true,
                    tickLabelStyle: { display: 'none' }
                  }]}
                />
            ) : null}
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="row mb-3">
        <div className="col">
          <div className="chart-controls-container">
            <div className="chart-time-buttons">
              {['1D', '1W', '1Y', '5Y', 'INTERACTIVE CHART'].map((timeframe) => (
                <button
                  key={timeframe}
                  className={`chart-time-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                  onClick={() => handleTimeframeChange(timeframe)}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal separator */}
      <div className="main-block-horizontal-separator"></div>

      {/* Stats Section */}
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
                      <td className="text-end">{isQuoteLoading ? 'Loading...' : (currentQuote?.open_price ? formatCurrency(currentQuote.open_price, stock?.currency || 'USD') : '—')}</td>
                    </tr>
                    <tr>
                      <td>High</td>
                      <td className="text-end">{isQuoteLoading ? 'Loading...' : (currentQuote?.high_price ? formatCurrency(currentQuote.high_price, stock?.currency || 'USD') : '—')}</td>
                    </tr>
                    <tr>
                      <td>Low</td>
                      <td className="text-end">{isQuoteLoading ? 'Loading...' : (currentQuote?.low_price ? formatCurrency(currentQuote.low_price, stock?.currency || 'USD') : '—')}</td>
                    </tr>
                    <tr>
                      <td>Volume</td>
                      <td className="text-end">—</td>
                    </tr>
                    <tr>
                      <td>Avg Volume</td>
                      <td className="text-end">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-6 stats-about-separator">
                <div className="main-block-section-title">ABOUT</div>
                {stock?.description}
                <table className="table table-sm main-block-stats-table">
                  <tbody>
                    <tr>
                      <td>52 Wk High</td>
                      <td className="text-end">—</td>
                    </tr>
                    <tr>
                      <td>52 Wk Low</td>
                      <td className="text-end">—</td>
                    </tr>
                    <tr>
                      <td>Dividend</td>
                      <td className="text-end">—</td>
                    </tr>
                    <tr>
                      <td>Mkt Cap</td>
                      <td className="text-end">{isProfileLoading ? 'Loading...' : (currentProfile?.marketCapitalization ? `$${(currentProfile.marketCapitalization / 1000000000).toFixed(2)}B` : '—')}</td>
                    </tr>
                    <tr>
                      <td>P/E Ratio</td>
                      <td className="text-end">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end gap-2">
            {isFromTopbar || isInWatchlist ? (
              // Show watchlist toggle button for topbar stocks OR watchlist items
              <>
                <button 
                  className="btn px-5 main-block-action-btn d-flex align-items-center gap-2"
                  onClick={handleWatchlistToggle}
                >
                  <span style={{ fontSize: '1.2em' }}>
                    {isInWatchlist ? '❤️' : '🤍'}
                  </span>
                  {isInWatchlist ? 'REMOVE FROM WATCHLIST' : 'ADD TO WATCHLIST'}
                </button>
                {isInWatchlist && (
                  // Show BUY button for watchlist items
                  <button 
                    className="btn px-5 main-block-action-btn"
                    onClick={handleBuyClick}
                  >
                    BUY
                  </button>
                )}
              </>
            ) : (
              // Show traditional buy/sell buttons for stocks from positions only
              <>
                <button 
                  className={`btn px-5 main-block-action-btn ${!isInPositions ? 'disabled' : ''}`}
                  onClick={handleSellClick}
                  disabled={!isInPositions}
                >
                  SELL
                </button>
                <button 
                  className="btn px-5 main-block-action-btn"
                  onClick={handleBuyClick}
                >
                  BUY
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <TradeModal
        show={showTradeModal}
        onHide={() => setShowTradeModal(false)}
        onConfirm={handleTradeConfirm}
        tradeType={tradeType}
        stockSymbol={stock.symbol}
        currentPrice={currentQuote?.current_price || 0}
        isLoading={isTradeLoading}
      />
    </div>
  );
};

export default MainBlock;
