import type { Book } from './book.types';

export type ChatContext = 
  | 'book-discussion'  // 책 토론 모드 (리뷰, 내서재)
  | 'site-guide'       // 사이트 가이드 모드 (메인, 설정 등)

// Book에서 필요한 필드만 추출
export type ChatBookInfo = Pick<Book, 'title' | 'author' | 'isbn13'>;

export interface ChatConfig {
  context: ChatContext;
  bookData?: ChatBookInfo;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}