'use server';

/**
 * Authentication Server Actions
 * Server-side functions for authentication operations
 * These run on the server and can securely handle tokens
 */

import { cookies } from 'next/headers';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  RefreshResponse,
  UserResponse,
  PasswordStrengthResponse,
  ApiResponse,
  RoleResponse,
  RolePermissionsApiResponse,
} from '@/types/api';

const API_BASE_URL = process.env.API_BASE_URL || 'https://apiauthgames-production.up.railway.app';

interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Login action - authenticates user and sets cookies
 */
export async function loginAction(credentials: LoginRequest): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al iniciar sesión',
      };
    }

    // Set secure HTTP-only cookies
    const cookieStore = await cookies();

    cookieStore.set('access_token', data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expires_in,
      path: '/',
    });

    cookieStore.set('refresh_token', data.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set user info cookie (non-httpOnly so client can read it)
    cookieStore.set('user', JSON.stringify(data.data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      success: true,
      message: data.message || 'Login exitoso',
      data: data.data.user,
    };
  } catch (error) {
    console.error('Login action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Register action - creates new user and logs them in
 */
export async function registerAction(data: RegisterRequest): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData: RegisterResponse = await response.json();

    if (!response.ok || !responseData.success) {
      return {
        success: false,
        message: responseData.message || 'Error al registrar usuario',
      };
    }

    // After successful registration, login automatically
    const loginResult = await loginAction({
      email: data.email,
      password: data.password,
    });

    return loginResult;
  } catch (error) {
    console.error('Register action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Logout action - clears cookies and invalidates tokens
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Call API to invalidate refresh token
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error('Error calling logout endpoint:', error);
        // Continue anyway to clear cookies
      }
    }

    // Clear all auth cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user');

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    };
  } catch (error) {
    console.error('Logout action error:', error);
    return {
      success: false,
      message: 'Error al cerrar sesión',
    };
  }
}

/**
 * Refresh token action - gets new access token
 */
export async function refreshTokenAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token available',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data: RefreshResponse = await response.json();

    if (!response.ok || !data.success) {
      // Clear invalid tokens
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      cookieStore.delete('user');

      return {
        success: false,
        message: data.message || 'Failed to refresh token',
      };
    }

    // Update cookies with new tokens
    cookieStore.set('access_token', data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expires_in,
      path: '/',
    });

    cookieStore.set('refresh_token', data.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: data.data.user,
    };
  } catch (error) {
    console.error('Refresh token action error:', error);
    return {
      success: false,
      message: 'Error refreshing token',
    };
  }
}

/**
 * Get current user action - retrieves authenticated user info
 */
export async function getCurrentUserAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Token might be expired, try to refresh
      if (response.status === 401) {
        const refreshResult = await refreshTokenAction();
        if (refreshResult.success) {
          // Retry with new token
          return getCurrentUserAction();
        }
      }

      return {
        success: false,
        message: data.message || 'Failed to get user info',
      };
    }

    return {
      success: true,
      message: 'User info retrieved',
      data: data.data,
    };
  } catch (error) {
    console.error('Get current user action error:', error);
    return {
      success: false,
      message: 'Error getting user info',
    };
  }
}

/**
 * Change password action
 */
export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al cambiar contraseña',
      };
    }

    return {
      success: true,
      message: data.message || 'Contraseña cambiada exitosamente',
    };
  } catch (error) {
    console.error('Change password action error:', error);
    return {
      success: false,
      message: 'Error al cambiar contraseña',
    };
  }
}

/**
 * Check password strength action
 */
export async function checkPasswordStrengthAction(
  password: string
): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-password-strength`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data: PasswordStrengthResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al verificar contraseña',
      };
    }

    return {
      success: true,
      message: 'Fortaleza de contraseña verificada',
      data: data.data,
    };
  } catch (error) {
    console.error('Check password strength action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get available roles action
 */
export async function getAvailableRolesAction(): Promise<ActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<RoleResponse[]> = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener roles',
      };
    }

    return {
      success: true,
      message: data.message || 'Roles obtenidos exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get available roles action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get role permissions action
 */
export async function getRolePermissionsAction(
  roleName: string
): Promise<ActionResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/roles/${roleName}/permissions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data: RolePermissionsApiResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener permisos del rol',
      };
    }

    return {
      success: true,
      message: data.message || 'Permisos obtenidos exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get role permissions action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}
