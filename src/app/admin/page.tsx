'use client';

/**
 * Admin Dashboard Page
 * Main admin dashboard page
 */

import { AdminStatsDashboard } from '@/components/admin-stats-dashboard';
import Link from 'next/link';
import { usePermissions } from '@/hooks/use-permissions';
import { useRequireAuth } from '@/contexts/auth-context';

export default function AdminPage() {
  useRequireAuth();
  const { canReadUsers, canReadSyncLogs } = usePermissions();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-1">Gestiona usuarios, roles y configuración del sistema</p>
      </div>

      <AdminStatsDashboard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canReadUsers && (
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios</h3>
            <p className="text-sm text-gray-600">Gestiona usuarios del sistema</p>
          </Link>
        )}

        <Link
          href="/admin/roles"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Roles</h3>
          <p className="text-sm text-gray-600">Ver roles y permisos</p>
        </Link>

        <Link
          href="/admin/stats"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
          <p className="text-sm text-gray-600">Ver estadísticas detalladas</p>
        </Link>

        {canReadSyncLogs && (
          <Link
            href="/admin/sync-logs"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Logs de Sincronización</h3>
            <p className="text-sm text-gray-600">Ver logs de sincronización</p>
          </Link>
        )}
      </div>
    </div>
  );
}

