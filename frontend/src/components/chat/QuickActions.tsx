import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onQuickMessage: (message: string) => void;
  bookTitle?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickMessage, bookTitle }) => {
  const navigate = useNavigate();

  const quickButtons = [
    {
      emoji: '💬',
      label: '토론하기',
      message: bookTitle 
        ? `${bookTitle}의 주제에 대해 토론하고 싶어요. 어떤 점이 흥미로운가요?`
        : '최근 읽은 책에 대해 토론하고 싶어요.',
    },
    {
      emoji: '📝',
      label: '요약해줘',
      message: bookTitle
        ? `${bookTitle}의 핵심 내용을 요약해줄래요?`
        : '이 책의 핵심 내용을 요약해줄래요?',
    },
    {
      emoji: '❓',
      label: '질문하기',
      message: bookTitle
        ? `${bookTitle}에서 이해가 안 되는 부분이 있어요. 설명해줄 수 있나요?`
        : '책에서 이해가 안 되는 부분이 있어요.',
    },
    {
      emoji: '🔍',
      label: '키워드 설명',
      message: bookTitle
        ? `${bookTitle}에 나오는 주요 키워드나 개념을 설명해줄래요?`
        : '책에 나오는 어려운 용어를 설명해줄래요?',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-200">
      {quickButtons.map((button, index) => (
        <button
          key={index}
          onClick={() => onQuickMessage(button.message)}
          className="
            px-3 
            py-1.5 
            bg-white 
            border 
            border-[#C29A42] 
            text-[#245A48]
            rounded-full 
            text-xs 
            font-medium
            hover:bg-[#F5F4EC] 
            hover:border-[#245A48]
            transition-all
            whitespace-nowrap
          "
        >
          <span className="mr-1">{button.emoji}</span>
          {button.label}
        </button>
      ))}
      
      {/* 책 추천 버튼 (다른 스타일) */}
      <button
        onClick={() => navigate('/recommend')}
        className="
          px-3 
          py-1.5 
          bg-[#C29A42]
          text-white
          rounded-full 
          text-xs 
          font-medium
          hover:opacity-90
          transition-all
          whitespace-nowrap
        "
      >
        <span className="mr-1">📚</span>
        AI 책 추천받기
      </button>
    </div>
  );
};

export default QuickActions;