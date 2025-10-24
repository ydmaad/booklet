import React, { useEffect } from 'react';
import ChatBot from './ChatBot';
import type { ChatConfig } from '../../types/chat.types';

interface ChatBotModalProps {
  onClose: () => void;
  config: ChatConfig;  // ← bookInfo에서 config로 변경!
}

const ChatBotModal: React.FC<ChatBotModalProps> = ({ onClose, config }) => {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleBackdropClick}
      />

      {/* 챗봇 모달 */}
      <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] shadow-2xl rounded-lg overflow-hidden animate-slide-up bg-white">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="
            absolute 
            top-4 
            right-4 
            z-10 
            w-8 
            h-8 
            bg-white 
            bg-opacity-20 
            hover:bg-opacity-30 
            rounded-full 
            flex 
            items-center 
            justify-center 
            text-white 
            transition-all
          "
          aria-label="닫기"
        >
          ✕
        </button>

        {/* ChatBot 컴포넌트 */}
        <div className="h-full">
          <ChatBot config={config} />  {/* ← config 전달! */}
        </div>
      </div>

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatBotModal;