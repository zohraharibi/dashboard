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
      <div className="row g-0 h-100">
        <div className="col-md-8 col-lg-9">
          <MainBlock />
        </div>
        <div className="col-md-4 col-lg-3 ps-2">
          <SideBlock />
        </div>
      </div>
    ) : activeView === 'trade-history' ? (
      <TradeHistory />
    ) : (
      <Info />
    )}
    </>
  );
};

export default MainContent;
