'use client';

/**
 * Videojuego Enriquecido Page
 * Page for displaying enriched videojuego data
 */

import { useParams } from 'next/navigation';
import { VideojuegoEnriquecido } from '@/components/videojuego-enriquecido';
import { useRequireAuth } from '@/contexts/auth-context';

export default function VideojuegoEnriquecidoPage() {
  useRequireAuth();
  const params = useParams();
  const videojuegoId = parseInt(params.id as string);

  if (isNaN(videojuegoId)) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">ID de videojuego inválido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <VideojuegoEnriquecido videojuegoId={videojuegoId} />
    </div>
  );
}

