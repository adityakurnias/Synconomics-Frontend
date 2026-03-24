import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Expense } from '../types/expense.types';

export const expenseService = {
  getByBusinessId(businessId: number): Promise<ApiResponse<Expense[]>> {
    return apiFetch(`/business/${businessId}/expenses`, {
      method: 'GET'
    });
  },

  create(businessId: number, payload: any): Promise<ApiResponse<Expense>> {
    return apiFetch(`/business/${businessId}/expenses`, {
      method: 'POST',
      body: payload
    });
  },

  delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/expenses/${id}`, {
      method: 'DELETE'
    });
  }
};
