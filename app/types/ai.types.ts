export interface ChatRequest {
  message: string;
}

export interface ChatWithRoleRequest {
  business_id: number;
  message: string;
}

export interface AIMessageResponse {
  id: number;
  session_id: number;
  role: 'user' | 'model';
  content: string;
  created_at: string;
}

export interface AISessionResponse {
  id: number;
  user_id: number;
  topic: string;
  status: string;
  created_at: string;
}

export interface AIResultResponse {
  id: number;
  session_id: number;
  resume: string;
  created_at: string;
}

export interface CreateSessionRequest {
  business_id: number;
  type: 'idea_generation' | 'validation' | 'strategy';
}
