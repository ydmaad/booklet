import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4">
      {/* AI 아바타 */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg bg-[#C29A42] text-white">
        🤖
      </div>

      {/* 로딩 버블 */}
      <div className="bg-[#F5F4EC] text-gray-600 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[70%]">
        <div className="flex items-center gap-2">
          <span className="text-sm">답변을 생성하고 있어요</span>
          
          {/* 애니메이션 점 3개 */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;