import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import MainContent from '../MainContent';

export type ActiveView = 'dashboard' | 'info';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  return (
    <div className="container-fluid p-0 dashboard-container">
      <div className="row g-0 dashboard-row">
        <div className="col-auto">
          <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        </div>
        
        <div className="col dashboard-main-col">
          <Topbar />
          <div className="row g-0 dashboard-content-row">
            <MainContent activeView={activeView} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
