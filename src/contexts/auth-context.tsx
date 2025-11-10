'use client';

/**
 * Authentication Context
 * Manages authentication state and provides auth methods
 * Compatible with React 19
 */

import { createContext, useContext, useEffect, useState, useCallback, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { twoFAService } from '@/services/2fa.service';
import { adminService } from '@/services/admin.service';
import type {
  UserResponse,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  LogoutResponse,
  TwoFAStatusData,
  PermissionResponse,
} from '@/types/api';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  is2FAEnabled: boolean;
  is2FAPending: boolean;
  permissions: PermissionResponse[];
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  enable2FA: () => Promise<{ success: boolean; message?: string; data?: unknown }>;
  disable2FA: () => Promise<{ success: boolean; message?: string }>;
  get2FAStatus: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);

  // Load user from localStorage on mount, then try to refresh from API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');

        if (storedUser && accessToken) {
          // Load from localStorage first for immediate UI
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
          // Then try to refresh from API to sync with cookies (async, don't block)
          refreshUser().catch((error) => {
            // If refresh fails, keep the localStorage user
            console.error('Error refreshing user from API:', error);
          });
        } else {
          // No localStorage, try to get from API (cookies might have token)
          try {
            const response = await apiClient.get<UserResponse>('/auth/me');
            if (response.success && response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
              // Refresh 2FA status and permissions
              const [statusResponse, permissionsResponse] = await Promise.all([
                twoFAService.get2FAStatus().catch(() => ({ success: false, data: { enabled: false } })),
                adminService.getMyPermissions().catch(() => ({ success: false, data: { permissions: [] } })),
              ]);
              if (statusResponse.success && statusResponse.data) {
                setIs2FAEnabled(statusResponse.data.enabled || false);
                setIs2FAPending(statusResponse.data.enabled && 'verified' in statusResponse.data && statusResponse.data.verified === false);
              }
              if (permissionsResponse.success && permissionsResponse.data) {
                setPermissions(permissionsResponse.data.permissions || []);
              }
            }
          } catch (error) {
            // No valid session
            console.error('No valid session found:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        setIsLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh user data from API
  const refreshUser = useCallback(async () => {
    try {
      const response = await apiClient.get<UserResponse>('/auth/me');

      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        // Refresh 2FA status and permissions
        await get2FAStatus();
        await refreshPermissions();
      } else {
        // Token is invalid, clear everything
        setUser(null);
        setIs2FAEnabled(false);
        setIs2FAPending(false);
        setPermissions([]);
        apiClient.clearTokens();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setIs2FAEnabled(false);
      setIs2FAPending(false);
      setPermissions([]);
      apiClient.clearTokens();
    }
  }, []);

  // Get 2FA status
  const get2FAStatus = useCallback(async () => {
    if (!user) return;

    try {
      const response = await twoFAService.get2FAStatus();

      if (response.success && response.data) {
        setIs2FAEnabled(response.data.enabled);
        setIs2FAPending(response.data.enabled && !response.data.verified);
      }
    } catch (error) {
      console.error('Error getting 2FA status:', error);
    }
  }, [user]);

  // Refresh permissions
  const refreshPermissions = useCallback(async () => {
    if (!user) return;

    try {
      const response = await adminService.getMyPermissions();

      if (response.success && response.data) {
        // El backend retorna un objeto con permissions dentro
        setPermissions(response.data.permissions || []);
      }
    } catch (error) {
      console.error('Error refreshing permissions:', error);
      setPermissions([]);
    }
  }, [user]);

  // Enable 2FA
  const enable2FA = useCallback(async () => {
    try {
      const response = await twoFAService.enable2FA();

      if (response.success && response.data) {
        setIs2FAPending(true);
        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Error al habilitar 2FA',
      };
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, []);

  // Disable 2FA
  const disable2FA = useCallback(async () => {
    try {
      const response = await twoFAService.disable2FA();

      if (response.success) {
        setIs2FAEnabled(false);
        setIs2FAPending(false);
        return {
          success: true,
          message: response.message || '2FA deshabilitado exitosamente',
        };
      }

      return {
        success: false,
        message: response.message || 'Error al deshabilitar 2FA',
      };
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<TokenResponse>(
        '/auth/login',
        credentials,
        { useAuth: false }
      );

      if (response.success && response.data) {
        const { access_token, refresh_token, user: userData } = response.data;

        // Store tokens
        apiClient.setTokens(access_token, refresh_token);

        // Store user
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        return {
          success: true,
          message: response.message || 'Login exitoso',
        };
      }

      return {
        success: false,
        message: response.message || 'Error al iniciar sesión',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<UserResponse>(
        '/auth/register',
        data,
        { useAuth: false }
      );

      if (response.success && response.data) {
        // After successful registration, login automatically
        const loginResult = await login({
          email: data.email,
          password: data.password,
        });

        return loginResult;
      }

      return {
        success: false,
        message: response.message || 'Error al registrar usuario',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      await apiClient.post<LogoutResponse>('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setIs2FAEnabled(false);
      setIs2FAPending(false);
      setPermissions([]);
      apiClient.clearTokens();
    }
  }, []);

  // Load 2FA status and permissions when user changes
  useEffect(() => {
    if (user) {
      get2FAStatus();
      refreshPermissions();
    }
  }, [user, get2FAStatus, refreshPermissions]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    is2FAEnabled,
    is2FAPending,
    permissions,
    login,
    register,
    logout,
    refreshUser,
    enable2FA,
    disable2FA,
    get2FAStatus,
    refreshPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Compatible with React 19
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to require authentication
 * Throws if user is not authenticated
 */
export function useRequireAuth(): AuthContextType {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = '/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}
