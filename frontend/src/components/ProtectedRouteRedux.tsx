import React, { useEffect } from 'react';
import { useAuth } from '../store/hooks';
import { verifyToken } from '../store/actions/authActions';
import Login from './Pages/Login';

interface ProtectedRouteReduxProps {
  children: React.ReactNode;
}

const ProtectedRouteRedux: React.FC<ProtectedRouteReduxProps> = ({ children }) => {
  const { isAuthenticated, isLoading, token, dispatch } = useAuth();

  useEffect(() => {
    // If we have a token but aren't authenticated, verify it
    if (token && !isAuthenticated && !isLoading) {
      dispatch(verifyToken());
    }
  }, [token, isAuthenticated, isLoading, dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRouteRedux;
