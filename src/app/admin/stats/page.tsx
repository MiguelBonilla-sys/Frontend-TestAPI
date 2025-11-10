'use client';

/**
 * Admin Stats Page
 * Page for viewing detailed system statistics
 */

import { AdminStatsDashboard } from '@/components/admin-stats-dashboard';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useRequireAuth } from '@/contexts/auth-context';

export default function AdminStatsPage() {
  useRequireAuth();

  return (
    <DashboardLayout title="Estadísticas del Sistema" description="Vista detallada de las estadísticas del sistema">
      <AdminStatsDashboard />
    </DashboardLayout>
  );
}

