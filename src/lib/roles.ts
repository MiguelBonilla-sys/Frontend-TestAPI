/**
 * Roles Utilities
 * Constants and helper functions for user roles
 */

/**
 * Available roles in the system
 */
export const ROLES = {
  DESARROLLADORA: 'desarrolladora',
  EDITOR: 'editor',
  SUPERADMIN: 'superadmin',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: string | undefined, roleName: RoleName): boolean {
  if (!userRole) {
    return false;
  }

  return userRole.toLowerCase() === roleName.toLowerCase();
}

/**
 * Check if user has admin role (editor or superadmin)
 */
export function isAdmin(userRole: string | undefined): boolean {
  if (!userRole) {
    return false;
  }

  const role = userRole.toLowerCase();
  return role === ROLES.EDITOR || role === ROLES.SUPERADMIN;
}

/**
 * Check if user is superadmin
 */
export function isSuperAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ROLES.SUPERADMIN);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    [ROLES.DESARROLLADORA]: 'Desarrolladora',
    [ROLES.EDITOR]: 'Editor',
    [ROLES.SUPERADMIN]: 'Super Administrador',
  };

  return roleMap[role.toLowerCase()] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    [ROLES.DESARROLLADORA]: 'Usuario desarrolladora con acceso básico',
    [ROLES.EDITOR]: 'Editor con permisos para gestionar contenido',
    [ROLES.SUPERADMIN]: 'Super administrador con acceso completo al sistema',
  };

  return descriptions[role.toLowerCase()] || 'Rol desconocido';
}
