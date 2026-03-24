import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Trend } from '../types/trend.types';

export const trendService = {
  getTopTrends(): Promise<ApiResponse<Trend[]>> {
    return apiFetch('/trends', {
      method: 'GET'
    });
  }
};
