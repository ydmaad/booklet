// Backend API URL (환경변수로 관리)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * 책 정보 타입
 */
export interface BookInfo {
  title: string;
  author: string;
  genre?: string;
  currentPage?: number;
  currentChapter?: string;
}

/**
 * 채팅 메시지 타입
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

/**
 * API 요청 타입
 */
interface ChatRequest {
  message: string;
  bookInfo: BookInfo;
  selectedText?: string;
  conversationHistory?: ChatMessage[];
}

/**
 * API 응답 타입
 */
interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

/**
 * AI 채팅 메시지 전송
 * 
 * @param message 사용자 메시지
 * @param bookInfo 현재 읽고 있는 책 정보
 * @param selectedText 사용자가 선택한 텍스트 (선택사항)
 * @param conversationHistory 이전 대화 내역 (선택사항)
 * @returns AI 응답 메시지
 */
export async function sendChatMessage(
  message: string,
  bookInfo: BookInfo,
  selectedText?: string,
  conversationHistory?: ChatMessage[]
): Promise<string> {
  try {
    const requestBody: ChatRequest = {
      message,
      bookInfo,
      selectedText,
      conversationHistory: conversationHistory || []
    };

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data: ChatResponse = await response.json();

    if (!data.success) {
      throw new Error('AI 응답 생성 실패');
    }

    return data.response;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
}

/**
 * 챗봇 서비스 상태 확인
 * 
 * @returns 서비스가 정상 작동하는지 여부
 */
export async function checkChatServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/health`);
    const data = await response.json();
    return data.status === 'ok' && data.openaiConfigured;
  } catch (error) {
    console.error('Health Check Error:', error);
    return false;
  }
}