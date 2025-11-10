'use client';

/**
 * 2FA Verify Component
 * Component for verifying 2FA code during login
 */

import { useState } from 'react';
import { twoFAService } from '@/services/2fa.service';
import { useRouter } from 'next/navigation';

interface TwoFAVerifyProps {
  tempToken: string;
  challengeId?: string;
  onSuccess?: () => void;
}

export function TwoFAVerify({ tempToken, challengeId, onSuccess }: TwoFAVerifyProps) {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      setError('El código OTP debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await twoFAService.verify2FA(tempToken, otpCode, challengeId);

      if (response.success && response.data) {
        // Store tokens
        const { access_token, refresh_token, user } = response.data;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));
        }

        onSuccess?.();
        router.push('/dashboard');
      } else {
        setError(response.message || 'Código OTP inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación de Dos Factores</h2>
        <p className="text-gray-600">
          Ingresa el código de 6 dígitos de tu aplicación de autenticación
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700 mb-2">
            Código OTP
          </label>
          <input
            id="otp-code"
            type="text"
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(value);
              setError(null);
            }}
            placeholder="000000"
            maxLength={6}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-2xl tracking-widest"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={otpCode.length !== 6 || isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}
