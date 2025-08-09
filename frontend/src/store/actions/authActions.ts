import { createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  LoginRequest, 
  SignupRequest, 
  LoginResponse, 
  SignupResponse,
  User 
} from '../types/authTypes';

// API base URL - should match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Custom error class for API errors
class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Login user
export const loginUser = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || errorData.detail || 'Login failed', response.status);
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('token', data.access_token);
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred during login');
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk<SignupResponse, SignupRequest>(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || errorData.detail || 'Signup failed', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred during signup');
    }
  }
);

// Verify token and get current user
export const verifyToken = createAsyncThunk<User>(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new ApiError('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // Remove invalid token
        localStorage.removeItem('token');
        throw new ApiError('Token validation failed', response.status);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      localStorage.removeItem('token');
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Token verification failed');
    }
  }
);

// Get current user info
export const getCurrentUser = createAsyncThunk<User>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || errorData.detail || 'Failed to get user info', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk<void>(
  'auth/logoutUser',
  async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      // Always remove token from localStorage, even if API call fails
      localStorage.removeItem('token');

      if (!response.ok) {
        console.warn('Logout API call failed, but token removed locally');
      }
    } catch (error) {
      // Always remove token even if network fails
      localStorage.removeItem('token');
      console.warn('Logout network error, but token removed locally');
    }
  }
);
