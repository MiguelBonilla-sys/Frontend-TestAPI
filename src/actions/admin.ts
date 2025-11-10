'use server';

/**
 * Admin Server Actions
 * Server-side functions for administration operations
 */

import { cookies } from 'next/headers';
import type {
  UserListResponse,
  UserDetailResponse,
  ApiResponse,
  RoleResponse,
  SystemStatsResponse,
  PermissionResponse,
  PaginationParams,
} from '@/types/api';

const API_BASE_URL = process.env.API_BASE_URL || 'https://apiauthgames-production.up.railway.app';

interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  count?: number;
}

/**
 * Get all users action
 */
export async function getAllUsersAction(
  params?: PaginationParams
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

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: UserListResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener usuarios',
      };
    }

    return {
      success: true,
      message: data.message || 'Usuarios obtenidos exitosamente',
      data: data.data,
      count: data.count,
    };
  } catch (error) {
    console.error('Get all users action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get user by ID action
 */
export async function getUserByIdAction(userId: number): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: UserDetailResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener usuario',
      };
    }

    return {
      success: true,
      message: data.message || 'Usuario obtenido exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get user by ID action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get all roles action
 */
export async function getAllRolesAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/admin/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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
    console.error('Get all roles action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get system stats action
 */
export async function getSystemStatsAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: SystemStatsResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener estadísticas',
      };
    }

    return {
      success: true,
      message: data.message || 'Estadísticas obtenidas exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get system stats action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get my permissions action
 */
export async function getMyPermissionsAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/admin/my-permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: ApiResponse<PermissionResponse[]> = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener permisos',
      };
    }

    return {
      success: true,
      message: data.message || 'Permisos obtenidos exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get my permissions action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}
