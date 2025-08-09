const API_BASE_URL = "http://3.110.153.105:3000/api/v1";

export interface LoginRequest {
  user_type: number;
  email: string;
  password: string;
}

export interface LoginResponse {
  data?: {
    token?: string;
    user?: any;
  };
  token?: string;
  user?: any;
  message?: string;
}

export const apiService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('API Service - Raw response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  // Centralized authorized fetch helper
  async authFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();

    const resolvedUrl = input.startsWith('http')
      ? input
      : `${API_BASE_URL}${input.startsWith('/') ? '' : '/'}${input}`;

    const headers = new Headers(init.headers || {});

    if (token) {
      // Do not overwrite if caller explicitly passed Authorization
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // If a body is present and not FormData, ensure JSON content-type unless already set
    const hasBody = typeof (init as any).body !== 'undefined' && (init as any).body !== null;
    const isFormData = hasBody && typeof FormData !== 'undefined' && (init as any).body instanceof FormData;
    if (hasBody && !isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(resolvedUrl, { ...init, headers });
  },

  // Helper function to get auth token
  getAuthToken(): string | null {
    const token = localStorage.getItem('adminToken');
    console.log('API Service - getting auth token:', token);
    return token;
  },

  // Helper function to set auth token
  setAuthToken(token: string): void {
    console.log('API Service - setting auth token:', token);
    localStorage.setItem('adminToken', token);
    console.log('API Service - token stored in localStorage');
  },

  // Helper function to clear auth token
  clearAuthToken(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
  },

  // Helper function to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}; 