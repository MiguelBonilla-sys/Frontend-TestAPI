'use client';

/**
 * Admin Users Page
 * Page for managing users
 */

import { AdminUsersList } from '@/components/admin-users-list';
import { useRequireAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';

export default function AdminUsersPage() {
  useRequireAuth();
  const { canReadUsers } = usePermissions();

  if (!canReadUsers) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No tienes permisos para ver usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AdminUsersList />
    </div>
  );
}

