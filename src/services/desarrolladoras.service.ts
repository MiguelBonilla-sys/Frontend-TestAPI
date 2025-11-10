/**
 * Desarrolladoras Service
 * API service for game developer operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  DesarrolladoraResponse,
  DesarrolladoraListParams,
  DesarrolladoraSearchParams,
} from '@/types/api';

export const desarrolladorasService = {
  /**
   * Get all desarrolladoras with optional filters and pagination
   */
  async getAll(params?: DesarrolladoraListParams): Promise<ApiResponse<DesarrolladoraResponse[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/desarrolladoras/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<DesarrolladoraResponse[]>(endpoint);
  },

  /**
   * Get desarrolladora by ID
   */
  async getById(id: number): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.get<DesarrolladoraResponse>(`/api/desarrolladoras/${id}`);
  },

  /**
   * Create new desarrolladora (admin only)
   */
  async create(data: Partial<DesarrolladoraResponse>): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.post<DesarrolladoraResponse>('/api/desarrolladoras/', data);
  },

  /**
   * Update desarrolladora (admin only)
   */
  async update(id: number, data: Partial<DesarrolladoraResponse>): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.put<DesarrolladoraResponse>(`/api/desarrolladoras/${id}`, data);
  },

  /**
   * Delete desarrolladora (admin only)
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/desarrolladoras/${id}`);
  },

  /**
   * Advanced search
   */
  async search(params: DesarrolladoraSearchParams): Promise<ApiResponse<DesarrolladoraResponse[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiClient.get<DesarrolladoraResponse[]>(`/api/desarrolladoras/buscar/?${queryParams.toString()}`);
  },

  /**
   * Get all countries
   */
  async getCountries(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/api/desarrolladoras/paises/');
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<Record<string, unknown>>('/api/desarrolladoras/estadisticas/');
  },

  /**
   * Get videojuegos by desarrolladora
   */
  async getVideojuegos(id: number, params?: { page?: number; per_page?: number }): Promise<ApiResponse<unknown[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/desarrolladoras/${id}/videojuegos/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<unknown[]>(endpoint);
  },
};
