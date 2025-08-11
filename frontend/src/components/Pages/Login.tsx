import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/hooks';
import { loginUser, signupUser } from '../../store/actions/authActions';
import { handleApiError } from '../../services/api';
import { toast } from 'react-toastify';

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
  const [signupError, setSignupError] = useState<string>('');

  const { isLoading, error, dispatch } = useAuth();

  // Clear errors when component mounts or form switches
  useEffect(() => {
    // Clear signup error when switching between login/signup forms
    setSignupError('');
  }, [showSignup]);

  // Validation functions
  const validateEmail = (email: string): string => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return 'Email is required';
    if (!emailPattern.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (username.length > 50) return 'Username must be less than 50 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateFullName = (fullName: string): string => {
    if (!fullName) return 'Full name is required';
    if (fullName.length > 100) return 'Full name must be less than 100 characters';
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };



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

    // Validate all fields and show first error found
    const emailError = validateEmail(signupData.email);
    if (emailError) {
      setSignupError(emailError);
      return;
    }
    
    const usernameError = validateUsername(signupData.username);
    if (usernameError) {
      setSignupError(usernameError);
      return;
    }
    
    const fullNameError = validateFullName(signupData.full_name);
    if (fullNameError) {
      setSignupError(fullNameError);
      return;
    }
    
    const passwordError = validatePassword(signupData.password);
    if (passwordError) {
      setSignupError(passwordError);
      return;
    }
    
    const confirmPasswordError = validateConfirmPassword(signupData.password, signupData.confirmPassword);
    if (confirmPasswordError) {
      setSignupError(confirmPasswordError);
      return;
    }

    // Clear signup error if all fields are valid
    setSignupError('');

    try {
      await dispatch(signupUser({
        email: signupData.email,
        username: signupData.username,
        full_name: signupData.full_name,
        password: signupData.password,
      })).unwrap();
      // After successful signup, switch to login form
      setShowSignup(false);
      toast.success('Account created successfully! Please log in.', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
          {(error || signupError) && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error || signupError}
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
                      minLength={8}
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
                      minLength={8}
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