'use client';

/**
 * Admin Roles Page
 * Page for viewing roles and permissions
 */

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/contexts/auth-context';
import { authService } from '@/services/auth.service';
import { PermissionsDisplay } from '@/components/permissions-display';
import type { RoleResponse, PermissionResponse } from '@/types/api';

export default function AdminRolesPage() {
  useRequireAuth();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<{ role: RoleResponse; permissions: PermissionResponse[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions();
    }
  }, [selectedRole]);

  const loadRoles = async () => {
    try {
      const response = await authService.getAvailableRoles();
      if (response.success && response.data) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRolePermissions = async () => {
    if (!selectedRole) return;

    try {
      const response = await authService.getRolePermissions(selectedRole);
      if (response.success && response.data) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Roles y Permisos</h1>
        <p className="text-gray-600 mt-1">Gestiona roles y sus permisos asociados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Roles Disponibles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedRole === role.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                )}
                {role.user_count !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">{role.user_count} usuarios</p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedRole ? `Permisos de ${selectedRole}` : 'Selecciona un rol'}
          </h2>
          {selectedRole && permissions && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Rol: {permissions.role.name}</h3>
                {permissions.role.description && (
                  <p className="text-sm text-gray-600">{permissions.role.description}</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Permisos:</h4>
                <div className="space-y-2">
                  {permissions.permissions.map((perm: PermissionResponse, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{perm.name}</p>
                      <p className="text-sm text-gray-600">{perm.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!selectedRole && (
            <p className="text-gray-500 text-center py-8">
              Selecciona un rol para ver sus permisos
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Permisos</h2>
        <PermissionsDisplay />
      </div>
    </div>
  );
}

