/**
 * usePermissions Hook Tests
 */

import { renderHook } from '@testing-library/react';
import { usePermissions } from '@/hooks/use-permissions';

// Mock useAuth
jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '@/contexts/auth-context';

describe('usePermissions', () => {
  const mockPermissions = [
    { name: 'read:videojuegos', description: 'Read videojuegos' },
    { name: 'create:videojuegos', description: 'Create videojuegos' },
    { name: 'read:users', description: 'Read users' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return permissions from auth context', () => {
    (useAuth as jest.Mock).mockReturnValue({
      permissions: mockPermissions,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.permissions).toEqual(mockPermissions);
  });

  it('should provide permission checking functions', () => {
    (useAuth as jest.Mock).mockReturnValue({
      permissions: mockPermissions,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.hasPermission('read:videojuegos')).toBe(true);
    expect(result.current.hasPermission('delete:videojuegos')).toBe(false);
  });

  it('should provide convenience permission flags', () => {
    (useAuth as jest.Mock).mockReturnValue({
      permissions: mockPermissions,
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.canReadVideojuegos).toBe(true);
    expect(result.current.canCreateVideojuegos).toBe(true);
    expect(result.current.canReadUsers).toBe(true);
    expect(result.current.canDeleteVideojuegos).toBe(false);
  });

  it('should handle empty permissions', () => {
    (useAuth as jest.Mock).mockReturnValue({
      permissions: [],
    });

    const { result } = renderHook(() => usePermissions());

    expect(result.current.permissions).toEqual([]);
    expect(result.current.canReadVideojuegos).toBe(false);
  });
});

