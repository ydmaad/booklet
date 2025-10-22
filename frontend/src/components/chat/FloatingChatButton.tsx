import React from 'react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed 
        bottom-6 
        right-6 
        w-14 
        h-14 
        bg-[#C29A42] 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        text-2xl 
        shadow-lg 
        hover:scale-110 
        transition-transform 
        duration-200
        z-50
        cursor-pointer
      "
      aria-label="채팅 열기"
    >
      💬
    </button>
  );
};

export default FloatingChatButton;