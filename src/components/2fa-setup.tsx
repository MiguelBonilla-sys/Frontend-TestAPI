'use client';

/**
 * 2FA Setup Component
 * Component for setting up two-factor authentication
 */

import { useState } from 'react';
import { use2FA } from '@/hooks/use-2fa';
import { confirm2FAAction } from '@/actions/2fa';

export function TwoFASetup() {
  const { enable2FA, confirm2FA, isLoading, error } = use2FA();
  const [step, setStep] = useState<'initial' | 'qr' | 'confirm'>('initial');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleEnable = async () => {
    const result = await enable2FA();
    if (result.success && result.data) {
      const data = result.data as { qr_code?: string; secret?: string; message: string };
      setQrCode(data.qr_code || null);
      setSecret(data.secret || null);
      setStep('qr');
    }
  };

  const handleConfirm = async () => {
    if (otpCode.length !== 6) {
      setConfirmError('El código OTP debe tener 6 dígitos');
      return;
    }

    setConfirmError(null);
    const result = await confirm2FAAction(otpCode);
    
    if (result.success) {
      setStep('confirm');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setConfirmError(result.message || 'Error al confirmar 2FA');
    }
  };

  if (step === 'confirm') {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold text-green-800">2FA Configurado Exitosamente</h3>
        </div>
        <p className="text-green-700">Tu autenticación de dos factores ha sido configurada correctamente.</p>
      </div>
    );
  }

  if (step === 'qr') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Escanea el código QR</h3>
          <p className="text-sm text-blue-700 mb-4">
            Usa una aplicación de autenticación (como Google Authenticator o Authy) para escanear este código.
          </p>
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
            </div>
          )}
          {secret && (
            <div className="p-3 bg-white rounded border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Código secreto (si no puedes escanear):</p>
              <p className="font-mono text-sm font-semibold">{secret}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700 mb-2">
            Ingresa el código de 6 dígitos de tu aplicación
          </label>
          <input
            id="otp-code"
            type="text"
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(value);
              setConfirmError(null);
            }}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-2xl tracking-widest"
          />
          {confirmError && (
            <p className="mt-2 text-sm text-red-600">{confirmError}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={otpCode.length !== 6 || isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button
            onClick={() => setStep('initial')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurar Autenticación de Dos Factores</h3>
        <p className="text-sm text-gray-600">
          Añade una capa adicional de seguridad a tu cuenta. Necesitarás una aplicación de autenticación como Google Authenticator.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleEnable}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Configurando...' : 'Habilitar 2FA'}
      </button>
    </div>
  );
}
