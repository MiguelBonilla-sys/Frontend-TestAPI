/**
 * Sync Logs Service
 * API service for synchronization logs operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  SyncLogResponse,
  SyncLogListParams,
} from '@/types/api';

export const syncLogsService = {
  /**
   * Get all sync logs with optional filters and pagination
   */
  async getAllLogs(params?: SyncLogListParams): Promise<ApiResponse<SyncLogResponse[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/sync-logs/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<SyncLogResponse[]>(endpoint);
  },

  /**
   * Get recent sync logs
   */
  async getRecentLogs(
    limit: number = 50,
    apiSource?: 'rawg' | 'steam' | 'igdb'
  ): Promise<ApiResponse<SyncLogResponse[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (apiSource) {
      queryParams.append('api_source', apiSource);
    }

    return apiClient.get<SyncLogResponse[]>(
      `/api/sync-logs/recent?${queryParams.toString()}`
    );
  },

  /**
   * Get sync log statistics
   */
  async getLogStatistics(
    days: number = 7,
    apiSource?: 'rawg' | 'steam' | 'igdb'
  ): Promise<ApiResponse<{ total: number; successful: number; failed: number; pending: number; success_rate: number }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('days', days.toString());

    if (apiSource) {
      queryParams.append('api_source', apiSource);
    }

    return apiClient.get<{ total: number; successful: number; failed: number; pending: number; success_rate: number }>(
      `/api/sync-logs/statistics?${queryParams.toString()}`
    );
  },

  /**
   * Get sync log by ID
   */
  async getLogById(syncLogId: number): Promise<ApiResponse<SyncLogResponse>> {
    return apiClient.get<SyncLogResponse>(
      `/api/sync-logs/${syncLogId}`
    );
  },
};
