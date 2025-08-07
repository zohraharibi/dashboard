import React, { useState, useEffect } from 'react';

const Sidebar: React.FC = () => {
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
    <div className="d-flex flex-column" style={{ width: '80px', height: '100vh', backgroundColor: 'var(--bg-sidebar)' }}>
      {/* Logo */}
      <div className="p-3 text-center">
        <div className="rounded-circle d-inline-flex align-items-center justify-content-center" 
             style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-green)' }}>
          <i className="bi bi-graph-up text-white"></i>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 py-3">
        <ul className="nav nav-pills flex-column align-items-center">
          <li className="nav-item mb-3">
            <a href="#" className="nav-link" style={{ color: 'var(--primary-green)' }}>
              <i className="bi bi-pie-chart fs-5"></i>
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="#" className="nav-link" style={{ color: 'var(--text-secondary)' }}>
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
          <a href="#" className="nav-link text-muted mb-3">
            <i className="bi bi-question-circle fs-5"></i>
          </a>
          <a href="#" className="nav-link text-muted">
            <i className="bi bi-power fs-5"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
