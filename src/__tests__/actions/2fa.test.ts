/**
 * 2FA Actions Tests
 */

import {
  enable2FAAction,
  confirm2FAAction,
  get2FAStatusAction,
  disable2FAAction,
} from '@/actions/2fa';

// Mock fetch and cookies
global.fetch = jest.fn();
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookies)),
}));

describe('2FA Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.get.mockReturnValue({ value: 'test-token' });
  });

  describe('enable2FAAction', () => {
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

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await enable2FAAction();

      expect(result.success).toBe(true);
      expect(result.data?.qr_code).toBeDefined();
    });
  });

  describe('confirm2FAAction', () => {
    it('should confirm 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA confirmed',
        data: {
          message: '2FA setup complete',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await confirm2FAAction('123456');

      expect(result.success).toBe(true);
    });
  });

  describe('get2FAStatusAction', () => {
    it('should get 2FA status successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Status retrieved',
        data: {
          enabled: true,
          verified: true,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await get2FAStatusAction();

      expect(result.success).toBe(true);
      expect(result.data?.enabled).toBe(true);
    });
  });

  describe('disable2FAAction', () => {
    it('should disable 2FA successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA disabled',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await disable2FAAction();

      expect(result.success).toBe(true);
    });
  });
});

