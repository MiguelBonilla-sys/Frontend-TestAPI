/**
 * Authentication Flow Integration Tests
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/contexts/auth-context';

// Mock apiClient
jest.mock('@/lib/api-client', () => {
  const actualModule = jest.requireActual('@/lib/api-client');
  return {
    ...actualModule,
    apiClient: {
      post: jest.fn(),
      get: jest.fn(),
      setTokens: jest.fn(),
      clearTokens: jest.fn(),
      getAccessToken: jest.fn(),
    },
  };
});

import { apiClient } from '@/lib/api-client';

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle successful login', async () => {
    const mockLoginResponse = {
      success: true,
      message: 'Login exitoso',
      data: {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          email: 'superadmin@example.com',
          role: 'superadmin',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
        },
      },
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockLoginResponse);

    const TestComponent = () => {
      const { login } = require('@/contexts/auth-context').useAuth();
      const [result, setResult] = React.useState<any>(null);

      React.useEffect(() => {
        login({
          email: 'superadmin@example.com',
          password: 'SuperAdmin123!',
        }).then(setResult);
      }, []);

      return <div>{result?.success ? 'Logged in' : 'Not logged in'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        {
          email: 'superadmin@example.com',
          password: 'SuperAdmin123!',
        },
        { useAuth: false }
      );
    });

    await waitFor(() => {
      expect(apiClient.setTokens).toHaveBeenCalledWith(
        'access-token-123',
        'refresh-token-123'
      );
    });
  });

  it('should handle login failure', async () => {
    const mockErrorResponse = {
      success: false,
      message: 'Credenciales inválidas',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockErrorResponse);

    const TestComponent = () => {
      const { login } = require('@/contexts/auth-context').useAuth();
      const [result, setResult] = React.useState<any>(null);

      React.useEffect(() => {
        login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }).then(setResult);
      }, []);

      return <div>{result?.message || 'No error'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });
});

