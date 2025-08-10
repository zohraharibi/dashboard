import React, { useEffect } from 'react';
import { useTradeHistory } from '../store/hooks';
import { fetchTradeHistory } from '../store/actions/tradeHistoryActions';

const TradeHistory: React.FC = () => {
  const { trades, isLoading, error, dispatch } = useTradeHistory();

  useEffect(() => {
    dispatch(fetchTradeHistory());
  }, [dispatch]);

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
                  <table className="table table-sm table-borderless main-block-stats-table mb-0">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-muted">Date</th>
                        <th className="px-4 py-2 text-muted">Stock</th>
                        <th className="px-4 py-2 text-muted">Type</th>
                        <th className="px-4 py-2 text-muted text-end">Quantity</th>
                        <th className="px-4 py-2 text-muted text-end">Price</th>
                        <th className="px-4 py-2 text-muted text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => (
                        <tr key={trade.id} className="border-bottom">
                          <td className="px-4 py-3">
                            <div className="text-secondary fw-medium">
                              {formatDate(trade.trade_date)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="fw-bold text-secondary">{trade.stock.symbol}</div>
                              <div className="text-muted small">{trade.stock.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`badge px-3 py-2 ${
                              trade.trade_type === 'BUY' 
                                ? 'trade-badge-buy' 
                                : 'trade-badge-sell'
                            }`}>
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
                              trade.trade_type === 'BUY' ? 'trade-amount-negative' : 'trade-amount-positive'
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
                    <div className="fw-bold trade-summary-value">{trades.length}</div>
                  </div>
                  <div className="col-3">
                    <div className="text-muted small">Total Bought</div>
                    <div className="fw-bold trade-amount-negative">
                      {formatCurrency(
                        trades
                          .filter(t => t.trade_type === 'BUY')
                          .reduce((sum, t) => sum + t.total_amount, 0)
                      )}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="text-muted small">Total Sold</div>
                    <div className="fw-bold trade-amount-positive">
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
                        return netGainLoss >= 0 ? 'trade-amount-positive' : 'trade-amount-negative';
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
