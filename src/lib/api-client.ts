/**
 * API Client
 * HTTP client with automatic token management and refresh
 */

import type { ApiResponse, ErrorResponse } from '@/types/api';

const API_PROXY_URL = '/api/proxy';

interface RequestConfig extends RequestInit {
  useAuth?: boolean;
  skipRefresh?: boolean;
}

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    // Initialize tokens from localStorage on client side
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Add subscriber for token refresh
   */
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers of new token
   */
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    if (this.isRefreshing) {
      // Wait for the current refresh to complete
      return new Promise((resolve) => {
        this.subscribeTokenRefresh((token: string) => {
          resolve(token);
        });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_PROXY_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();

      if (data.success && data.data) {
        const { access_token, refresh_token } = data.data;
        this.setTokens(access_token, refresh_token);
        this.onTokenRefreshed(access_token);
        return access_token;
      }

      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      // Redirect to login if we're on the client
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Make an API request
   */
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      useAuth = true,
      skipRefresh = false,
      headers = {},
      ...restConfig
    } = config;

    // Build full URL using proxy
    const url = `${API_PROXY_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers as Record<string, string>,
    };

    // Add authorization header if needed
    if (useAuth && this.accessToken) {
      requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      // Make the request
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && useAuth && !skipRefresh) {
        const newToken = await this.refreshAccessToken();

        if (newToken) {
          // Retry the request with new token
          return this.request<T>(endpoint, {
            ...config,
            skipRefresh: true, // Prevent infinite loop
            headers: {
              ...requestHeaders,
              'Authorization': `Bearer ${newToken}`,
            },
          });
        }
      }

      // Parse response
      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        const errorData = data as ErrorResponse;
        
        // Handle 403 Forbidden - 2FA required
        if (response.status === 403 && useAuth && typeof window !== 'undefined') {
          const errorMessage = errorData.message?.toLowerCase() || '';
          if (
            errorMessage.includes('2fa') ||
            errorMessage.includes('two factor') ||
            errorMessage.includes('otp') ||
            errorMessage.includes('verification')
          ) {
            // Check if we have a temp_token in the response
            const dataWithToken = data as { temp_token?: string; challenge_id?: string; data?: { temp_token?: string; challenge_id?: string } };
            const tempToken = dataWithToken.temp_token || dataWithToken.data?.temp_token;
            const challengeId = dataWithToken.challenge_id || dataWithToken.data?.challenge_id;
            
            if (tempToken) {
              // Redirect to 2FA verification page
              const verifyUrl = new URL('/auth/verify-2fa', window.location.origin);
              verifyUrl.searchParams.set('temp_token', tempToken);
              if (challengeId) {
                verifyUrl.searchParams.set('challenge_id', challengeId);
              }
              window.location.href = verifyUrl.toString();
              // Return error to prevent further execution
              throw new Error('2FA verification required');
            }
          }
        }
        
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);

      // Return standardized error response
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      } as ApiResponse<T>;
    }
  }

  /**
   * Convenience methods for HTTP verbs
   */

  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or custom instances
export default ApiClient;
