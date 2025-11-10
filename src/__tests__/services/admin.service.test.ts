/**
 * Admin Service Tests
 */

import { adminService } from '@/services/admin.service';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Users retrieved',
        data: [
          { id: 1, email: 'user1@example.com', role: 'desarrolladora' },
          { id: 2, email: 'user2@example.com', role: 'editor' },
        ],
        count: 2,
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await adminService.getAllUsers({ page: 1, per_page: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/admin/users?page=1&per_page=10');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserById', () => {
    it('should get user by ID successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'User retrieved',
        data: { id: 1, email: 'user@example.com', role: 'editor' },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await adminService.getUserById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/admin/users/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSystemStats', () => {
    it('should get system stats successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Stats retrieved',
        data: {
          total_users: 10,
          total_videojuegos: 50,
          total_desarrolladoras: 5,
          roles_count: { desarrolladora: 8, editor: 2 },
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await adminService.getSystemStats();

      expect(apiClient.get).toHaveBeenCalledWith('/admin/stats');
      expect(result).toEqual(mockResponse);
    });
  });
});

