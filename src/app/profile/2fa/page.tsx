'use client';

/**
 * 2FA Setup Page
 * Page for setting up two-factor authentication
 */

import { TwoFASetup } from '@/components/2fa-setup';
import Link from 'next/link';

export default function TwoFASetupPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/profile"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Volver al perfil
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <TwoFASetup />
      </div>
    </div>
  );
}

