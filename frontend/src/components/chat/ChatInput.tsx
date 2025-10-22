import React, { useState, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = '메시지를 입력하세요...'
}) => {
  const [message, setMessage] = useState('');

  // 메시지 전송 핸들러
  const handleSend = () => {
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage(''); // 입력창 비우기
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter: 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift + Enter: 줄바꿈 (기본 동작)
  };

  return (
    <div className="bg-white rounded-lg p-3 border-2 border-gray-200 flex gap-3 items-end">
      {/* 텍스트 입력 영역 */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="
          flex-1 
          resize-none 
          border 
          border-gray-300 
          rounded-md 
          px-3 
          py-2 
          text-sm 
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#C29A42] 
          focus:border-transparent
          disabled:bg-gray-100 
          disabled:cursor-not-allowed
          max-h-32
          overflow-y-auto
        "
        style={{
          minHeight: '40px',
          height: 'auto'
        }}
      />

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          px-5 
          py-2 
          bg-[#245A48] 
          text-white 
          rounded-md 
          font-semibold 
          text-sm 
          transition-all
          hover:opacity-90
          disabled:opacity-50 
          disabled:cursor-not-allowed
          whitespace-nowrap
          h-[40px]
        "
      >
        전송
      </button>
    </div>
  );
};

export default ChatInput;