import React, { useEffect, useState } from 'react';

interface TradeHistoryItem {
  id: number;
  trade_type: 'BUY' | 'SELL';
  quantity: number;
  price_per_share: number;
  total_amount: number;
  trade_date: string;
  notes?: string;
  stock: {
    symbol: string;
    name: string;
  };
}

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<TradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTradeHistory();
  }, []);

  const fetchTradeHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/trade-history/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex align-items-center">
                <i className="bi bi-clock-history text-primary me-2 fs-5"></i>
                <h5 className="mb-0 text-primary fw-bold">Trade History</h5>
              </div>
              <p className="text-muted mb-0 mt-1">Complete record of your buy and sell transactions</p>
            </div>
            
            <div className="card-body p-0">
              {trades.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted fs-1 mb-3 d-block"></i>
                  <h6 className="text-muted">No trades found</h6>
                  <p className="text-muted small">Your trading history will appear here once you make your first trade.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 px-4 py-3">Date</th>
                        <th className="border-0 px-4 py-3">Stock</th>
                        <th className="border-0 px-4 py-3">Type</th>
                        <th className="border-0 px-4 py-3 text-end">Quantity</th>
                        <th className="border-0 px-4 py-3 text-end">Price</th>
                        <th className="border-0 px-4 py-3 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => (
                        <tr key={trade.id} className="border-bottom">
                          <td className="px-4 py-3">
                            <div className="text-dark fw-medium">
                              {formatDate(trade.trade_date)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="fw-bold text-dark">{trade.stock.symbol}</div>
                              <div className="text-muted small">{trade.stock.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge ${
                              trade.trade_type === 'BUY' 
                                ? 'bg-success bg-opacity-10 text-success' 
                                : 'bg-danger bg-opacity-10 text-danger'
                            } px-3 py-2`}>
                              {trade.trade_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="fw-medium">{trade.quantity}</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="fw-medium">{formatCurrency(trade.price_per_share)}</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className={`fw-bold ${
                              trade.trade_type === 'BUY' ? 'text-danger' : 'text-success'
                            }`}>
                              {trade.trade_type === 'BUY' ? '-' : '+'}{formatCurrency(trade.total_amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {trades.length > 0 && (
              <div className="card-footer bg-light border-top">
                <div className="row text-center">
                  <div className="col-3">
                    <div className="text-muted small">Total Trades</div>
                    <div className="fw-bold text-dark">{trades.length}</div>
                  </div>
                  <div className="col-3">
                    <div className="text-muted small">Total Bought</div>
                    <div className="fw-bold text-danger">
                      {formatCurrency(
                        trades
                          .filter(t => t.trade_type === 'BUY')
                          .reduce((sum, t) => sum + t.total_amount, 0)
                      )}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="text-muted small">Total Sold</div>
                    <div className="fw-bold text-success">
                      {formatCurrency(
                        trades
                          .filter(t => t.trade_type === 'SELL')
                          .reduce((sum, t) => sum + t.total_amount, 0)
                      )}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="text-muted small">Net Gain/Loss</div>
                    <div className={`fw-bold ${
                      (() => {
                        const totalBought = trades
                          .filter(t => t.trade_type === 'BUY')
                          .reduce((sum, t) => sum + t.total_amount, 0);
                        const totalSold = trades
                          .filter(t => t.trade_type === 'SELL')
                          .reduce((sum, t) => sum + t.total_amount, 0);
                        const netGainLoss = totalSold - totalBought;
                        return netGainLoss >= 0 ? 'text-success' : 'text-danger';
                      })()
                    }`}>
                      {(() => {
                        const totalBought = trades
                          .filter(t => t.trade_type === 'BUY')
                          .reduce((sum, t) => sum + t.total_amount, 0);
                        const totalSold = trades
                          .filter(t => t.trade_type === 'SELL')
                          .reduce((sum, t) => sum + t.total_amount, 0);
                        const netGainLoss = totalSold - totalBought;
                        return `${netGainLoss >= 0 ? '+' : ''}${formatCurrency(netGainLoss)}`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
