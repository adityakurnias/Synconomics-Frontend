import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Product } from '../types/product.types';

export const productService = {
  // Products are usually grouped by business in the API design
  getByBusinessId(businessId: number): Promise<ApiResponse<Product[]>> {
    return apiFetch(`/business/${businessId}/products`, {
      method: 'GET'
    });
  },

  create(businessId: number, payload: FormData): Promise<ApiResponse<Product>> {
    return apiFetch(`/business/${businessId}/products`, {
      method: 'POST',
      body: payload
    });
  },

  update(id: number, payload: FormData): Promise<ApiResponse<Product>> {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};
