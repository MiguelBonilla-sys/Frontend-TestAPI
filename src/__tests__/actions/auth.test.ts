/**
 * Auth Actions Tests
 */

import {
  loginAction,
  registerAction,
  logoutAction,
  changePasswordAction,
  checkPasswordStrengthAction,
  getAvailableRolesAction,
  getRolePermissionsAction,
} from '@/actions/auth';

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

describe('Auth Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockCookies.get.mockClear();
    mockCookies.set.mockClear();
    mockCookies.delete.mockClear();
  });

  describe('loginAction', () => {
    it('should login successfully and set cookies', async () => {
      const mockResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          token_type: 'bearer',
          expires_in: 3600,
          user: {
            id: 1,
            email: 'test@example.com',
            role: 'desarrolladora',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await loginAction({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(mockCookies.set).toHaveBeenCalledWith(
        'access_token',
        'access-token',
        expect.any(Object)
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        expect.any(Object)
      );
    });

    it('should handle login failure', async () => {
      const mockResponse = {
        success: false,
        message: 'Credenciales inválidas',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => mockResponse,
      });

      const result = await loginAction({
        email: 'wrong@example.com',
        password: 'wrong',
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales inválidas');
    });
  });

  describe('registerAction', () => {
    it('should register and login successfully', async () => {
      const mockRegisterResponse = {
        success: true,
        message: 'Usuario registrado',
        data: {
          id: 1,
          email: 'new@example.com',
          role: 'desarrolladora',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      const mockLoginResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          token_type: 'bearer',
          expires_in: 3600,
          user: mockRegisterResponse.data,
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRegisterResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockLoginResponse,
        });

      const result = await registerAction({
        email: 'new@example.com',
        password: 'password123',
        confirm_password: 'password123',
        role: 'desarrolladora',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('checkPasswordStrengthAction', () => {
    it('should check password strength', async () => {
      const mockResponse = {
        success: true,
        message: 'Password checked',
        data: {
          strength: 'strong',
          score: 8,
          feedback: [],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await checkPasswordStrengthAction('StrongPassword123!');

      expect(result.success).toBe(true);
      expect(result.data?.strength).toBe('strong');
    });
  });

  describe('getAvailableRolesAction', () => {
    it('should get available roles', async () => {
      const mockResponse = {
        success: true,
        message: 'Roles retrieved',
        data: [
          { id: 1, name: 'desarrolladora' },
          { id: 2, name: 'editor' },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAvailableRolesAction();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});

