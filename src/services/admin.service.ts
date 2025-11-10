/**
 * Admin Service
 * API service for administration operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  UserListResponse,
  UserDetailResponse,
  UserResponse,
  RoleResponse,
  SystemStatsResponse,
  PermissionResponse,
  PaginationParams,
} from '@/types/api';

export const adminService = {
  /**
   * Get all users with optional pagination
   */
  async getAllUsers(params?: PaginationParams): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<UserListResponse>(endpoint);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UserDetailResponse> {
    return apiClient.get<UserDetailResponse>(`/admin/users/${userId}`);
  },

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return apiClient.get<ApiResponse<RoleResponse[]>>('/admin/roles');
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStatsResponse> {
    return apiClient.get<SystemStatsResponse>('/admin/stats');
  },

  /**
   * Get my permissions
   */
  async getMyPermissions(): Promise<ApiResponse<PermissionResponse[]>> {
    return apiClient.get<ApiResponse<PermissionResponse[]>>('/admin/my-permissions');
  },
};
