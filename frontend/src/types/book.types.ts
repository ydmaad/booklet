export interface Book {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn13: string;
  cover: string;
  publisher: string;
}

export interface AladinResponse {
  version: string;
  logo: string;
  title: string;
  item: Book[];
}

export interface BooksState {
  items: AladinResponse;
  loading: boolean;
  error: string | null;
}

// 사용자 프로필 타입
export interface Profile {
  id: string;
  email: string;
  nickname?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
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