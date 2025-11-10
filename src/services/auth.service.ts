/**
 * Authentication Service
 * API service for authentication-related operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  RoleResponse,
  PermissionResponse,
} from '@/types/api';

export const authService = {
  /**
   * Check password strength
   */
  async checkPasswordStrength(password: string): Promise<ApiResponse<{ strength: 'weak' | 'medium' | 'strong' | 'very_strong'; score: number; feedback?: string[] }>> {
    return apiClient.post<{ strength: 'weak' | 'medium' | 'strong' | 'very_strong'; score: number; feedback?: string[] }>(
      '/auth/check-password-strength',
      { password },
      { useAuth: false }
    );
  },

  /**
   * Get available roles
   */
  async getAvailableRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return apiClient.get<RoleResponse[]>('/auth/roles', {
      useAuth: false,
    });
  },

  /**
   * Get role permissions
   */
  async getRolePermissions(roleName: string): Promise<ApiResponse<{ role: RoleResponse; permissions: PermissionResponse[] }>> {
    return apiClient.get<{ role: RoleResponse; permissions: PermissionResponse[] }>(
      `/auth/roles/${roleName}/permissions`,
      { useAuth: false }
    );
  },
};
