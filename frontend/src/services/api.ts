// API Configuration and Service Layer
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      VERIFY_TOKEN: '/auth/verify-token',
    },
    HEALTH: '/health',
  },
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login?: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
  };
}

// API Error Class
export class ApiError extends Error {
  public status: number;
  public response?: any;

  constructor(
    message: string,
    status: number,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse response
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage = data?.message || data?.detail || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    // Re-throw ApiError as is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server', 0);
    }

    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    );
  }
};

// Authentication API functions
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signup: async (data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
  }): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<{ user: LoginResponse['user'] }> => {
    return apiRequest<{ user: LoginResponse['user'] }>(API_CONFIG.ENDPOINTS.AUTH.ME);
  },

  logout: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },

  verifyToken: async (): Promise<{ valid: boolean; user?: LoginResponse['user'] }> => {
    return apiRequest<{ valid: boolean; user?: LoginResponse['user'] }>(
      API_CONFIG.ENDPOINTS.AUTH.VERIFY_TOKEN,
      {
        method: 'POST',
      }
    );
  },
};

// Health check API
export const healthApi = {
  check: async (): Promise<{
    status: string;
    message: string;
    database: string;
    version: string;
  }> => {
    return apiRequest<{
      status: string;
      message: string;
      database: string;
      version: string;
    }>(API_CONFIG.ENDPOINTS.HEALTH);
  },
};

// Utility function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};
