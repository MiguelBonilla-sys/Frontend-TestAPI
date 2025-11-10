'use client';

import { useState, useEffect } from 'react';
import type { DesarrolladoraResponse, PaginatedResponse } from '@/types/api';

interface FilterState {
  pais: string;
  buscar: string;
}

export default function PublicDevelopersExplorer() {
  const [developers, setDevelopers] = useState<DesarrolladoraResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 6,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<FilterState>({
    pais: '',
    buscar: '',
  });

  const fetchDevelopers = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      // Add filters if they exist
      if (filters.pais) params.append('pais', filters.pais);
      if (filters.buscar) params.append('buscar', filters.buscar);

      const response = await fetch(`/api/proxy/api/desarrolladoras?${params.toString()}`);
      const data: PaginatedResponse<DesarrolladoraResponse> = await response.json();

      if (data.success && data.data) {
        setDevelopers(data.data);
        if (data.pagination) {
          setPagination({
            page: data.pagination.current_page,
            per_page: data.pagination.per_page,
            total: data.pagination.total,
            pages: data.pagination.total_pages,
          });
        }
      } else {
        setError('No se pudieron cargar las desarrolladoras');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchDevelopers();
  };

  const handleClearFilters = () => {
    setFilters({
      pais: '',
      buscar: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="w-full">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={filters.buscar}
              onChange={(e) => handleFilterChange('buscar', e.target.value)}
              placeholder="Nombre de la desarrolladora..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <select
              value={filters.pais}
              onChange={(e) => handleFilterChange('pais', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Japón">Japón</option>
              <option value="Polonia">Polonia</option>
              <option value="Francia">Francia</option>
              <option value="Reino Unido">Reino Unido</option>
              <option value="Canadá">Canadá</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
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

      {/* Developers Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando desarrolladoras...</p>
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {developers.length} de {pagination.total} desarrolladoras
          </div>

          {/* Developers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {developers.map((developer) => (
              <div
                key={developer.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {developer.nombre}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {developer.pais && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">País:</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {developer.pais}
                        </span>
                      </div>
                    )}

                    {developer.fundacion && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fundación:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {new Date(developer.fundacion).getFullYear()}
                        </span>
                      </div>
                    )}

                    {developer.sitio_web && (
                      <div className="mt-4">
                        <a
                          href={developer.sitio_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          <span>Sitio Web</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
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
