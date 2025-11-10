'use client';

/**
 * Sync Logs Statistics Component
 * Component for displaying sync logs statistics
 */

import { useEffect, useState } from 'react';
import { syncLogsService } from '@/services/sync-logs.service';
import type { SyncLogStatisticsData } from '@/types/api';

interface SyncLogsStatisticsProps {
  days?: number;
  apiSource?: 'rawg' | 'steam' | 'igdb';
}

export function SyncLogsStatistics({ days = 7, apiSource }: SyncLogsStatisticsProps) {
  const [stats, setStats] = useState<SyncLogStatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [days, apiSource]);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await syncLogsService.getLogStatistics(days, apiSource);
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
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
      title: 'Total',
      value: stats.total,
      color: 'blue',
      icon: '📊',
    },
    {
      title: 'Exitosos',
      value: stats.successful,
      color: 'green',
      icon: '✅',
    },
    {
      title: 'Fallidos',
      value: stats.failed,
      color: 'red',
      icon: '❌',
    },
    {
      title: 'Tasa de Éxito',
      value: `${stats.success_rate.toFixed(1)}%`,
      color: 'purple',
      icon: '📈',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Estadísticas de Sincronización
        </h2>
        <span className="text-sm text-gray-600">Últimos {days} días</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              card.color === 'blue'
                ? 'border-blue-500'
                : card.color === 'green'
                ? 'border-green-500'
                : card.color === 'red'
                ? 'border-red-500'
                : 'border-purple-500'
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

      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <span className="font-semibold">{stats.pending}</span> sincronizaciones pendientes
          </p>
        </div>
      )}
    </div>
  );
}

