import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { User, LoginResponse, RegisterResponse, UserBusinessResponse } from '../types/auth.types';

export const authService = {
  login(payload: any): Promise<ApiResponse<LoginResponse>> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: payload
    });
  },
  
  register(payload: any): Promise<ApiResponse<RegisterResponse>> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: payload
    });
  },
  
  getProfile(): Promise<ApiResponse<User>> {
    return apiFetch('/auth/profile', {
      method: 'GET'
    });
  },

  updateProfile(payload: { name?: string; email?: string }): Promise<ApiResponse<User>> {
    return apiFetch('/auth/profile', {
      method: 'PUT',
      body: payload
    });
  },

  getProfileWithBusinesses(): Promise<ApiResponse<UserBusinessResponse>> {
    return apiFetch('/auth/me-with-businesses', {
      method: 'GET'
    });
  }
};
