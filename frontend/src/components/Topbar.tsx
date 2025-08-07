import React from 'react';

const Topbar: React.FC = () => {
  return (
    <div className="px-4" style={{ height: '70px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="d-flex justify-content-between w-100 align-items-center" style={{ gap: '1.5rem' }}>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>S&P 500</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$2,640.87</span>
            </div>
            <small style={{ color: 'var(--success)' }}>1.38% (35.67)</small>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>DOW</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$24,103.10</span>
            </div>
            <small style={{ color: 'var(--success)' }}>1.67% (254.70)</small>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>NASDAQ</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$7,063.40</span>
            </div>
            <small style={{ color: 'var(--success)' }}>1.64% (114.20)</small>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>FUTURES</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$1.23</span>
            </div>
            <small style={{ color: 'var(--danger)' }}>-0.17% (-0.002)</small>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>CRUDE OIL</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$64.90</span>
            </div>
            <small style={{ color: 'var(--success)' }}>6.45% (0.29)</small>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <small style={{ color: 'var(--text-secondary)' }}>VIX</small>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>$30.17</span>
            </div>
            <small style={{ color: 'var(--danger)' }}>-12.66% (-2.9)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
