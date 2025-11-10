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
    return apiClient.get<ApiResponse<DesarrolladoraResponse[]>>(endpoint);
  },

  /**
   * Get desarrolladora by ID
   */
  async getById(id: number): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.get<ApiResponse<DesarrolladoraResponse>>(`/api/desarrolladoras/${id}`);
  },

  /**
   * Create new desarrolladora (admin only)
   */
  async create(data: Partial<DesarrolladoraResponse>): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.post<ApiResponse<DesarrolladoraResponse>>('/api/desarrolladoras/', data);
  },

  /**
   * Update desarrolladora (admin only)
   */
  async update(id: number, data: Partial<DesarrolladoraResponse>): Promise<ApiResponse<DesarrolladoraResponse>> {
    return apiClient.put<ApiResponse<DesarrolladoraResponse>>(`/api/desarrolladoras/${id}`, data);
  },

  /**
   * Delete desarrolladora (admin only)
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/desarrolladoras/${id}`);
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

    return apiClient.get<ApiResponse<DesarrolladoraResponse[]>>(`/api/desarrolladoras/buscar/?${queryParams.toString()}`);
  },

  /**
   * Get all countries
   */
  async getCountries(): Promise<ApiResponse<string[]>> {
    return apiClient.get<ApiResponse<string[]>>('/api/desarrolladoras/paises/');
  },

  /**
   * Get statistics
   */
  async getStatistics(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/api/desarrolladoras/estadisticas/');
  },

  /**
   * Get videojuegos by desarrolladora
   */
  async getVideojuegos(id: number, params?: { page?: number; per_page?: number }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/desarrolladoras/${id}/videojuegos/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ApiResponse<any[]>>(endpoint);
  },
};
