/**
 * Permissions Display Component Tests
 */

import { render, screen } from '@testing-library/react';
import { PermissionsDisplay } from '@/components/permissions-display';

// Mock usePermissions
jest.mock('@/hooks/use-permissions', () => ({
  usePermissions: jest.fn(),
}));

import { usePermissions } from '@/hooks/use-permissions';

describe('PermissionsDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display permissions when available', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { name: 'read:videojuegos', description: 'Read videojuegos' },
        { name: 'create:videojuegos', description: 'Create videojuegos' },
      ],
    });

    render(<PermissionsDisplay />);

    expect(screen.getByText('Tus Permisos')).toBeInTheDocument();
    expect(screen.getByText('read:videojuegos')).toBeInTheDocument();
    expect(screen.getByText('Read videojuegos')).toBeInTheDocument();
  });

  it('should display message when no permissions', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [],
    });

    render(<PermissionsDisplay />);

    expect(screen.getByText('No tienes permisos asignados')).toBeInTheDocument();
  });

  it('should not display title when showTitle is false', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      permissions: [
        { name: 'read:videojuegos', description: 'Read videojuegos' },
      ],
    });

    render(<PermissionsDisplay showTitle={false} />);

    expect(screen.queryByText('Tus Permisos')).not.toBeInTheDocument();
    expect(screen.getByText('read:videojuegos')).toBeInTheDocument();
  });
});

