'use client';

/**
 * Admin Sync Logs Page
 * Page for viewing sync logs
 */

import { SyncLogsList } from '@/components/sync-logs-list';
import { SyncLogsStatistics } from '@/components/sync-logs-statistics';
import { useRequireAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';

export default function AdminSyncLogsPage() {
  useRequireAuth();
  const { canReadSyncLogs } = usePermissions();

  if (!canReadSyncLogs) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No tienes permisos para ver logs de sincronización</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Logs de Sincronización</h1>
        <p className="text-gray-600 mt-1">Monitorea las sincronizaciones con APIs externas</p>
      </div>

      <SyncLogsStatistics />

      <SyncLogsList />
    </div>
  );
}

