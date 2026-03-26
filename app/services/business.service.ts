import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Business, BusinessMetric } from '../types/business.types';

export const businessService = {
  getAll(): Promise<ApiResponse<Business[]>> {
    return apiFetch('/business/me', {
      method: 'GET'
    });
  },

  create(payload: FormData): Promise<ApiResponse<Business>> {
    return apiFetch('/business', {
      method: 'POST',
      body: payload
      // Note: when passing FormData, do not set Content-Type header manually, $fetch handles it
    });
  },

  getById(id: number): Promise<ApiResponse<Business>> {
    return apiFetch(`/business/${id}`, {
      method: 'GET'
    });
  },

  update(id: number, payload: FormData): Promise<ApiResponse<Business>> {
    return apiFetch(`/business/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/business/${id}`, {
      method: 'DELETE'
    });
  },

  // Business Metrics
  getMetrics(): Promise<ApiResponse<BusinessMetric[]>> {
    return apiFetch('/business-metrics', {
      method: 'GET'
    });
  },

  createMetric(payload: any): Promise<ApiResponse<BusinessMetric>> {
    return apiFetch('/business-metrics', {
      method: 'POST',
      body: payload
    });
  }
};
