import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Business, BusinessMetric } from '../types/business.types';

export const businessService = {
  // Get currently logged-in user's businesses
  getAll(): Promise<ApiResponse<Business[]>> {
    return apiFetch('/business/me', {
      method: 'GET'
    });
  },

  // Get all registered businesses on the platform globally
  getAllPublic(): Promise<ApiResponse<Business[]>> {
    return apiFetch('/business', {
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
  },

  getLatestMetrics(businessId: number): Promise<ApiResponse<BusinessMetric>> {
    return apiFetch(`/business-metrics/business/${businessId}/latest`, {
      method: 'GET'
    });
  },

  // Business Scores
  getLatestScore(businessId: number): Promise<ApiResponse<any>> {
    return apiFetch(`/business-scores/business/${businessId}/latest`, {
      method: 'GET'
    });
  }
};
