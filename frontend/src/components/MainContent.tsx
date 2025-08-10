import React from 'react';
import MainBlock from './MainBlock';
import SideBlock from './SideBlock';
import Info from './Pages/Info';
import TradeHistory from './TradeHistory';
import type { ActiveView } from './Pages/Dashboard';

interface MainContentProps {
  activeView: ActiveView;
}

const MainContent: React.FC<MainContentProps> = ({ activeView }) => {
  return (
    <>
    {activeView === 'dashboard' ? (
      <div className="main-content-grid">
        <div className="main-content-primary">
          <MainBlock />
        </div>
        <div className="main-content-secondary">
          <SideBlock />
        </div>
      </div>
    ) : activeView === 'trade-history' ? (
      <div className="main-content-full">
        <TradeHistory />
      </div>
    ) : (
      <div className="main-content-full">
        <Info />
      </div>
    )}
    </>
  );
};

export default MainContent;
