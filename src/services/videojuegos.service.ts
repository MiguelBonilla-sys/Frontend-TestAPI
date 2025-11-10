/**
 * Videojuegos Service
 * API service for videogame operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  VideojuegoResponse,
  VideojuegoCreateRequest,
  VideojuegoUpdateRequest,
  VideojuegoListParams,
  VideojuegoSearchParams,
  VideojuegoEnriquecidoData,
  ImportBatchResult,
  EstadisticasData,
  SyncStatusData,
} from '@/types/api';

export const videojuegosService = {
  /**
   * Get all videojuegos with optional filters and pagination
   */
  async getAll(params?: VideojuegoListParams): Promise<ApiResponse<VideojuegoResponse[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/videojuegos/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<VideojuegoResponse[]>(endpoint);
  },

  /**
   * Get videojuego by ID
   */
  async getById(id: number): Promise<ApiResponse<VideojuegoResponse>> {
    return apiClient.get<VideojuegoResponse>(`/api/videojuegos/${id}`);
  },

  /**
   * Create new videojuego (admin only)
   */
  async create(data: VideojuegoCreateRequest): Promise<ApiResponse<VideojuegoResponse>> {
    return apiClient.post<VideojuegoResponse>('/api/videojuegos/', data);
  },

  /**
   * Update videojuego (admin only)
   */
  async update(id: number, data: VideojuegoUpdateRequest): Promise<ApiResponse<VideojuegoResponse>> {
    return apiClient.put<VideojuegoResponse>(`/api/videojuegos/${id}`, data);
  },

  /**
   * Delete videojuego (admin only)
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/videojuegos/${id}`);
  },

  /**
   * Advanced search
   */
  async search(params: VideojuegoSearchParams): Promise<ApiResponse<VideojuegoResponse[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiClient.get<VideojuegoResponse[]>(`/api/videojuegos/buscar/?${queryParams.toString()}`);
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/api/videojuegos/categorias/');
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<ApiResponse<EstadisticasData>> {
    return apiClient.get<EstadisticasData>('/api/videojuegos/estadisticas/');
  },

  /**
   * Import videojuegos from RAWG API
   */
  async importBatch(
    games?: { games?: Array<{ external_id: string }> },
    count?: number
  ): Promise<ApiResponse<ImportBatchResult>> {
    const queryParams = new URLSearchParams();

    if (count !== undefined) {
      queryParams.append('count', count.toString());
    }

    const endpoint = `/api/videojuegos/importar-batch/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.post<ImportBatchResult>(endpoint, games || {});
  },

  /**
   * Hybrid search (local + RAWG)
   */
  async searchHybrid(
    query: string,
    includeExternal: boolean = true
  ): Promise<ApiResponse<VideojuegoResponse[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('include_external', includeExternal.toString());

    return apiClient.get<VideojuegoResponse[]>(
      `/api/videojuegos/buscar/?${queryParams.toString()}`
    );
  },

  /**
   * Get enriched videojuego with RAWG data
   */
  async getEnriquecido(
    videojuegoId: number
  ): Promise<ApiResponse<VideojuegoEnriquecidoData>> {
    return apiClient.get<VideojuegoEnriquecidoData>(
      `/api/videojuegos/${videojuegoId}/enriquecido/`
    );
  },

  /**
   * Get sync status for async task
   */
  async getSyncStatus(taskId: string): Promise<ApiResponse<SyncStatusData>> {
    return apiClient.get<SyncStatusData>(
      `/api/videojuegos/sync-status/${taskId}/`
    );
  },
};
