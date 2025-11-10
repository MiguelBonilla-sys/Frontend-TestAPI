/**
 * 2FA Service Tests
 */

import { twoFAService } from '@/services/2fa.service';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

describe('TwoFAService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enable2FA', () => {
    it('should enable 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA enabled',
        data: {
          qr_code: 'data:image/png;base64,...',
          secret: 'JBSWY3DPEHPK3PXP',
          message: 'Scan QR code',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await twoFAService.enable2FA();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/enable-2fa');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirm2FA', () => {
    it('should confirm 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA confirmed',
        data: {
          message: '2FA setup complete',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await twoFAService.confirm2FA('123456');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/confirm-2fa', {
        temp_token: '',
        otp_code: '123456',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verify2FA', () => {
    it('should verify 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA verified',
        data: {
          access_token: 'token',
          refresh_token: 'refresh',
          token_type: 'bearer',
          expires_in: 3600,
          user: { id: 1, email: 'test@example.com' },
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await twoFAService.verify2FA('temp-token', '123456', 'challenge-id');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/verify-2fa',
        {
          temp_token: 'temp-token',
          otp_code: '123456',
          challenge_id: 'challenge-id',
        },
        { useAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get2FAStatus', () => {
    it('should get 2FA status successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Status retrieved',
        data: {
          enabled: true,
          verified: true,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await twoFAService.get2FAStatus();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/2fa/status');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('disable2FA', () => {
    it('should disable 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA disabled',
      };

      (apiClient.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await twoFAService.disable2FA();

      expect(apiClient.delete).toHaveBeenCalledWith('/auth/disable-2fa');
      expect(result).toEqual(mockResponse);
    });
  });
});

