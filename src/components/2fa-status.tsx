'use client';

/**
 * 2FA Status Component
 * Component for displaying and managing 2FA status
 */

import { useState } from 'react';
import { use2FA } from '@/hooks/use-2fa';
import { disable2FAAction } from '@/actions/2fa';

export function TwoFAStatus() {
  const { is2FAEnabled, is2FAPending, isLoading, refreshStatus, disable2FA: disable2FAHook } = use2FA();
  const [isDisabling, setIsDisabling] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const handleDisable = async () => {
    setIsDisabling(true);
    const result = await disable2FAAction();
    
    if (result.success) {
      await refreshStatus();
      setShowDisableConfirm(false);
    }
    
    setIsDisabling(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!is2FAEnabled && !is2FAPending) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Autenticación de Dos Factores</h3>
            <p className="text-sm text-gray-600">2FA no está habilitado</p>
          </div>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
            Deshabilitado
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`p-4 border rounded-lg ${is2FAPending ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Autenticación de Dos Factores</h3>
            <p className="text-sm text-gray-600">
              {is2FAPending
                ? '2FA está pendiente de confirmación'
                : '2FA está habilitado y activo'}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              is2FAPending
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {is2FAPending ? 'Pendiente' : 'Habilitado'}
          </span>
        </div>
      </div>

      {!showDisableConfirm ? (
        <button
          onClick={() => setShowDisableConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Deshabilitar 2FA
        </button>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
          <p className="text-sm text-red-800">
            ¿Estás seguro de que deseas deshabilitar 2FA? Esto reducirá la seguridad de tu cuenta.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDisable}
              disabled={isDisabling}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDisabling ? 'Deshabilitando...' : 'Sí, deshabilitar'}
            </button>
            <button
              onClick={() => setShowDisableConfirm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
