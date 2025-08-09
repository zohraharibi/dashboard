import React, { useEffect, useState } from 'react';
import { useStocks, useSelectedStock } from '../store/hooks';
import { fetchStocks } from '../store/actions/stockActions';
import { setSelectedStock } from '../store/reducers/selectedStockReducer';

interface StockQuote {
  symbol: string;
  current_price: number;
  change: number;
  percent_change: number;
  direction: 'up' | 'down' | 'neutral';
}

const Topbar: React.FC = () => {
  const { stocks, dispatch } = useStocks();
  const { dispatch: selectedStockDispatch } = useSelectedStock();
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stocks from database first
  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  // Fetch quotes for database stocks
  useEffect(() => {
    if (stocks.length > 0) {
      fetchQuotesForStocks();
    }
  }, [stocks]);

  const fetchQuotesForStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Take first 6 stocks from database for topbar display
      const stocksToShow = stocks.slice(0, 6);

      const quotePromises = stocksToShow.map(async (stock) => {
        try {
          const response = await fetch(`http://localhost:8000/stocks/${stock.symbol}/quote`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            return { symbol: stock.symbol, ...data };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching quote for ${stock.symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(quotePromises);
      const validQuotes = results.filter((quote): quote is StockQuote => quote !== null);
      setQuotes(validQuotes);
    } catch (error) {
      console.error('Error fetching market quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}% (${sign}${change.toFixed(2)})`;
  };

  // Handle stock click - same pattern as SideBlock
  const handleStockClick = (stock: any) => {
    selectedStockDispatch(setSelectedStock({
      stock: stock,
      stockId: stock.id
    }));
  };

  // Show loading state if no stocks loaded yet
  if (stocks.length === 0) {
    return (
      <div className="px-4 topbar-main">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="text-center text-muted">
            <small>Loading stocks...</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 topbar-main">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100 align-items-center topbar-content">
          {stocks.slice(0, 6).map((stock, index) => {
            const quote = quotes.find(q => q.symbol === stock.symbol);
            
            return (
              <React.Fragment key={stock.symbol}>
                {index > 0 && <div className="topbar-separator"></div>}
                <div 
                  className="text-center"
                  onClick={() => handleStockClick(stock)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                    <small className="topbar-label">{stock.symbol}</small>
                    <span className="fw-bold topbar-value">
                      {quote ? formatPrice(quote.current_price) : '--'}
                    </span>
                  </div>
                  <small className={
                    quote?.direction === 'up' ? 'topbar-positive' : 
                    quote?.direction === 'down' ? 'topbar-negative' : 
                    'text-muted'
                  }>
                    {quote ? formatChange(quote.change, quote.percent_change) : (isLoading ? 'Loading...' : 'N/A')}
                  </small>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
