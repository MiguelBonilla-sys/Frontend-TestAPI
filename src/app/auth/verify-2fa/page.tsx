'use client';

/**
 * Verify 2FA Page
 * Page for verifying 2FA code after login
 */

import { useSearchParams } from 'next/navigation';
import { TwoFAVerify } from '@/components/2fa-verify';

export default function Verify2FAPage() {
  const searchParams = useSearchParams();
  const tempToken = searchParams.get('temp_token') || '';
  const challengeId = searchParams.get('challenge_id') || undefined;

  if (!tempToken) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Token de verificación no válido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <TwoFAVerify tempToken={tempToken} challengeId={challengeId} />
    </div>
  );
}

