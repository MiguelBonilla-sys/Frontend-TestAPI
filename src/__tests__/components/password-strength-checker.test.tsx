/**
 * Password Strength Checker Component Tests
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { PasswordStrengthChecker } from '@/components/password-strength-checker';

// Mock authService
jest.mock('@/services/auth.service', () => ({
  authService: {
    checkPasswordStrength: jest.fn(),
  },
}));

import { authService } from '@/services/auth.service';

describe('PasswordStrengthChecker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when password is empty', () => {
    const { container } = render(
      <PasswordStrengthChecker password="" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should display strength indicator when password is provided', async () => {
    (authService.checkPasswordStrength as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        strength: 'strong',
        score: 8,
        feedback: ['Good password'],
      },
    });

    render(<PasswordStrengthChecker password="StrongPassword123!" />);

    await waitFor(() => {
      expect(authService.checkPasswordStrength).toHaveBeenCalledWith(
        'StrongPassword123!'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Fuerte')).toBeInTheDocument();
    });
  });

  it('should display feedback when provided', async () => {
    (authService.checkPasswordStrength as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        strength: 'medium',
        score: 5,
        feedback: ['Add numbers', 'Add special characters'],
      },
    });

    render(<PasswordStrengthChecker password="MediumPass" />);

    await waitFor(() => {
      expect(screen.getByText('Add numbers')).toBeInTheDocument();
      expect(screen.getByText('Add special characters')).toBeInTheDocument();
    });
  });

  it('should debounce password strength checks', async () => {
    jest.useFakeTimers();
    (authService.checkPasswordStrength as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        strength: 'weak',
        score: 2,
        feedback: [],
      },
    });

    const { rerender } = render(
      <PasswordStrengthChecker password="a" />
    );

    // Change password multiple times quickly
    act(() => {
      rerender(<PasswordStrengthChecker password="ab" />);
    });
    act(() => {
      rerender(<PasswordStrengthChecker password="abc" />);
    });
    act(() => {
      rerender(<PasswordStrengthChecker password="abcd" />);
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      // Should only be called once after debounce
      expect(authService.checkPasswordStrength).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });
});

