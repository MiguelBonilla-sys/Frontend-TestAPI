'use client';

/**
 * Permissions Display Component
 * Component for displaying user permissions
 */

import { usePermissions } from '@/hooks/use-permissions';

interface PermissionsDisplayProps {
  showTitle?: boolean;
}

export function PermissionsDisplay({ showTitle = true }: PermissionsDisplayProps) {
  const { permissions } = usePermissions();

  if (permissions.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">No tienes permisos asignados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900">Tus Permisos</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {permissions.map((permission, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900 mb-1">{permission.name}</h4>
            <p className="text-sm text-gray-600">{permission.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
