import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import MainContent from '../MainContent';
import Login from './Login';

export type ActiveView = 'dashboard' | 'info' | 'login';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set to false to show login first

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('login');
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container-fluid p-0 dashboard-container">
      <div className="row g-0 dashboard-row">
        <div className="col-auto">
          <Sidebar activeView={activeView} onViewChange={handleViewChange} onLogout={handleLogout} />
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
