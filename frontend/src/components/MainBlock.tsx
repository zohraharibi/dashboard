import React from 'react';
import StockDetails from './StockDetails';

const MainBlock: React.FC = () => {
  return (
    <div className="main-block-container">
      <div className="row mb-2">
        <div className="col-6">
          <h2 className="main-block-portfolio-value text-xl">$1037.40</h2>
          <div className="main-block-after-hours">
            <i className="bi bi-arrow-up"></i>
            <span className="ms-1">0.26 (0.03%) After Hours</span>
          </div>
        </div>
        <div className="col-6 text-end">
          <div className="d-flex justify-content-end align-items-center gap-3 main-block-icons">
            <div>
              <i className="bi bi-people-fill text-muted"></i>
              <span className="ms-1 text-muted">25,100</span>
            </div>
            <div>
              <i className="bi bi-bag-fill text-muted "></i>
              <span className="ms-1 text-muted">BUY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart - Fixed Small Height */}
      <div className="row mb-2">
        <div className="col">
          <div className="rounded p-2 main-block-chart-container">
            <svg width="100%" height="160" className="main-block-chart-svg">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="30" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Main chart line */}
              <polyline
                fill="none"
                stroke="#20c997"
                strokeWidth="2"
                points="20,130 60,120 100,110 140,100 180,90 220,80 260,70 300,65 340,60 380,55 420,50 460,45 500,40 540,35 580,30"
              />
              
              {/* Data points */}
              <circle cx="580" cy="30" r="2" fill="#20c997" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Controls - Very Compact */}
      <div className="row mb-2">
        <div className="col">
          <div className="chart-controls-container">
            <div className="chart-time-buttons">
              <button type="button" className="chart-time-btn">1D</button>
              <button type="button" className="chart-time-btn">1W</button>
              <button type="button" className="chart-time-btn active">1Y</button>
              <button type="button" className="chart-time-btn">5Y</button>
              <button type="button" className="chart-time-btn">INTERACTIVE CHART</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-3"></div>
      
      <StockDetails />

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
