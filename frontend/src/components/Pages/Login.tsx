import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/hooks';
import { loginUser, signupUser } from '../../store/actions/authActions';
import { handleApiError } from '../../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });

  const { isLoading, error, dispatch } = useAuth();

  // Clear errors when component mounts or form switches
  useEffect(() => {
    // Clear error when switching between login/signup forms
  }, [showSignup]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Navigation will be handled by ProtectedRoute
    } catch (error) {
      // Error is handled by Redux state
      console.error('Login failed:', handleApiError(error));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      // You might want to add a local error state for this
      alert('Passwords do not match');
      return;
    }

    try {
      await dispatch(signupUser({
        email: signupData.email,
        username: signupData.username,
        full_name: signupData.full_name,
        password: signupData.password,
      })).unwrap();
      // After successful signup, switch to login form
      setShowSignup(false);
      alert('Account created successfully! Please log in.');
    } catch (error) {
      // Error is handled by Redux state
      console.error('Signup failed:', handleApiError(error));
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Logo Section */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-graph-up"></i>
            </div>
            <h1 className="login-title">Trading Dashboard</h1>
            <p className="login-subtitle">
              {showSignup ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Login Form */}
          {!showSignup ? (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="btn login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="login-form">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="signup-email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="signup-email"
                      className="form-control login-input"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control login-input"
                      value={signupData.username}
                      onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      placeholder="Choose a username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="full-name" className="form-label">
                  <i className="bi bi-person-badge me-2"></i>
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  className="form-control login-input"
                  value={signupData.full_name}
                  onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="signup-password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      id="signup-password"
                      className="form-control login-input"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Create a password"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="confirm-password" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="form-control login-input"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login and Signup */}
          <div className="login-footer">
            <p className="signup-text">
              {!showSignup ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="btn-link signup-link"
                    onClick={() => setShowSignup(true)}
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="btn-link signup-link"
                    onClick={() => setShowSignup(false)}
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;