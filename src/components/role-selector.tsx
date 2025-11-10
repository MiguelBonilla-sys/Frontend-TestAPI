'use client';

/**
 * Role Selector Component
 * Selector for user roles during registration
 */

import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { RoleResponse } from '@/types/api';

interface RoleSelectorProps {
  value?: string;
  onChange: (role: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadRoles();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Seleccionar rol</option>
      {roles.map((role) => (
        <option key={role.id} value={role.name}>
          {role.name} {role.description ? `- ${role.description}` : ''}
        </option>
      ))}
    </select>
  );
}
