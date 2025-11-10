/**
 * use-2fa Hook
 * Custom hook for 2FA management
 */

import { useState, useCallback } from 'react';
import { twoFAService } from '@/services/2fa.service';
import type { Enable2FAResponse, TwoFAStatusData } from '@/types/api';

interface Use2FAReturn {
  is2FAEnabled: boolean;
  is2FAPending: boolean;
  isLoading: boolean;
  error: string | null;
  enable2FA: () => Promise<{ success: boolean; data?: unknown; message?: string }>;
  confirm2FA: (otpCode: string) => Promise<{ success: boolean; message?: string }>;
  disable2FA: () => Promise<{ success: boolean; message?: string }>;
  refreshStatus: () => Promise<void>;
}

export function use2FA(): Use2FAReturn {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await twoFAService.get2FAStatus();

      if (response.success && response.data) {
        setIs2FAEnabled(response.data.enabled);
        setIs2FAPending(response.data.enabled && !response.data.verified);
      } else {
        setError(response.message || 'Error al obtener estado de 2FA');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enable2FA = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await twoFAService.enable2FA();

      if (response.success && response.data) {
        setIs2FAPending(true);
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      }

      const errorMsg = response.message || 'Error al habilitar 2FA';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirm2FA = useCallback(async (otpCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await twoFAService.confirm2FA(otpCode);

      if (response.success) {
        setIs2FAEnabled(true);
        setIs2FAPending(false);
        return {
          success: true,
          message: response.message || '2FA confirmado exitosamente',
        };
      }

      const errorMsg = response.message || 'Error al confirmar 2FA';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disable2FA = useCallback(async () => {
    setIsLoading(true);
    setError(null);

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

      const errorMsg = response.message || 'Error al deshabilitar 2FA';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    is2FAEnabled,
    is2FAPending,
    isLoading,
    error,
    enable2FA,
    confirm2FA,
    disable2FA,
    refreshStatus,
  };
}
