import React from 'react';

interface MessageBubbleProps {
  message: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, role, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 아바타 */}
      <div
        className={`
          w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg
          ${isUser ? 'bg-[#245A48] text-white' : 'bg-[#C29A42] text-white'}
        `}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* 메시지 버블 */}
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${
              isUser
                ? 'bg-[#245A48] text-white rounded-br-sm'
                : 'bg-[#F5F4EC] text-gray-800 border border-gray-200 rounded-bl-sm'
            }
          `}
        >
          {/* 메시지 내용 (줄바꿈 처리) */}
          <div className="whitespace-pre-wrap break-words">
            {message}
          </div>
        </div>

        {/* 타임스탬프 (선택사항) */}
        {timestamp && (
          <span className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;