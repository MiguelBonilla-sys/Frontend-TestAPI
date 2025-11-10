/**
 * API Client Tests
 */

import ApiClient from '@/lib/api-client';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  let apiClient: ApiClient;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient = new ApiClient();
    localStorage.clear();
  });

  describe('setTokens', () => {
    it('should set tokens in localStorage', () => {
      apiClient.setTokens('access-token', 'refresh-token');

      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
    });
  });

  describe('clearTokens', () => {
    it('should clear tokens from localStorage', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('user', '{}');

      apiClient.clearTokens();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('request', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Success',
        data: { id: 1 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/proxy/test',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 and refresh token', async () => {
      const mockTokenResponse = {
        success: true,
        data: {
          access_token: 'new-token',
          refresh_token: 'new-refresh',
          expires_in: 3600,
          user: { id: 1 },
        },
      };

      // First call returns 401
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ success: false, message: 'Unauthorized' }),
        } as Response)
        // Refresh token call
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTokenResponse,
        } as Response)
        // Retry original request
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: { id: 1 } }),
        } as Response);

      apiClient.setTokens('old-token', 'refresh-token');

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledTimes(3); // Original + refresh + retry
      expect(result.success).toBe(true);
    });

    it('should handle 403 2FA required', async () => {
      const mock2FAResponse = {
        success: false,
        message: '2FA verification required',
        temp_token: 'temp-token-123',
        challenge_id: 'challenge-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => mock2FAResponse,
      } as Response);

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = {
        ...originalLocation,
        href: '',
        origin: 'http://localhost:3000',
      } as Location;

      apiClient.setTokens('token', 'refresh');

      await apiClient.get('/test');

      expect(window.location.href).toContain('/auth/verify-2fa');
      expect(window.location.href).toContain('temp_token=temp-token-123');

      // Restore
      window.location = originalLocation;
    });
  });
});

