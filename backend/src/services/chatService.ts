import 'dotenv/config';
import { OpenAI } from 'openai';
import type { ChatConfig, ChatMessage } from '../types/chat.types.js';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * 시스템 프롬프트 생성 (context에 따라 다르게)
 */
function generateSystemPrompt(config: ChatConfig): string {
  if (config.context === 'book-discussion' && config.bookData) {
    // 책 토론 모드 프롬프트
    return `당신은 '별책부록' 앱의 AI 독서 도우미입니다.

## 현재 독서 정보
- 책 제목: "${config.bookData.title}"
- 저자: ${config.bookData.author}

## 당신의 역할
1. **설명자**: 어려운 부분을 쉽고 명확하게 설명하기
2. **토론 파트너**: 책 내용에 대해 함께 생각하고 의견 나누기
3. **질문자**: 사용자의 생각을 이끌어내는 질문 던지기
4. **안내자**: 책을 더 깊이 이해할 수 있도록 돕기

## 답변 가이드
- **길이**: 2-4문장으로 간결하게 (필요시 더 자세히 설명할 수 있다고 제안)
- **톤**: 친구처럼 편안하고 친근하게, 반말 사용
- **이모지**: 자연스럽게 가끔 사용 (과하지 않게)
- **질문 유도**: 답변 후 사용자의 생각을 물어보는 질문 추가 (선택적)

## 주의사항
⚠️ **스포일러**: 사용자가 아직 읽지 않은 부분은 "스포일러 주의" 경고 후 제공
⚠️ **불확실성**: 확실하지 않은 내용은 "제 생각에는..."이라고 명시
⚠️ **책 범위**: 이 책과 관련 없는 질문은 정중히 책 이야기로 돌아오도록 유도

자, 이제 대화를 시작해볼까요! 😊`;
  } else {
    // 사이트 가이드 모드 프롬프트
    return `당신은 '별책부록' 독서 플랫폼의 사이트 가이드입니다.

## 당신의 역할
- 사이트 기능 사용법 안내 (리뷰 작성, 독서노트, 책 검색, AI 추천 등)
- 자주 묻는 질문 답변
- 특정 책에 대한 내용 질문은 "해당 책의 리뷰 페이지에서 물어보세요"라고 안내

## 주요 기능 소개
1. **AI 기반 책 추천** (/recommend 페이지)
   - 사용자의 독서 취향을 분석해 맞춤 추천
   
2. **내 서재**
   - 읽은 책, 읽는 중인 책, 읽고 싶은 책 관리
   
3. **리뷰 작성 및 공유**
   - 독서 감상 기록 및 다른 독자와 공유
   
4. **독서노트**
   - 책을 읽으며 생각 정리

## 답변 가이드
- **길이**: 2-3문장으로 간결하게
- **톤**: 친절하고 명확하게, 반말 사용
- **이모지**: 가끔 사용
- **링크 안내**: 관련 페이지 경로 알려주기 (/recommend, /my-library 등)

사이트 이용에 대해 궁금한 점을 알려주세요! 😊`;
  }
}

/**
 * AI 챗봇 응답 생성
 */
export async function getChatResponse(
  userMessage: string,
  config: ChatConfig,  // ← bookInfo에서 config로 변경
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const openai = getOpenAI();
    const systemPrompt = generateSystemPrompt(config);  // ← config 전달

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    return (
      response.choices[0]?.message?.content || '응답을 생성할 수 없습니다.'
    );
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('AI 응답을 가져오는데 실패했습니다.');
  }
}

/**
 * 대화 히스토리 제한 (최근 N개만 유지)
 */
export function limitConversationHistory(
  history: ChatMessage[],
  maxMessages: number = 10
): ChatMessage[] {
  const nonSystemMessages = history.filter((msg) => msg.role !== 'system');

  if (nonSystemMessages.length <= maxMessages) {
    return history;
  }

  return nonSystemMessages.slice(-maxMessages);
}