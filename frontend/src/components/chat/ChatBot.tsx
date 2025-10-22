import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, type BookInfo, type ChatMessage } from '../../lib/chatApi';
import BookInfoHeader from './BookInfoHeader';
import QuickActions from './QuickActions';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

interface ChatBotProps {
  bookInfo: BookInfo;
  selectedText?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ bookInfo, selectedText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 환영 메시지 (처음 한 번만)
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `안녕하세요! ${bookInfo.title}에 대해 궁금한 점이 있으면 언제든 물어보세요 😊`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 메시지 전송 핸들러
  const handleSendMessage = async (userMessage: string) => {
    // 1. 사용자 메시지 추가
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // 2. 로딩 시작
    setIsLoading(true);

    try {
      // 3. AI 응답 요청
      const aiResponse = await sendChatMessage(
        userMessage,
        bookInfo,
        selectedText,
        messages // 이전 대화 히스토리 전달
      );

      // 4. AI 응답 추가
      const newAiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      
      // 에러 메시지 표시
      const errorMessage: ChatMessage = {
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
      {/* 헤더 */}
      <BookInfoHeader
        bookTitle={bookInfo.title}
        author={bookInfo.author}
        currentPage={bookInfo.currentPage}
        currentChapter={bookInfo.currentChapter}
      />

      {/* 퀵 액션 버튼 */}
      <QuickActions 
        onQuickMessage={handleSendMessage}
        bookTitle={bookInfo.title}
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