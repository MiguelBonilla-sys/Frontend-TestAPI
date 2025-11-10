/**
 * Authentication Service
 * API service for authentication-related operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  RoleResponse,
  RolePermissionsApiResponse,
  PasswordStrengthResponse,
} from '@/types/api';

export const authService = {
  /**
   * Check password strength
   */
  async checkPasswordStrength(password: string): Promise<PasswordStrengthResponse> {
    return apiClient.post<PasswordStrengthResponse>(
      '/auth/check-password-strength',
      { password },
      { useAuth: false }
    );
  },

  /**
   * Get available roles
   */
  async getAvailableRoles(): Promise<ApiResponse<RoleResponse[]>> {
    return apiClient.get<ApiResponse<RoleResponse[]>>('/auth/roles', {
      useAuth: false,
    });
  },

  /**
   * Get role permissions
   */
  async getRolePermissions(roleName: string): Promise<RolePermissionsApiResponse> {
    return apiClient.get<RolePermissionsApiResponse>(
      `/auth/roles/${roleName}/permissions`,
      { useAuth: false }
    );
  },
};
