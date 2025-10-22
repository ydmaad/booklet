import React from 'react';

interface BookInfoHeaderProps {
  bookTitle: string;
  author: string;
  currentPage?: number;
  currentChapter?: string;
}

const BookInfoHeader: React.FC<BookInfoHeaderProps> = ({
  bookTitle,
  author,
  currentPage,
  currentChapter
}) => {
  // 페이지/챕터 정보 포맷
  const getReadingInfo = () => {
    const parts = [];
    
    if (author) parts.push(author);
    if (currentPage) parts.push(`${currentPage}페이지`);
    if (currentChapter) parts.push(currentChapter);
    
    return parts.join(' · ');
  };

  return (
    <div className="bg-[#245A48] text-white px-4 py-4 rounded-t-lg">
      {/* 책 제목 */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">📚</span>
        <h2 className="text-base font-semibold text-[#F5F4EC]">
          {bookTitle}
        </h2>
      </div>
      
      {/* 작가 · 페이지 · 챕터 정보 */}
      <div className="text-sm opacity-90 ml-7">
        {getReadingInfo()}
      </div>
    </div>
  );
};

export default BookInfoHeader;