export type ChatContext = 
  | 'book-discussion'  // 책 토론 모드
  | 'site-guide'       // 사이트 가이드 모드

export interface ChatBookInfo {
  title: string;
  author: string;
  isbn13: string;
}

export interface ChatConfig {
  context: ChatContext;
  bookData?: ChatBookInfo;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}