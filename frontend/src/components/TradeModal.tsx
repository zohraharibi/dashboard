import React, { useState } from 'react';

interface TradeModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (quantity: number) => void;
  tradeType: 'buy' | 'sell';
  stockSymbol: string;
  currentPrice: number;
  isLoading?: boolean;
}

const TradeModal: React.FC<TradeModalProps> = ({
  show,
  onHide,
  onConfirm,
  tradeType,
  stockSymbol,
  currentPrice,
  isLoading = false
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
      setError('');
    } else {
      setError('Quantity must be greater than 0');
    }
  };

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(quantity);
      setQuantity(1);
      setError('');
    } else {
      setError('Please enter a valid quantity');
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setError('');
    onHide();
  };

  const totalValue = quantity * currentPrice;

  if (!show) return null;

  return (
    <div className="trade-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="trade-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="trade-modal-header">
          <h5 className="trade-modal-title">
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {stockSymbol}
          </h5>
          <button className="trade-modal-close" onClick={handleClose}>×</button>
        </div>

        {/* Modal Body */}
        <div className="trade-modal-body">
          <div className="trade-info-section">
            <div className="d-flex justify-content-between mb-2">
              <span className="trade-label">Current Price:</span>
              <span className="trade-value">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="trade-label">Action:</span>
              <span className={`trade-action ${tradeType}`}>
                {tradeType.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="trade-quantity-section">
            <label className="trade-input-label">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isLoading}
              className={`trade-quantity-input ${error ? 'error' : ''}`}
            />
            {error && <div className="trade-error">{error}</div>}
          </div>

          <div className="trade-summary">
            <div className="d-flex justify-content-between mb-2">
              <span className="trade-label">Quantity:</span>
              <span className="trade-value">{quantity} shares</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="trade-label">Price per share:</span>
              <span className="trade-value">${currentPrice.toFixed(2)}</span>
            </div>
            <hr className="trade-divider" />
            <div className="d-flex justify-content-between trade-total">
              <span className="trade-label">Total {tradeType === 'buy' ? 'Cost' : 'Value'}:</span>
              <span className={`trade-total-value ${tradeType}`}>
                ${totalValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="trade-modal-footer">
          <button 
            className="btn trade-btn-cancel"
            onClick={handleClose} 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn trade-btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading || !!error || quantity <= 0}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${quantity} Share${quantity !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
