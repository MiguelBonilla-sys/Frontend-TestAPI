'use server';

/**
 * 2FA Server Actions
 * Server-side functions for two-factor authentication operations
 */

import { cookies } from 'next/headers';
import type {
  Enable2FAResponse,
  Confirm2FAResponse,
  TwoFAStatusResponse,
  ApiResponse,
} from '@/types/api';

const API_BASE_URL = process.env.API_BASE_URL || 'https://apiauthgames-production.up.railway.app';

interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Enable 2FA action
 */
export async function enable2FAAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/enable-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: Enable2FAResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al habilitar 2FA',
      };
    }

    return {
      success: true,
      message: data.message || '2FA habilitado exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Enable 2FA action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Confirm 2FA setup action
 */
export async function confirm2FAAction(otpCode: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/confirm-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        temp_token: '', // Server will get from session
        otp_code: otpCode,
      }),
    });

    const data: Confirm2FAResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al confirmar 2FA',
      };
    }

    return {
      success: true,
      message: data.message || '2FA confirmado exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Confirm 2FA action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Get 2FA status action
 */
export async function get2FAStatusAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/2fa/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: TwoFAStatusResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al obtener estado de 2FA',
      };
    }

    return {
      success: true,
      message: data.message || 'Estado de 2FA obtenido exitosamente',
      data: data.data,
    };
  } catch (error) {
    console.error('Get 2FA status action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

/**
 * Disable 2FA action
 */
export async function disable2FAAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/disable-2fa`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Error al deshabilitar 2FA',
      };
    }

    return {
      success: true,
      message: data.message || '2FA deshabilitado exitosamente',
    };
  } catch (error) {
    console.error('Disable 2FA action error:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}
