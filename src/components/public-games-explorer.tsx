'use client';

import { useState, useEffect } from 'react';
import type { VideojuegoResponse, PaginatedResponse } from '@/types/api';

interface FilterState {
  categoria: string;
  precio_min: string;
  precio_max: string;
  valoracion_min: string;
  buscar: string;
}

export default function PublicGamesExplorer() {
  const [games, setGames] = useState<VideojuegoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 6,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<FilterState>({
    categoria: '',
    precio_min: '',
    precio_max: '',
    valoracion_min: '',
    buscar: '',
  });

  const fetchGames = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      // Add filters if they exist
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.precio_min) params.append('precio_min', filters.precio_min);
      if (filters.precio_max) params.append('precio_max', filters.precio_max);
      if (filters.valoracion_min) params.append('valoracion_min', filters.valoracion_min);
      if (filters.buscar) params.append('buscar', filters.buscar);

      const response = await fetch(`/api/proxy/api/videojuegos?${params.toString()}`);
      const data: PaginatedResponse<VideojuegoResponse> = await response.json();

      if (data.success && data.data) {
        setGames(data.data);
        if (data.pagination) {
          setPagination({
            page: data.pagination.current_page,
            per_page: data.pagination.per_page,
            total: data.pagination.total,
            pages: data.pagination.total_pages,
          });
        }
      } else {
        setError('No se pudieron cargar los videojuegos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchGames();
  };

  const handleClearFilters = () => {
    setFilters({
      categoria: '',
      precio_min: '',
      precio_max: '',
      valoracion_min: '',
      buscar: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="w-full">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={filters.buscar}
              onChange={(e) => handleFilterChange('buscar', e.target.value)}
              placeholder="Nombre del juego..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todas</option>
              <option value="RPG">RPG</option>
              <option value="Acción">Acción</option>
              <option value="Aventura">Aventura</option>
              <option value="Estrategia">Estrategia</option>
              <option value="Deportes">Deportes</option>
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valoración Mínima
            </label>
            <select
              value={filters.valoracion_min}
              onChange={(e) => handleFilterChange('valoracion_min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Cualquiera</option>
              <option value="5">5+ ⭐</option>
              <option value="7">7+ ⭐⭐</option>
              <option value="8">8+ ⭐⭐⭐</option>
              <option value="9">9+ ⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Mínimo ($)
            </label>
            <input
              type="number"
              value={filters.precio_min}
              onChange={(e) => handleFilterChange('precio_min', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Máximo ($)
            </label>
            <input
              type="number"
              value={filters.precio_max}
              onChange={(e) => handleFilterChange('precio_max', e.target.value)}
              placeholder="100"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Games Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando videojuegos...</p>
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {games.length} de {pagination.total} videojuegos
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {game.nombre}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Categoría:</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {game.categoria}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Precio:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${game.precio}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valoración:</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {game.valoracion}/10 ⭐
                      </span>
                    </div>

                    {game.desarrolladora && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Desarrolladora:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {game.desarrolladora.nombre}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="text-gray-700 font-medium">
                Página {pagination.page} de {pagination.pages}
              </span>

              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
