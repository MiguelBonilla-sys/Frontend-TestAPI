/**
 * Sync Logs Service Tests
 */

import { syncLogsService } from '@/services/sync-logs.service';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

describe('SyncLogsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLogs', () => {
    it('should get all logs successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Logs retrieved',
        data: [
          {
            id: 1,
            status: 'success',
            api_source: 'rawg',
            games_processed: 10,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        count: 1,
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await syncLogsService.getAllLogs({ page: 1, per_page: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/api/sync-logs/?page=1&per_page=10');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRecentLogs', () => {
    it('should get recent logs successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Recent logs retrieved',
        data: [],
        count: 0,
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await syncLogsService.getRecentLogs(50, 'rawg');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/sync-logs/recent?limit=50&api_source=rawg'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLogStatistics', () => {
    it('should get log statistics successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Statistics retrieved',
        data: {
          total: 100,
          successful: 95,
          failed: 5,
          pending: 0,
          success_rate: 95.0,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await syncLogsService.getLogStatistics(7, 'rawg');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/sync-logs/statistics?days=7&api_source=rawg'
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

