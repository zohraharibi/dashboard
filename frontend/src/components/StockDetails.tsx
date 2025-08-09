import React from 'react';
import type { Stock, StockQuote, StockProfile } from '../store/types/stockTypes';

interface StockDetailsProps {
  stock: Stock;
  quote?: StockQuote | null;
  profile?: StockProfile | null;
  isQuoteLoading?: boolean;
  isProfileLoading?: boolean;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stock, quote, profile, isQuoteLoading, isProfileLoading }) => {
  return (
    <div>
      <div className="row mb-2">
        <div className="col-6">
          <h6 className="main-block-section-title">Stats</h6>
          <table className="table table-sm table-borderless main-block-stats-table">
            <tbody>
              <tr>
                <td className="text-muted ps-0">OPEN</td>
                <td className="text-end pe-0">
                  {isQuoteLoading ? 'Loading...' : quote ? `$${quote.open_price.toFixed(2)}` : '1010.55'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">HIGH</td>
                <td className="text-end pe-0">
                  {isQuoteLoading ? 'Loading...' : quote ? `$${quote.high_price.toFixed(2)}` : '1048.00'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">LOW</td>
                <td className="text-end pe-0">
                  {isQuoteLoading ? 'Loading...' : quote ? `$${quote.low_price.toFixed(2)}` : '1004.04'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">VOLUME</td>
                <td className="text-end pe-0">
                  {isQuoteLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">AVG VOLUME</td>
                <td className="text-end pe-0">
                  {isQuoteLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-6 stats-about-separator">
          <h6 className="main-block-section-title">About</h6>
          <div className="text-muted mb-1 main-block-about-text">
            <p className="mb-1">
              {stock.description ? stock.description : 'No description available.'}
            </p>
          </div>
          <table className="table table-sm table-borderless main-block-stats-table">
            <tbody>
              <tr>
                <td className="text-muted ps-0">52 WK HIGH</td>
                <td className="text-end pe-0">
                  {isProfileLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">52 WK LOW</td>
                <td className="text-end pe-0">
                  {isProfileLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">DIVIDEND</td>
                <td className="text-end pe-0">
                  {isProfileLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">MKT CAP</td>
                <td className="text-end pe-0">
                  {isProfileLoading ? 'Loading...' : profile ? 
                    `${(profile.marketCapitalization / 1000).toFixed(2)}B` : '720.59B'}
                </td>
              </tr>
              <tr>
                <td className="text-muted ps-0">P/E RATIO</td>
                <td className="text-end pe-0">
                  {isProfileLoading ? 'Loading...' : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
