import React, { useState, useEffect } from 'react';
import type { ActiveView } from './Pages/Dashboard';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };
  return (
    <div className="d-flex flex-column sidebar-main">
      {/* Logo */}
      <div className="p-3 text-center">
        <div className="rounded-circle d-inline-flex align-items-center justify-content-center sidebar-logo">
          <i className="bi bi-graph-up text-white"></i>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 py-3">
        <ul className="nav nav-pills flex-column align-items-center">
          <li className="nav-item mb-3">
            <a href="#" className="nav-link sidebar-nav-active">
              <i className="bi bi-pie-chart fs-5"></i>
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="#" className="nav-link sidebar-nav-secondary">
              <i className="bi bi-clock-history fs-5"></i>
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-muted">
              <i className="bi bi-grid fs-5"></i>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Icons */}
      <div className="p-3">
        <div className="d-flex flex-column align-items-center">
          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn mb-3"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
          </button>
          <button 
            onClick={() => onViewChange(activeView === 'info' ? 'dashboard' : 'info')}
            className={`nav-link text-muted mb-3 ${activeView === 'info' ? 'sidebar-nav-active' : ''}`}
            style={{ background: 'none', border: 'none' }}
            title={activeView === 'info' ? 'Back to Dashboard' : 'View Trading Guide'}
          >
            <i className={`bi ${activeView === 'info' ? 'bi-arrow-left' : 'bi-question-circle'} fs-5`}></i>
          </button>
          <button 
            onClick={onLogout}
            className="nav-link text-muted mb-3"
            style={{ background: 'none', border: 'none' }}
            title="Logout"
          >
            <i className="bi bi-power fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
