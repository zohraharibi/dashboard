import React from 'react';

const Info: React.FC = () => {
  return (
    <div className="info-container w-100">
      <div className="info-header">
        <h1 className="info-title">Trading Concepts Guide</h1>
        <p className="info-subtitle">Understanding key concepts in stock trading and portfolio management</p>
      </div>

      <div className="info-content">
        {/* Share / Stock */}
        <div className="info-section">
          <h2 className="info-section-title"> 1. Share / Stock</h2>
          <p className="info-text">
            A share (or stock) is a unit of ownership in a company.
          </p>
          <p className="info-example">
            If you own a share of GOOGL, you're a part-owner of Alphabet Inc.
          </p>
        </div>

        {/* Stock Price */}
        <div className="info-section">
          <h2 className="info-section-title"> 2. Stock Price</h2>
          <p className="info-text">
            The stock price is how much one share currently costs.
          </p>
          <p className="info-example">
            It changes in real-time based on market demand/supply.
          </p>
        </div>

        {/* Portfolio */}
        <div className="info-section">
          <h2 className="info-section-title"> 3. Portfolio</h2>
          <p className="info-text">
            A portfolio is the collection of all the stocks a user owns.
          </p>
          <p className="info-example">
            Example: "I have GOOGL, AMZN, and AAPL in my portfolio."
          </p>
        </div>

        {/* Position */}
        <div className="info-section">
          <h2 className="info-section-title"> 4. Position</h2>
          <p className="info-text">
            A position = how many shares you own and at what price.
          </p>
          <p className="info-example">
            Example: "I hold 10 shares of AMZN bought at $1,200 each."
          </p>
        </div>

        {/* Watchlist */}
        <div className="info-section">
          <h2 className="info-section-title"> 5. Watchlist</h2>
          <p className="info-text">
            A list of stocks the user is monitoring but doesn't own.
          </p>
          <p className="info-example">
            Helps users track stock performance before investing.
          </p>
        </div>

        {/* Gain / Loss */}
        <div className="info-section">
          <h2 className="info-section-title"> 6. Gain / Loss (Performance)</h2>
          <p className="info-text">
            Compares the current stock price vs. the buy price.
          </p>
          <div className="info-formula">
            <strong>Formula:</strong><br />
            Gain (%) = ((current price - buy price) / buy price) × 100
          </div>
        </div>

        {/* Daily Change */}
        <div className="info-section">
          <h2 className="info-section-title"> 7. Daily Change / Today's Change</h2>
          <p className="info-text">
            How much the stock price has changed since yesterday's close.
          </p>
          <p className="info-example">
            Often displayed in green/red:<br />
            <span className="text-success">Green = stock is up</span><br />
            <span className="text-danger">Red = stock is down</span>
          </p>
        </div>

        {/* After Hours Trading */}
        <div className="info-section">
          <h2 className="info-section-title"> 8. After Hours Trading</h2>
          <p className="info-text">
            Some platforms allow trading outside regular market hours.
          </p>
          <p className="info-example">
            "After Hours" price change is shown separately.
          </p>
        </div>

        {/* Key Stock Metrics */}
        <div className="info-section">
          <h2 className="info-section-title"> 9. Key Stock Metrics</h2>
          <p className="info-text">
            These help users evaluate the stock:
          </p>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Open</strong></td>
                  <td>Price at the start of the day</td>
                </tr>
                <tr>
                  <td><strong>High / Low</strong></td>
                  <td>Highest and lowest prices of the day</td>
                </tr>
                <tr>
                  <td><strong>52 Week High/Low</strong></td>
                  <td>Highest and lowest price in the last year</td>
                </tr>
                <tr>
                  <td><strong>Volume</strong></td>
                  <td>How many shares were traded today</td>
                </tr>
                <tr>
                  <td><strong>Market Cap</strong></td>
                  <td>Total company value = price × total shares</td>
                </tr>
                <tr>
                  <td><strong>P/E Ratio</strong></td>
                  <td>Price-to-Earnings ratio (valuation metric)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="info-section">
          <h2 className="info-section-title"> 10. Buy / Sell</h2>
          <p className="info-text">
            Users can buy stocks (add position) or sell them (remove/reduce position).
          </p>
        </div>

        <div className="info-section">
          <h2 className="info-section-title"> 11. Order Types (Optional)</h2>
          <p className="info-text">
            If you want to go further:
          </p>
          <ul className="info-list">
            <li><strong>Market Order:</strong> Buy/Sell immediately at current price.</li>
            <li><strong>Limit Order:</strong> Buy/Sell only if price hits a target.</li>
          </ul>
        </div>

        <div className="info-section">
          <h2 className="info-section-title"> Example</h2>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>UI Section</th>
                  <th>Trading Concept</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>$1037.40</strong></td>
                  <td>Current price of selected stock (e.g., GOOGL)</td>
                </tr>
                <tr>
                  <td><strong>(+3.18%) Today</strong></td>
                  <td>Daily price change / performance</td>
                </tr>
                <tr>
                  <td><strong>After Hours</strong></td>
                  <td>Price movement after market close</td>
                </tr>
                <tr>
                  <td><strong>Positions</strong></td>
                  <td>Stocks user owns (with shares + buy price)</td>
                </tr>
                <tr>
                  <td><strong>Watchlist</strong></td>
                  <td>Stocks user is tracking (but doesn't own)</td>
                </tr>
                <tr>
                  <td><strong>Stats section</strong></td>
                  <td>Financial data like P/E, Volume, High/Low</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="info-section info-summary">
          <h2 className="info-section-title">✅ Summary of Key Concepts</h2>
          <div className="info-table-container">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Concept</th>
                  <th>You Should Understand...</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Shares</strong></td>
                  <td>What they are and how users own them</td>
                </tr>
                <tr>
                  <td><strong>Portfolio</strong></td>
                  <td>What a user owns</td>
                </tr>
                <tr>
                  <td><strong>Watchlist</strong></td>
                  <td>What a user is following</td>
                </tr>
                <tr>
                  <td><strong>Stock price</strong></td>
                  <td>How it changes, daily/52-week/etc.</td>
                </tr>
                <tr>
                  <td><strong>Buy/Sell actions</strong></td>
                  <td>How users simulate trades</td>
                </tr>
                <tr>
                  <td><strong>Metrics</strong></td>
                  <td>Open, High, Low, Volume, P/E, Market Cap</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
