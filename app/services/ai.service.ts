import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { 
  ChatRequest, 
  ChatWithRoleRequest, 
  AIMessageResponse, 
  AISessionResponse, 
  AIResultResponse, 
  CreateSessionRequest 
} from '../types/ai.types';

export const aiService = {
  createSession(payload: CreateSessionRequest): Promise<ApiResponse<AISessionResponse>> {
    return apiFetch('/ai/sessions', {
      method: 'POST',
      body: payload
    });
  },

  getMessages(sessionId: number): Promise<ApiResponse<AIMessageResponse[]>> {
    return apiFetch(`/ai/sessions/${sessionId}/messages`, {
      method: 'GET'
    });
  },

  sendMessage(sessionId: number, payload: ChatRequest): Promise<ApiResponse<AIMessageResponse>> {
    return apiFetch(`/ai/sessions/${sessionId}/chat`, {
      method: 'POST',
      body: payload
    });
  },

  closeSessionAndGetResult(sessionId: number): Promise<ApiResponse<AIResultResponse>> {
    return apiFetch(`/ai/sessions/${sessionId}/result`, {
      method: 'POST'
    });
  },

  // Role-based specific endpoints (which automatically create sessions internally based on API specs)
  sendIdeaGeneration(payload: ChatWithRoleRequest): Promise<ApiResponse<AIMessageResponse>> {
    return apiFetch('/ai/chat/idea-generation', {
      method: 'POST',
      body: payload
    });
  },

  sendBusinessStrategy(payload: ChatWithRoleRequest): Promise<ApiResponse<AIMessageResponse>> {
    return apiFetch('/ai/chat/strategy', {
      method: 'POST',
      body: payload
    });
  },

  sendBusinessValidation(payload: ChatWithRoleRequest): Promise<ApiResponse<AIMessageResponse>> {
    return apiFetch('/ai/chat/validation', {
      method: 'POST',
      body: payload
    });
  }
};
