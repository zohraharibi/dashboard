import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import MainContent from '../MainContent';

export type ActiveView = 'dashboard' | 'info' | 'trade-history';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      </div>
      
      <div className="dashboard-topbar">
        <Topbar />
      </div>
      
      <div className="dashboard-content">
        <MainContent activeView={activeView} />
      </div>
    </div>
  );
};

export default Dashboard;
