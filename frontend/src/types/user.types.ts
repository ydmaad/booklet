import type { User } from '@supabase/supabase-js';

// 사용자 프로필 타입
export interface Profile {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
}

// Auth 상태 타입
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

// 로그인/회원가입 요청 타입
export interface AuthCredentials {
  email: string;
  password: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}