'use client';

/**
 * Videojuego Import Component
 * Component for importing videojuegos from RAWG API
 */

import { useState } from 'react';
import { videojuegosService } from '@/services/videojuegos.service';
import type { ImportBatchRequest, ImportBatchResult } from '@/types/api';

export function VideojuegoImport() {
  const [count, setCount] = useState(6);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportBatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const response = await videojuegosService.importBatch({}, count);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || 'Error al importar videojuegos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Importar Videojuegos desde RAWG</h2>
        <p className="text-gray-600">
          Importa videojuegos populares desde la API de RAWG. Los juegos que ya existen serán omitidos automáticamente.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de videojuegos a importar
          </label>
          <input
            id="count"
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 6)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Mínimo: 1, Máximo: 50</p>
        </div>

        <button
          onClick={handleImport}
          disabled={isImporting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isImporting ? 'Importando...' : 'Importar Videojuegos'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Importación Completada</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-medium">Exitosos:</span>
                <span className="ml-2 text-green-900 font-bold">{result.success.length}</span>
              </div>
              <div>
                <span className="text-red-700 font-medium">Fallidos:</span>
                <span className="ml-2 text-red-900 font-bold">{result.failed.length}</span>
              </div>
              <div>
                <span className="text-yellow-700 font-medium">Omitidos:</span>
                <span className="ml-2 text-yellow-900 font-bold">{result.skipped.length}</span>
              </div>
            </div>
          </div>

          {result.success.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Videojuegos Importados Exitosamente</h4>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {result.success.map((game) => (
                    <li key={game.id} className="p-4">
                      <p className="font-medium text-gray-900">{game.nombre}</p>
                      <p className="text-sm text-gray-600">{game.categoria}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result.failed.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Errores en la Importación</h4>
              <div className="bg-red-50 rounded-lg border border-red-200 overflow-hidden">
                <ul className="divide-y divide-red-200">
                  {result.failed.map((item, index) => (
                    <li key={index} className="p-4">
                      <p className="font-medium text-red-900">ID: {item.external_id}</p>
                      <p className="text-sm text-red-700">{item.error}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
