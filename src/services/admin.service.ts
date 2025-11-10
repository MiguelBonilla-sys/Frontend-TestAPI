/**
 * Admin Service
 * API service for administration operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  UserResponse,
  RoleResponse,
  PermissionResponse,
  PaginationParams,
} from '@/types/api';

export const adminService = {
  /**
   * Get all users with optional pagination
   */
  async getAllUsers(params?: PaginationParams): Promise<ApiResponse<UserResponse[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<UserResponse[]>(endpoint);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<ApiResponse<UserResponse>> {
    return apiClient.get<UserResponse>(`/admin/users/${userId}`);
  },

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return apiClient.get<RoleResponse[]>('/admin/roles');
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<ApiResponse<{ total_users: number; total_videojuegos: number; total_desarrolladoras: number; roles_count: Record<string, number> }>> {
    return apiClient.get<{ total_users: number; total_videojuegos: number; total_desarrolladoras: number; roles_count: Record<string, number> }>('/admin/stats');
  },

  /**
   * Get my permissions
   */
  async getMyPermissions(): Promise<ApiResponse<PermissionResponse[]>> {
    return apiClient.get<PermissionResponse[]>('/admin/my-permissions');
  },
};
