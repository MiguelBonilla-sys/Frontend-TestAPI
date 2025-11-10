'use client';

/**
 * Admin Stats Page
 * Page for viewing detailed system statistics
 */

import { AdminStatsDashboard } from '@/components/admin-stats-dashboard';
import { useRequireAuth } from '@/contexts/auth-context';

export default function AdminStatsPage() {
  useRequireAuth();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AdminStatsDashboard />
    </div>
  );
}

