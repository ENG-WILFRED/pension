// app/lib/api-client.ts
'use client';

// Client library for calling the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: any;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: `Invalid response format from server (${response.status})`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
        ...data,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error - please check your connection',
    };
  }
}

// Auth API calls
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    spouseName?: string;
    spouseDob?: string;
    children?: Array<{ name: string; dob: string }>;
    nationalId?: string;
    address?: string;
    city?: string;
    country?: string;
    occupation?: string;
    employer?: string;
    salary?: number;
    contributionRate?: number;
    retirementAge?: number;
  }) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  completeRegistration: (transactionId: string) =>
    apiCall('/api/auth/register/complete', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    }),

  // Poll registration/payment status
  getRegisterStatus: (transactionId: string) =>
    apiCall(`/api/auth/register/status/${transactionId}`, {
      method: 'GET',
    }),

  sendOtp: (data: { email: string }) =>
    apiCall('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOtp: (data: { email: string; otp: string }) =>
    apiCall('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { identifier: string; password: string }) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginOtp: (data: { identifier: string; otp: string }) =>
    apiCall('/api/auth/login/otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verify: () =>
    apiCall('/api/auth/verify', {
      method: 'GET',
    }),
};

// Payment API calls
export const paymentApi = {
  initiate: (data: {
    amount: number;
    phone: string;
    description?: string;
  }) =>
    apiCall('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (transactionId: string) =>
    apiCall(`/api/payment/status/${transactionId}`, {
      method: 'GET',
    }),
};

// Dashboard API calls
export const dashboardApi = {
  getUser: () =>
    apiCall('/api/dashboard/user', {
      method: 'GET',
    }),

  getTransactions: () =>
    apiCall('/api/dashboard/transactions', {
      method: 'GET',
    }),

  getStats: () =>
    apiCall('/api/dashboard/stats', {
      method: 'GET',
    }),
};

// Health check
export const healthApi = {
  check: () => apiCall('/api/health'),
};