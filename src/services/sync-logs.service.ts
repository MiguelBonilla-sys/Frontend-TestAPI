/**
 * Sync Logs Service
 * API service for synchronization logs operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  SyncLogListResponse,
  SyncLogResponse,
  SyncLogStatisticsResponse,
  SyncLogListParams,
} from '@/types/api';

export const syncLogsService = {
  /**
   * Get all sync logs with optional filters and pagination
   */
  async getAllLogs(params?: SyncLogListParams): Promise<SyncLogListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/sync-logs/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<SyncLogListResponse>(endpoint);
  },

  /**
   * Get recent sync logs
   */
  async getRecentLogs(
    limit: number = 50,
    apiSource?: 'rawg' | 'steam' | 'igdb'
  ): Promise<SyncLogListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (apiSource) {
      queryParams.append('api_source', apiSource);
    }

    return apiClient.get<SyncLogListResponse>(
      `/api/sync-logs/recent?${queryParams.toString()}`
    );
  },

  /**
   * Get sync log statistics
   */
  async getLogStatistics(
    days: number = 7,
    apiSource?: 'rawg' | 'steam' | 'igdb'
  ): Promise<SyncLogStatisticsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('days', days.toString());

    if (apiSource) {
      queryParams.append('api_source', apiSource);
    }

    return apiClient.get<SyncLogStatisticsResponse>(
      `/api/sync-logs/statistics?${queryParams.toString()}`
    );
  },

  /**
   * Get sync log by ID
   */
  async getLogById(syncLogId: number): Promise<{ success: boolean; data: SyncLogResponse }> {
    return apiClient.get<{ success: boolean; data: SyncLogResponse }>(
      `/api/sync-logs/${syncLogId}`
    );
  },
};
