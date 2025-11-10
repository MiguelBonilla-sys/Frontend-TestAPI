/**
 * use-permissions Hook
 * Custom hook for permission checking
 */

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { hasPermission, hasAnyPermission, hasAllPermissions, PERMISSIONS } from '@/lib/permissions';
import type { PermissionResponse } from '@/types/api';

interface UsePermissionsReturn {
  permissions: PermissionResponse[];
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissionNames: string[]) => boolean;
  hasAllPermissions: (permissionNames: string[]) => boolean;
  canReadVideojuegos: boolean;
  canCreateVideojuegos: boolean;
  canUpdateVideojuegos: boolean;
  canDeleteVideojuegos: boolean;
  canImportVideojuegos: boolean;
  canReadDesarrolladoras: boolean;
  canCreateDesarrolladoras: boolean;
  canUpdateDesarrolladoras: boolean;
  canDeleteDesarrolladoras: boolean;
  canReadUsers: boolean;
  canReadSyncLogs: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { permissions } = useAuth();

  const permissionHelpers = useMemo(() => {
    return {
      hasPermission: (name: string) => hasPermission(permissions, name),
      hasAnyPermission: (names: string[]) => hasAnyPermission(permissions, names),
      hasAllPermissions: (names: string[]) => hasAllPermissions(permissions, names),
    };
  }, [permissions]);

  const specificPermissions = useMemo(() => {
    return {
      canReadVideojuegos: hasPermission(permissions, PERMISSIONS.READ_VIDEOJUEGOS),
      canCreateVideojuegos: hasPermission(permissions, PERMISSIONS.CREATE_VIDEOJUEGOS),
      canUpdateVideojuegos: hasPermission(permissions, PERMISSIONS.UPDATE_VIDEOJUEGOS),
      canDeleteVideojuegos: hasPermission(permissions, PERMISSIONS.DELETE_VIDEOJUEGOS),
      canImportVideojuegos: hasPermission(permissions, PERMISSIONS.IMPORT_VIDEOJUEGOS),
      canReadDesarrolladoras: hasPermission(permissions, PERMISSIONS.READ_DESARROLLADORAS),
      canCreateDesarrolladoras: hasPermission(permissions, PERMISSIONS.CREATE_DESARROLLADORAS),
      canUpdateDesarrolladoras: hasPermission(permissions, PERMISSIONS.UPDATE_DESARROLLADORAS),
      canDeleteDesarrolladoras: hasPermission(permissions, PERMISSIONS.DELETE_DESARROLLADORAS),
      canReadUsers: hasPermission(permissions, PERMISSIONS.READ_USERS),
      canReadSyncLogs: hasPermission(permissions, PERMISSIONS.READ_SYNC_LOGS),
    };
  }, [permissions]);

  return {
    permissions: permissions || [],
    ...permissionHelpers,
    ...specificPermissions,
  };
}
