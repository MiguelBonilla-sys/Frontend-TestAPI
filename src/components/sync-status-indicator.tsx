'use client';

/**
 * Sync Status Indicator Component
 * Component for displaying sync task status
 */

import { useEffect, useState } from 'react';
import { videojuegosService } from '@/services/videojuegos.service';
import type { SyncStatusData } from '@/types/api';

interface SyncStatusIndicatorProps {
  taskId: string;
  onComplete?: () => void;
  pollInterval?: number;
}

export function SyncStatusIndicator({
  taskId,
  onComplete,
  pollInterval = 2000,
}: SyncStatusIndicatorProps) {
  const [status, setStatus] = useState<SyncStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await videojuegosService.getSyncStatus(taskId);
        if (response.success && response.data) {
          setStatus(response.data);
          setIsLoading(false);

          if (response.data.status === 'completed' || response.data.status === 'failed') {
            if (intervalId) clearInterval(intervalId);
            onComplete?.();
          }
        }
      } catch (error) {
        console.error('Error checking sync status:', error);
        setIsLoading(false);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, pollInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId, pollInterval, onComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        <span>Verificando estado...</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'pending':
        return 'En cola';
      case 'running':
        return 'En progreso';
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      default:
        return status.status;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {status.progress !== undefined && (
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {status.message && (
        <p className="text-sm text-gray-600">{status.message}</p>
      )}
    </div>
  );
}

