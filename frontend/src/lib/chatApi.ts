import type { ChatConfig, Message } from '../types/chat.types';

// Backend API URL (환경변수로 관리)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * API 요청 타입
 */
interface ChatRequest {
  message: string;
  config: ChatConfig;  
  conversationHistory?: Message[];
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
 * @param config 챗봇 설정 (컨텍스트 + 책 정보)
 * @param conversationHistory 이전 대화 내역 (선택사항)
 * @returns AI 응답 메시지
 */
export async function sendChatMessage(
  message: string,
  config: ChatConfig,  
  conversationHistory?: Message[]
): Promise<string> {
  try {
    const requestBody: ChatRequest = {
      message,
      config,  // ← 변경
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

// re-export
export type { Message } from '../types/chat.types';