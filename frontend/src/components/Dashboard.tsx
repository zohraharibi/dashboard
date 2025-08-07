import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MainContent from './MainContent';

const Dashboard: React.FC = () => {
  return (
    <div className="container-fluid p-0 dashboard-container">
      <div className="row g-0 dashboard-row">
        <div className="col-auto">
          <Sidebar />
        </div>
        
        <div className="col dashboard-main-col">
          <Topbar />
          
          <div className="row g-0 dashboard-content-row">
              <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
