import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, type Message } from '../../lib/chatApi';
import type { ChatConfig } from '../../types/chat.types';
import BookInfoHeader from './BookInfoHeader';
import QuickActions from './QuickActions';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

interface ChatBotProps {
  config: ChatConfig;
}

const ChatBot: React.FC<ChatBotProps> = ({ config }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 환영 메시지 (처음 한 번만) - context에 맞게 변경!
  useEffect(() => {
    if (messages.length === 0) {
      let welcomeContent = '';
      
      if (config.context === 'book-discussion' && config.bookData) {
        welcomeContent = `안녕하세요! ${config.bookData.title}에 대해 궁금한 점이 있으면 언제든 물어보세요 😊`;
      } else {
        welcomeContent = '별책부록 사이트 이용법에 대해 도와드릴게요! 무엇이 궁금하신가요?';
      }

      const welcomeMessage: Message = {
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 메시지 전송 핸들러
  const handleSendMessage = async (userMessage: string) => {
    // 1. 사용자 메시지 추가
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // 2. 로딩 시작
    setIsLoading(true);

    try {
      // 3. AI 응답 요청 (config 전달)
      const aiResponse = await sendChatMessage(
        userMessage,
        config,  // ← bookInfo 대신 config 전달
        messages // 이전 대화 히스토리 전달
      );

      // 4. AI 응답 추가
      const newAiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      
      // 에러 메시지 표시
      const errorMessage: Message = {
        role: 'assistant',
        content: '죄송해요, 응답을 생성하는 중에 오류가 발생했어요. 다시 시도해주세요.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // 5. 로딩 종료
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      {/* 헤더 - config에 맞게 전달 */}
      <BookInfoHeader config={config} />

      {/* 퀵 액션 버튼 - config에 맞게 전달 */}
      <QuickActions 
        onQuickMessage={handleSendMessage}
        config={config}
      />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message.content}
            role={message.role}
            timestamp={message.timestamp}
          />
        ))}

        {/* 로딩 표시 */}
        {isLoading && <LoadingIndicator />}

        {/* 자동 스크롤 위치 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 bg-[#F5F4EC]">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="메시지를 입력하세요..."
        />
      </div>
    </div>
  );
};

export default ChatBot;