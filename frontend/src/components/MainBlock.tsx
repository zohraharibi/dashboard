import React, { useEffect, useState } from 'react';
import StockDetails from './StockDetails';
import { useSelectedStock, useWatchlist, useStocks } from '../store/hooks';
import { fetchWatchlistItems } from '../store/actions/watchlistActions';
import { getStockQuote, getStockProfile, getStockChart } from '../store/actions/stockActions';

const MainBlock: React.FC = () => {
  const { selectedStock } = useSelectedStock();
  const { watchlistItems, dispatch: watchlistDispatch } = useWatchlist();
  const { 
    currentQuote, 
    currentProfile, 
    currentChart, 
    isQuoteLoading, 
    isProfileLoading, 
    isChartLoading, 
    dispatch: stocksDispatch 
  } = useStocks();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');

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
    console.log('Timeframe changed to:', timeframe, 'for stock:', stock?.symbol);
    setSelectedTimeframe(timeframe);
    if (stock?.symbol) {
      stocksDispatch(getStockChart({ symbol: stock.symbol, timeframe }));
    }
  };
  console.log("here", currentChart?.points)


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
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="30" height="15" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <polyline
                  fill="none"
                  stroke="#20c997"
                  strokeWidth="2"
                  points={currentChart.points}
                />
                
                {/* Data points - show last point */}
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
      
      <StockDetails 
        stock={stock} 
        quote={currentQuote} 
        profile={currentProfile}
        isQuoteLoading={isQuoteLoading} 
        isProfileLoading={isProfileLoading}
      />

      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end gap-2">
            <button className="btn px-5 main-block-action-btn">SELL</button>
            <button className="btn px-5 main-block-action-btn">BUY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBlock;
