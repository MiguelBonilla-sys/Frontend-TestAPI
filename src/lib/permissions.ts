/**
 * Permissions Utilities
 * Helper functions for checking user permissions
 */

import type { PermissionResponse } from '@/types/api';

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  permissions: PermissionResponse[] | undefined,
  permissionName: string
): boolean {
  if (!permissions) {
    return false;
  }

  return permissions.some((perm) => perm.name === permissionName);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  permissions: PermissionResponse[] | undefined,
  permissionNames: string[]
): boolean {
  if (!permissions) {
    return false;
  }

  return permissionNames.some((name) => hasPermission(permissions, name));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  permissions: PermissionResponse[] | undefined,
  permissionNames: string[]
): boolean {
  if (!permissions) {
    return false;
  }

  return permissionNames.every((name) => hasPermission(permissions, name));
}

/**
 * Common permission names
 */
export const PERMISSIONS = {
  // Videojuegos
  READ_VIDEOJUEGOS: 'read:videojuegos',
  CREATE_VIDEOJUEGOS: 'create:videojuegos',
  UPDATE_VIDEOJUEGOS: 'update:videojuegos',
  DELETE_VIDEOJUEGOS: 'delete:videojuegos',
  IMPORT_VIDEOJUEGOS: 'import:videojuegos',

  // Desarrolladoras
  READ_DESARROLLADORAS: 'read:desarrolladoras',
  CREATE_DESARROLLADORAS: 'create:desarrolladoras',
  UPDATE_DESARROLLADORAS: 'update:desarrolladoras',
  DELETE_DESARROLLADORAS: 'delete:desarrolladoras',

  // Usuarios
  READ_USERS: 'read:users',
  UPDATE_USERS: 'update:users',
  DELETE_USERS: 'delete:users',

  // Roles
  READ_ROLES: 'read:roles',
  UPDATE_ROLES: 'update:roles',

  // Sync Logs
  READ_SYNC_LOGS: 'read:sync_logs',
} as const;
