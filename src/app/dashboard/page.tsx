'use client';

/**
 * Dashboard Page
 * Main dashboard after login - clean and organized
 */

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { videojuegosService } from '@/services/videojuegos.service';
import { DashboardLayout } from '@/components/dashboard-layout';
import type { EstadisticasData } from '@/types/api';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<EstadisticasData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await videojuegosService.getStatistics();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user.email}
        </h2>
        <p className="text-gray-600">
          Gestiona tu catálogo de videojuegos desde aquí
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Rol: {user.role}
          </span>
          {user.is_active && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ Activo
            </span>
          )}
        </div>
      </div>

      {/* Statistics Section */}
        {loadingStats ? (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Cargando estadísticas...</p>
            </div>
          </div>
        ) : stats ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Resumen del Catálogo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Videojuegos
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.total_videojuegos}
                    </p>
                  </div>
                  <div className="text-4xl">🎮</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Categorías
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.categorias_unicas}
                    </p>
                  </div>
                  <div className="text-4xl">📁</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Precio Promedio
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${stats.precio_promedio.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Valoración Media
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.valoracion_promedio.toFixed(1)}
                      <span className="text-lg text-gray-500">/10</span>
                    </p>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

      {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/profile"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mi Perfil</h4>
                  <p className="text-sm text-gray-600">Ver y editar tu perfil</p>
                </div>
              </div>
            </Link>

            <Link
              href="/videojuegos/import"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Importar Videojuegos</h4>
                  <p className="text-sm text-gray-600">Agregar juegos al catálogo</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/sync-logs"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Logs de Sincronización</h4>
                  <p className="text-sm text-gray-600">Ver historial de importaciones</p>
                </div>
              </div>
            </Link>

            {user.role === 'superadmin' && (
              <>
                <Link
                  href="/admin/users"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Gestionar Usuarios</h4>
                      <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/roles"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Roles y Permisos</h4>
                      <p className="text-sm text-gray-600">Configurar permisos del sistema</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/stats"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border border-gray-200 hover:border-indigo-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Estadísticas del Sistema</h4>
                      <p className="text-sm text-gray-600">Ver métricas y estadísticas</p>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">💡 ¿Necesitas ayuda?</h4>
        <p className="text-sm text-blue-800">
          Desde aquí puedes gestionar tu catálogo de videojuegos, importar nuevos juegos desde APIs externas,
          y si eres administrador, gestionar usuarios y permisos del sistema.
        </p>
      </div>
    </DashboardLayout>
  );
}
