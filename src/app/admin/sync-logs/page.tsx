'use client';

/**
 * Admin Sync Logs Page
 * Page for viewing sync logs
 */

import { SyncLogsList } from '@/components/sync-logs-list';
import { SyncLogsStatistics } from '@/components/sync-logs-statistics';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useRequireAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';

export default function AdminSyncLogsPage() {
  useRequireAuth();
  const { canReadSyncLogs } = usePermissions();

  if (!canReadSyncLogs) {
    return (
      <DashboardLayout title="Logs de Sincronización">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No tienes permisos para ver logs de sincronización</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Logs de Sincronización" description="Monitorea las sincronizaciones con APIs externas">
      <div className="space-y-8">
        <SyncLogsStatistics />
        <SyncLogsList />
      </div>
    </DashboardLayout>
  );
}

