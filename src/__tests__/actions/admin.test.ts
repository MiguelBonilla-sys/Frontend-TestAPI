/**
 * Admin Actions Tests
 */

import {
  getAllUsersAction,
  getUserByIdAction,
  getAllRolesAction,
  getSystemStatsAction,
  getMyPermissionsAction,
} from '@/actions/admin';

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

describe('Admin Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.get.mockReturnValue({ value: 'test-token' });
  });

  describe('getAllUsersAction', () => {
    it('should get all users successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Users retrieved',
        data: [
          { id: 1, email: 'user1@example.com', role: 'desarrolladora' },
        ],
        count: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAllUsersAction({ page: 1, per_page: 10 });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('getSystemStatsAction', () => {
    it('should get system stats successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Stats retrieved',
        data: {
          total_users: 10,
          total_videojuegos: 50,
          total_desarrolladoras: 5,
          roles_count: {},
        },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getSystemStatsAction();

      expect(result.success).toBe(true);
      expect(result.data?.total_users).toBe(10);
    });
  });
});

