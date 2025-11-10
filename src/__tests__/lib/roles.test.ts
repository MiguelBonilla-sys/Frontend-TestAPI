/**
 * Roles Utilities Tests
 */

import {
  ROLES,
  hasRole,
  isAdmin,
  isSuperAdmin,
  getRoleDisplayName,
  getRoleDescription,
} from '@/lib/roles';

describe('Roles Utilities', () => {
  describe('ROLES constants', () => {
    it('should have all required role constants', () => {
      expect(ROLES.DESARROLLADORA).toBe('desarrolladora');
      expect(ROLES.EDITOR).toBe('editor');
      expect(ROLES.SUPERADMIN).toBe('superadmin');
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the role', () => {
      expect(hasRole('editor', ROLES.EDITOR)).toBe(true);
    });

    it('should return false if user does not have the role', () => {
      expect(hasRole('editor', ROLES.SUPERADMIN)).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(hasRole('EDITOR', ROLES.EDITOR)).toBe(true);
      expect(hasRole('Editor', ROLES.EDITOR)).toBe(true);
    });

    it('should return false if userRole is undefined', () => {
      expect(hasRole(undefined, ROLES.EDITOR)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for editor role', () => {
      expect(isAdmin('editor')).toBe(true);
    });

    it('should return true for superadmin role', () => {
      expect(isAdmin('superadmin')).toBe(true);
    });

    it('should return false for desarrolladora role', () => {
      expect(isAdmin('desarrolladora')).toBe(false);
    });

    it('should return false if role is undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true for superadmin role', () => {
      expect(isSuperAdmin('superadmin')).toBe(true);
    });

    it('should return false for other roles', () => {
      expect(isSuperAdmin('editor')).toBe(false);
      expect(isSuperAdmin('desarrolladora')).toBe(false);
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return correct display name for each role', () => {
      expect(getRoleDisplayName('desarrolladora')).toBe('Desarrolladora');
      expect(getRoleDisplayName('editor')).toBe('Editor');
      expect(getRoleDisplayName('superadmin')).toBe('Super Administrador');
    });

    it('should return role as-is for unknown roles', () => {
      expect(getRoleDisplayName('unknown')).toBe('unknown');
    });
  });

  describe('getRoleDescription', () => {
    it('should return correct description for each role', () => {
      expect(getRoleDescription('desarrolladora')).toContain('desarrolladora');
      expect(getRoleDescription('editor')).toContain('Editor');
      expect(getRoleDescription('superadmin')).toContain('Super administrador');
    });

    it('should return default message for unknown roles', () => {
      expect(getRoleDescription('unknown')).toBe('Rol desconocido');
    });
  });
});

