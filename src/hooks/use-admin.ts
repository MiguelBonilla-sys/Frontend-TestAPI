/**
 * use-admin Hook
 * Custom hook for admin operations
 */

import { useState, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import type {
  UserResponse,
  RoleResponse,
  SystemStatsData,
  MyPermissionsResponse,
  PaginationParams,
} from '@/types/api';

interface UseAdminReturn {
  isLoading: boolean;
  error: string | null;
  getAllUsers: (params?: PaginationParams) => Promise<{ success: boolean; data?: UserResponse[]; count?: number }>;
  getUserById: (userId: number) => Promise<{ success: boolean; data?: UserResponse }>;
  getAllRoles: () => Promise<{ success: boolean; data?: RoleResponse[] }>;
  getSystemStats: () => Promise<{ success: boolean; data?: SystemStatsData }>;
  getMyPermissions: () => Promise<{ success: boolean; data?: MyPermissionsResponse }>;
}

export function useAdmin(): UseAdminReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminService.getAllUsers(params);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          count: response.count,
        };
      }

      const errorMsg = response.message || 'Error al obtener usuarios';
      setError(errorMsg);
      return { success: false };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminService.getUserById(userId);

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      const errorMsg = response.message || 'Error al obtener usuario';
      setError(errorMsg);
      return { success: false };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminService.getAllRoles();

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      const errorMsg = response.message || 'Error al obtener roles';
      setError(errorMsg);
      return { success: false };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSystemStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminService.getSystemStats();

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      const errorMsg = response.message || 'Error al obtener estadísticas';
      setError(errorMsg);
      return { success: false };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminService.getMyPermissions();

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      const errorMsg = response.message || 'Error al obtener permisos';
      setError(errorMsg);
      return { success: false };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getAllUsers,
    getUserById,
    getAllRoles,
    getSystemStats,
    getMyPermissions,
  };
}
