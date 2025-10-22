import express from 'express';
import type { Request, Response } from 'express';
import { getChatResponse, limitConversationHistory } from '../services/chatService.js';

const router = express.Router();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  message: string;
  bookInfo: {
    title: string;
    author: string;
    genre?: string;
    currentPage?: number;
    currentChapter?: string;
  };
  selectedText?: string;
  conversationHistory?: ChatMessage[];
}

/**
 * POST /api/chat
 * AI와 대화하기
 */
router.post('/', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const { message, bookInfo, selectedText, conversationHistory = [] } = req.body;

    // 요청 검증
    if (!message || !bookInfo || !bookInfo.title || !bookInfo.author) {
      return res.status(400).json({ 
        error: '메시지와 책 정보(제목, 저자)는 필수입니다.' 
      });
    }

    // 대화 히스토리 제한 (최근 10개만)
    const limitedHistory = limitConversationHistory(conversationHistory, 10);

    // AI 응답 생성
    const aiResponse = await getChatResponse(
      message,
      bookInfo,
      selectedText,
      limitedHistory
    );

    // 응답 반환
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // 에러 메시지 처리
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    
    res.status(500).json({ 
      success: false,
      error: errorMessage 
    });
  }
});

/**
 * GET /api/chat/health
 * 챗봇 서비스 상태 확인
 */
router.get('/health', (req: Request, res: Response) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  res.json({
    status: 'ok',
    service: 'chat',
    openaiConfigured: hasApiKey
  });
});

export default router;