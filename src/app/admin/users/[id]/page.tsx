'use client';

/**
 * Admin User Detail Page
 * Page for viewing user details
 */

import { useParams } from 'next/navigation';
import { AdminUserDetail } from '@/components/admin-user-detail';
import { useRequireAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';
import Link from 'next/link';

export default function AdminUserDetailPage() {
  useRequireAuth();
  const { canReadUsers } = usePermissions();
  const params = useParams();
  const userId = parseInt(params.id as string);

  if (!canReadUsers) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No tienes permisos para ver usuarios</p>
        </div>
      </div>
    );
  }

  if (isNaN(userId)) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">ID de usuario inválido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <Link
        href="/admin/users"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        ← Volver a usuarios
      </Link>
      <AdminUserDetail userId={userId} />
    </div>
  );
}

