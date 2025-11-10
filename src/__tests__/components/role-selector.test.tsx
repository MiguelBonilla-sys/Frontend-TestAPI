/**
 * Role Selector Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleSelector } from '@/components/role-selector';

// Mock authService
jest.mock('@/services/auth.service', () => ({
  authService: {
    getAvailableRoles: jest.fn(),
  },
}));

import { authService } from '@/services/auth.service';

describe('RoleSelector', () => {
  const mockRoles = [
    { id: 1, name: 'desarrolladora', description: 'Developer role' },
    { id: 2, name: 'editor', description: 'Editor role' },
    { id: 3, name: 'superadmin', description: 'Super admin role' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    (authService.getAvailableRoles as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { container } = render(<RoleSelector value="" onChange={jest.fn()} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should load and display roles', async () => {
    (authService.getAvailableRoles as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRoles,
    });

    render(<RoleSelector value="" onChange={jest.fn()} />);

    await waitFor(() => {
      expect(authService.getAvailableRoles).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('desarrolladora - Developer role')).toBeInTheDocument();
      expect(screen.getByText('editor - Editor role')).toBeInTheDocument();
    });
  });

  it('should call onChange when role is selected', async () => {
    const onChange = jest.fn();
    (authService.getAvailableRoles as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRoles,
    });

    render(<RoleSelector value="" onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'editor');

    expect(onChange).toHaveBeenCalledWith('editor');
  });

  it('should be disabled when disabled prop is true', async () => {
    (authService.getAvailableRoles as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRoles,
    });

    render(<RoleSelector value="" onChange={jest.fn()} disabled />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });
  });
});

