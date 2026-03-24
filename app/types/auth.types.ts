export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  google_id?: string;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
}

export interface UserBusinessResponse {
  user: User;
  businesses: any[]; // will be typed with Business type later
}
