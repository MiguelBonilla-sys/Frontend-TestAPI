'use client';

/**
 * Videojuego Enriquecido Component
 * Component for displaying enriched videojuego data with RAWG information
 */

import { useEffect, useState } from 'react';
import { videojuegosService } from '@/services/videojuegos.service';
import type { VideojuegoEnriquecidoData } from '@/types/api';

interface VideojuegoEnriquecidoProps {
  videojuegoId: number;
}

export function VideojuegoEnriquecido({ videojuegoId }: VideojuegoEnriquecidoProps) {
  const [data, setData] = useState<VideojuegoEnriquecidoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [videojuegoId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await videojuegosService.getEnriquecido(videojuegoId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar videojuego enriquecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Videojuego no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{data.nombre}</h2>
        <p className="text-gray-600 mt-1">{data.categoria}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Precio</dt>
              <dd className="text-lg font-semibold text-gray-900">${data.precio.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Valoración</dt>
              <dd className="text-lg font-semibold text-gray-900">{data.valoracion}/10</dd>
            </div>
            {data.desarrolladora && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Desarrolladora</dt>
                <dd className="text-lg text-gray-900">{data.desarrolladora.nombre}</dd>
              </div>
            )}
          </dl>
        </div>

        {data.plataformas && data.plataformas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plataformas</h3>
            <div className="flex flex-wrap gap-2">
              {data.plataformas.map((platform, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.screenshots && data.screenshots.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Capturas de Pantalla</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

