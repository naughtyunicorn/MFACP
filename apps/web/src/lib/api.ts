const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3015';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  riskTier: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  token: string;
  sessionType: string;
  trustLevel: string;
  expiresAt: string;
  requiresReauth: boolean;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: 'REQUEST_FAILED',
          message: `HTTP ${response.status}: ${response.statusText}`
        }
      };
    }

    return data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ id: string; email: string; emailVerified: boolean; riskTier: string; createdAt: string }>> {
    return this.request('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    return this.request('/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWebAuthnRegistrationOptions(email: string, displayName?: string, username?: string): Promise<ApiResponse<any>> {
    return this.request('/v1/webauthn/register/options', {
      method: 'POST',
      body: JSON.stringify({ email, displayName, username }),
    });
  }

  async verifyWebAuthnRegistration(email: string, credential: any): Promise<ApiResponse<any>> {
    return this.request('/v1/webauthn/register/verify', {
      method: 'POST',
      body: JSON.stringify({ email, credential }),
    });
  }

  async getWebAuthnAuthenticationOptions(email: string): Promise<ApiResponse<any>> {
    return this.request('/v1/webauthn/login/options', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyWebAuthnAuthentication(email: string, credential: any): Promise<ApiResponse<any>> {
    return this.request('/v1/webauthn/login/verify', {
      method: 'POST',
      body: JSON.stringify({ email, credential }),
    });
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; uptime: number; version: string; environment: string }>> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
