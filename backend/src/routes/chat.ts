import express from 'express';
import type { Request, Response } from 'express';
import { getChatResponse, limitConversationHistory } from '../services/chatService.js';
import type { ChatConfig, ChatMessage } from '../types/chat.types.js';

const router = express.Router();

interface ChatRequestBody {
  message: string;
  config: ChatConfig;  
  conversationHistory?: ChatMessage[];
}

/**
 * POST /api/chat
 * AI와 대화하기
 */
router.post('/', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const { message, config, conversationHistory = [] } = req.body;

    // 요청 검증
    if (!message || !config || !config.context) {
      return res.status(400).json({ 
        error: '메시지와 컨텍스트는 필수입니다.' 
      });
    }

    // book-discussion 모드일 때 책 정보 검증
    if (config.context === 'book-discussion') {
      if (!config.bookData || !config.bookData.title || !config.bookData.author) {
        return res.status(400).json({ 
          error: '책 토론 모드에서는 책 정보(제목, 저자)가 필수입니다.' 
        });
      }
    }

    // 대화 히스토리 제한 (최근 10개만)
    const limitedHistory = limitConversationHistory(conversationHistory, 10);

    // AI 응답 생성
    const aiResponse = await getChatResponse(
      message,
      config,  // ← config 전달
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