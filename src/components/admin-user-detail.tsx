'use client';

/**
 * Admin User Detail Component
 * Component for displaying user details
 */

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { getRoleDisplayName, getRoleDescription } from '@/lib/roles';
import type { UserResponse } from '@/types/api';

interface AdminUserDetailProps {
  userId: number;
}

export function AdminUserDetail({ userId }: AdminUserDetailProps) {
  const { getUserById, isLoading, error } = useAdmin();
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    const result = await getUserById(userId);
    if (result.success && result.data) {
      setUser(result.data);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Usuario no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Detalles del Usuario</h2>
        <p className="text-gray-600">ID: {user.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <div className="mt-1">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {getRoleDisplayName(user.role)}
            </span>
            <p className="mt-1 text-sm text-gray-600">{getRoleDescription(user.role)}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <div className="mt-1">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                user.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.created_at).toLocaleString('es-ES')}
          </p>
        </div>

        {user.updated_at && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user.updated_at).toLocaleString('es-ES')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
