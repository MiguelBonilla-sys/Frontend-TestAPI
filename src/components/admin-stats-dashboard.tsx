'use client';

/**
 * Admin Stats Dashboard Component
 * Component for displaying system statistics
 */

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import type { SystemStatsData } from '@/types/api';

export function AdminStatsDashboard() {
  const { getSystemStats, isLoading, error } = useAdmin();
  const [stats, setStats] = useState<SystemStatsData | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const result = await getSystemStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Error al cargar estadísticas'}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Usuarios',
      value: stats.total_users,
      color: 'blue',
      icon: '👥',
    },
    {
      title: 'Total de Videojuegos',
      value: stats.total_videojuegos,
      color: 'green',
      icon: '🎮',
    },
    {
      title: 'Total de Desarrolladoras',
      value: stats.total_desarrolladoras,
      color: 'purple',
      icon: '🏢',
    },
    {
      title: 'Roles Activos',
      value: Object.keys(stats.roles_count).length,
      color: 'orange',
      icon: '🔑',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Estadísticas del Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              card.color === 'blue'
                ? 'border-blue-500'
                : card.color === 'green'
                ? 'border-green-500'
                : card.color === 'purple'
                ? 'border-purple-500'
                : 'border-orange-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {stats.roles_count && Object.keys(stats.roles_count).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Roles</h3>
          <div className="space-y-2">
            {Object.entries(stats.roles_count).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">{role}</span>
                <span className="text-sm font-semibold text-gray-900">{count} usuarios</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
