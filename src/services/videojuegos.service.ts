/**
 * Videojuegos Service
 * API service for videogame operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  VideojuegoListResponse,
  VideojuegoDetailResponse,
  VideojuegoCreateRequest,
  VideojuegoUpdateRequest,
  VideojuegoCreateResponse,
  VideojuegoUpdateResponse,
  VideojuegoDeleteResponse,
  VideojuegoListParams,
  VideojuegoSearchParams,
  CategoriasResponse,
  EstadisticasResponse,
  ImportBatchRequest,
  ImportBatchResponse,
  VideojuegoEnriquecidoResponse,
  SyncStatusResponse,
} from '@/types/api';

export const videojuegosService = {
  /**
   * Get all videojuegos with optional filters and pagination
   */
  async getAll(params?: VideojuegoListParams): Promise<VideojuegoListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/videojuegos/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<VideojuegoListResponse>(endpoint);
  },

  /**
   * Get videojuego by ID
   */
  async getById(id: number): Promise<VideojuegoDetailResponse> {
    return apiClient.get<VideojuegoDetailResponse>(`/api/videojuegos/${id}`);
  },

  /**
   * Create new videojuego (admin only)
   */
  async create(data: VideojuegoCreateRequest): Promise<VideojuegoCreateResponse> {
    return apiClient.post<VideojuegoCreateResponse>('/api/videojuegos/', data);
  },

  /**
   * Update videojuego (admin only)
   */
  async update(id: number, data: VideojuegoUpdateRequest): Promise<VideojuegoUpdateResponse> {
    return apiClient.put<VideojuegoUpdateResponse>(`/api/videojuegos/${id}`, data);
  },

  /**
   * Delete videojuego (admin only)
   */
  async delete(id: number): Promise<VideojuegoDeleteResponse> {
    return apiClient.delete<VideojuegoDeleteResponse>(`/api/videojuegos/${id}`);
  },

  /**
   * Advanced search
   */
  async search(params: VideojuegoSearchParams): Promise<VideojuegoListResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiClient.get<VideojuegoListResponse>(`/api/videojuegos/buscar/?${queryParams.toString()}`);
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoriasResponse> {
    return apiClient.get<CategoriasResponse>('/api/videojuegos/categorias/');
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<EstadisticasResponse> {
    return apiClient.get<EstadisticasResponse>('/api/videojuegos/estadisticas/');
  },

  /**
   * Import videojuegos from RAWG API
   */
  async importBatch(
    games?: ImportBatchRequest,
    count?: number
  ): Promise<ImportBatchResponse> {
    const queryParams = new URLSearchParams();

    if (count !== undefined) {
      queryParams.append('count', count.toString());
    }

    const endpoint = `/api/videojuegos/importar-batch/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.post<ImportBatchResponse>(endpoint, games || {});
  },

  /**
   * Hybrid search (local + RAWG)
   */
  async searchHybrid(
    query: string,
    includeExternal: boolean = true
  ): Promise<VideojuegoListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('include_external', includeExternal.toString());

    return apiClient.get<VideojuegoListResponse>(
      `/api/videojuegos/buscar/?${queryParams.toString()}`
    );
  },

  /**
   * Get enriched videojuego with RAWG data
   */
  async getEnriquecido(
    videojuegoId: number
  ): Promise<VideojuegoEnriquecidoResponse> {
    return apiClient.get<VideojuegoEnriquecidoResponse>(
      `/api/videojuegos/${videojuegoId}/enriquecido/`
    );
  },

  /**
   * Get sync status for async task
   */
  async getSyncStatus(taskId: string): Promise<SyncStatusResponse> {
    return apiClient.get<SyncStatusResponse>(
      `/api/videojuegos/sync-status/${taskId}/`
    );
  },
};
