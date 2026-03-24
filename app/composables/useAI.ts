import { aiService } from '../services/ai.service';
import type { AIMessageResponse, AIResultResponse } from '../types/ai.types';

export const useAI = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const messages = ref<AIMessageResponse[]>([]);
  const currentSessionId = ref<number | null>(null);
  const sessionResult = ref<AIResultResponse | null>(null);

  // Load active session from local storage on init (Client-side only)
  if (import.meta.client) {
    const saved = localStorage.getItem('syn_active_session');
    if (saved) {
      currentSessionId.value = parseInt(saved);
      // Automatically attempt to fetch history
      aiService.getMessages(currentSessionId.value).then(res => {
        messages.value = res.data;
      }).catch(() => {
        // if session expired or failed, clear local state
        localStorage.removeItem('syn_active_session');
        currentSessionId.value = null;
      });
    }
  }

  const initSession = async (businessId: number, sessionType: 'idea_generation' | 'validation' | 'strategy' = 'idea_generation') => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await aiService.createSession({ business_id: businessId, type: sessionType });
      currentSessionId.value = response.data.id;
      messages.value = []; // reset state
      sessionResult.value = null;
      if (import.meta.client) {
        localStorage.setItem('syn_active_session', currentSessionId.value.toString());
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal membuat session AI';
    } finally {
      isLoading.value = false;
    }
  };

  const loadHistory = async (sessionId: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await aiService.getMessages(sessionId);
      messages.value = response.data;
      currentSessionId.value = sessionId;
    } catch (err: any) {
      error.value = 'Gagal memuat histori chat';
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (text: string) => {
    if (!currentSessionId.value || !text.trim()) return;
    
    messages.value.push({
      id: Date.now(),
      session_id: currentSessionId.value,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    });

    isLoading.value = true;
    error.value = null;
    try {
      const response = await aiService.sendMessage(currentSessionId.value, { message: text });
      messages.value.push(response.data);
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengirim pesan';
    } finally {
      isLoading.value = false;
    }
  };

  const sendRoleBasedChat = async (businessId: number, roleType: 'idea' | 'strategy' | 'validation', text: string) => {
    if (!text.trim()) return;

    messages.value.push({
      id: Date.now(),
      session_id: 0, // transient
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    });

    isLoading.value = true;
    error.value = null;
    
    try {
      let response;
      const payload = { business_id: businessId, message: text };
      
      if (roleType === 'idea') {
        response = await aiService.sendIdeaGeneration(payload);
      } else if (roleType === 'strategy') {
        response = await aiService.sendBusinessStrategy(payload);
      } else {
        response = await aiService.sendBusinessValidation(payload);
      }
      
      if (response && response.data) {
        messages.value.push(response.data);
        // Tangkap session_id yang baru dibuat oleh backend
        if (response.data.session_id && !currentSessionId.value) {
          currentSessionId.value = response.data.session_id;
          if (import.meta.client) {
            localStorage.setItem('syn_active_session', currentSessionId.value.toString());
          }
        }
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengirim pesan role API';
    } finally {
      isLoading.value = false;
    }
  };

  const closeAndGetResult = async () => {
    if (!currentSessionId.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await aiService.closeSessionAndGetResult(currentSessionId.value);
      sessionResult.value = response.data;
      
      // Bersihkan session karena sudah ditutup
      currentSessionId.value = null;
      if (import.meta.client) {
        localStorage.removeItem('syn_active_session');
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal merangkum hasil sesi';
    } finally {
      isLoading.value = false;
    }
  };

  const clearCurrentChat = () => {
    messages.value = [];
    currentSessionId.value = null;
    sessionResult.value = null;
    if (import.meta.client) {
      localStorage.removeItem('syn_active_session');
    }
  };

  return {
    isLoading,
    error,
    messages,
    currentSessionId,
    sessionResult,
    initSession,
    loadHistory,
    sendMessage,
    sendRoleBasedChat,
    closeAndGetResult,
    clearCurrentChat
  };
};
