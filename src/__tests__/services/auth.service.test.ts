/**
 * Auth Service Tests
 */

import { authService } from '@/services/auth.service';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPasswordStrength', () => {
    it('should check password strength successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Password strength checked',
        data: {
          strength: 'strong' as const,
          score: 8,
          feedback: ['Good password'],
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.checkPasswordStrength('StrongPassword123!');

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/check-password-strength',
        { password: 'StrongPassword123!' },
        { useAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAvailableRoles', () => {
    it('should get available roles successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Roles retrieved',
        data: [
          { id: 1, name: 'desarrolladora', description: 'Developer role' },
          { id: 2, name: 'editor', description: 'Editor role' },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.getAvailableRoles();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/roles', { useAuth: false });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRolePermissions', () => {
    it('should get role permissions successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Permissions retrieved',
        data: {
          role: { id: 1, name: 'editor' },
          permissions: [
            { name: 'read:videojuegos', description: 'Read videojuegos' },
          ],
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.getRolePermissions('editor');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/auth/roles/editor/permissions',
        { useAuth: false }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

