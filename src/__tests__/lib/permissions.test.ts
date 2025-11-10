/**
 * Permissions Utilities Tests
 */

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  PERMISSIONS,
} from '@/lib/permissions';
import type { PermissionResponse } from '@/types/api';

describe('Permissions Utilities', () => {
  const mockPermissions: PermissionResponse[] = [
    { name: 'read:videojuegos', description: 'Read videojuegos' },
    { name: 'create:videojuegos', description: 'Create videojuegos' },
    { name: 'read:users', description: 'Read users' },
  ];

  describe('hasPermission', () => {
    it('should return true if user has the permission', () => {
      expect(hasPermission(mockPermissions, 'read:videojuegos')).toBe(true);
    });

    it('should return false if user does not have the permission', () => {
      expect(hasPermission(mockPermissions, 'delete:videojuegos')).toBe(false);
    });

    it('should return false if permissions is undefined', () => {
      expect(hasPermission(undefined, 'read:videojuegos')).toBe(false);
    });

    it('should return false if permissions is empty', () => {
      expect(hasPermission([], 'read:videojuegos')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has any of the permissions', () => {
      expect(
        hasAnyPermission(mockPermissions, [
          'read:videojuegos',
          'delete:videojuegos',
        ])
      ).toBe(true);
    });

    it('should return false if user has none of the permissions', () => {
      expect(
        hasAnyPermission(mockPermissions, [
          'delete:videojuegos',
          'update:users',
        ])
      ).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all permissions', () => {
      expect(
        hasAllPermissions(mockPermissions, [
          'read:videojuegos',
          'create:videojuegos',
        ])
      ).toBe(true);
    });

    it('should return false if user is missing any permission', () => {
      expect(
        hasAllPermissions(mockPermissions, [
          'read:videojuegos',
          'delete:videojuegos',
        ])
      ).toBe(false);
    });
  });

  describe('PERMISSIONS constants', () => {
    it('should have all required permission constants', () => {
      expect(PERMISSIONS.READ_VIDEOJUEGOS).toBe('read:videojuegos');
      expect(PERMISSIONS.CREATE_VIDEOJUEGOS).toBe('create:videojuegos');
      expect(PERMISSIONS.UPDATE_VIDEOJUEGOS).toBe('update:videojuegos');
      expect(PERMISSIONS.DELETE_VIDEOJUEGOS).toBe('delete:videojuegos');
      expect(PERMISSIONS.IMPORT_VIDEOJUEGOS).toBe('import:videojuegos');
      expect(PERMISSIONS.READ_DESARROLLADORAS).toBe('read:desarrolladoras');
      expect(PERMISSIONS.READ_USERS).toBe('read:users');
      expect(PERMISSIONS.READ_SYNC_LOGS).toBe('read:sync_logs');
    });
  });
});

