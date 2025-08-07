import React from 'react';

const Topbar: React.FC = () => {
  return (
    <div className="px-4 topbar-main">
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100 align-items-center topbar-content">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">S&P 500</small>
              <span className="fw-bold topbar-value">$2,640.87</span>
            </div>
            <small className="topbar-positive">1.38% (35.67)</small>
          </div>
          <div className="topbar-separator"></div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">DOW</small>
              <span className="fw-bold topbar-value">$24,103.10</span>
            </div>
            <small className="topbar-positive">1.67% (254.70)</small>
          </div>
          <div className="topbar-separator"></div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">NASDAQ</small>
              <span className="fw-bold topbar-value">$7,063.40</span>
            </div>
            <small className="topbar-positive">1.64% (114.20)</small>
          </div>
          <div className="topbar-separator"></div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">FUTURES</small>
              <span className="fw-bold topbar-value">$1.23</span>
            </div>
            <small className="topbar-negative">-0.17% (-0.002)</small>
          </div>
          <div className="topbar-separator"></div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">CRUDE OIL</small>
              <span className="fw-bold topbar-value">$64.90</span>
            </div>
            <small className="topbar-positive">6.45% (0.29)</small>
          </div>
          <div className="topbar-separator"></div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small className="topbar-label">VIX</small>
              <span className="fw-bold topbar-value">$30.17</span>
            </div>
            <small className="topbar-negative">-12.66% (-2.9)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
