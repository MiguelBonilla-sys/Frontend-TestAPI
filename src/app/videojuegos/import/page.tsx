'use client';

/**
 * Videojuegos Import Page
 * Page for importing videojuegos from RAWG
 */

import { VideojuegoImport } from '@/components/videojuego-import';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useRequireAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/use-permissions';

export default function VideojuegosImportPage() {
  useRequireAuth();
  const { canImportVideojuegos } = usePermissions();

  if (!canImportVideojuegos) {
    return (
      <DashboardLayout title="Importar Videojuegos">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">No tienes permisos para importar videojuegos</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Importar Videojuegos" description="Importa videojuegos desde la API de RAWG">
      <VideojuegoImport />
    </DashboardLayout>
  );
}

