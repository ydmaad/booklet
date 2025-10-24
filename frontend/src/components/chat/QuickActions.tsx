import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChatConfig } from '../../types/chat.types';

interface QuickActionsProps {
  onQuickMessage: (message: string) => void;
  config: ChatConfig;  // ← bookTitle에서 config로 변경
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickMessage, config }) => {
  const navigate = useNavigate();

  // context에 따라 다른 버튼들
  const getQuickButtons = () => {
    if (config.context === 'book-discussion' && config.bookData) {
      // 책 토론 모드 버튼들
      const bookTitle = config.bookData.title;
      
      return [
        {
          emoji: '💬',
          label: '토론하기',
          message: `${bookTitle}의 주제에 대해 토론하고 싶어요. 어떤 점이 흥미로운가요?`,
        },
        {
          emoji: '📝',
          label: '요약해줘',
          message: `${bookTitle}의 핵심 내용을 요약해줄래요?`,
        },
        {
          emoji: '❓',
          label: '질문하기',
          message: `${bookTitle}에서 이해가 안 되는 부분이 있어요. 설명해줄 수 있나요?`,
        },
        {
          emoji: '🔍',
          label: '키워드 설명',
          message: `${bookTitle}에 나오는 주요 키워드나 개념을 설명해줄래요?`,
        },
      ];
    } else {
      // 사이트 가이드 모드 버튼들
      return [
        {
          emoji: '📚',
          label: '책 추천받기',
          message: 'AI 기반 책 추천 기능은 어떻게 사용하나요?',
          action: () => navigate('/recommend'),
        },
        {
          emoji: '📖',
          label: '독서노트 쓰는 법',
          message: '독서노트는 어떻게 작성하나요?',
        },
        {
          emoji: '⭐',
          label: '리뷰 작성하기',
          message: '리뷰는 어떻게 작성하나요?',
        },
        {
          emoji: '❓',
          label: '자주 묻는 질문',
          message: '별책부록 사이트에서 자주 묻는 질문들을 알려주세요.',
        },
      ];
    }
  };

  const quickButtons = getQuickButtons();

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-200">
      {quickButtons.map((button, index) => (
        <button
          key={index}
          onClick={() => {
            // action이 있으면 action 실행, 없으면 메시지 전송
            if ('action' in button && button.action) {
              button.action();
            } else {
              onQuickMessage(button.message);
            }
          }}
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
    </div>
  );
};

export default QuickActions;