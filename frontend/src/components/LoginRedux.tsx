import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/hooks';
import { loginUser, signupUser } from '../store/actions/authActions';
import { clearError } from '../store/reducers/authReducer';

interface LoginReduxProps {
  onLoginSuccess?: () => void;
}

const LoginRedux: React.FC<LoginReduxProps> = ({ onLoginSuccess }) => {
  const { isAuthenticated, isLoading, error, dispatch } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
  });

  // Clear error when switching between login/signup
  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }));
    } else {
      // Signup
      dispatch(signupUser({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
      }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      username: '',
      full_name: '',
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="login-subtitle">
            {isLogin 
              ? 'Sign in to your trading dashboard' 
              : 'Join our trading platform'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  className="form-control"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="btn btn-link login-switch-btn"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRedux;
