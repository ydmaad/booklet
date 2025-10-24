import React from 'react';
import type { ChatConfig } from '../../types/chat.types';

interface BookInfoHeaderProps {
  config: ChatConfig;  // ← props 변경
}

const BookInfoHeader: React.FC<BookInfoHeaderProps> = ({ config }) => {
  // book-discussion 모드
  if (config.context === 'book-discussion' && config.bookData) {
    return (
      <div className="bg-[#245A48] text-white px-4 py-4 rounded-t-lg">
        {/* 책 제목 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📚</span>
          <h2 className="text-base font-semibold text-[#F5F4EC]">
            {config.bookData.title}
          </h2>
        </div>
        
        {/* 작가 정보 */}
        <div className="text-sm opacity-90 ml-7">
          {config.bookData.author}
        </div>
      </div>
    );
  }

  // site-guide 모드
  return (
    <div className="bg-[#245A48] text-white px-4 py-4 rounded-t-lg">
      {/* 가이드 제목 */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">💁</span>
        <h2 className="text-base font-semibold text-[#F5F4EC]">
          별책부록 가이드
        </h2>
      </div>
      
      {/* 설명 */}
      <div className="text-sm opacity-90 ml-7">
        사이트 이용법을 알려드려요
      </div>
    </div>
  );
};

export default BookInfoHeader;