import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';
import type { ChatConfig } from './types/chat.types';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import IsbnInputPage from './pages/IsbnInputPage';
import ReviewCreatePage from './pages/ReviewCreatePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ReviewDetail from './components/ReviewDetail';
import EditProfile from './components/EditProfile';
import BarcodeScanPage from './pages/BarcodeScanPage';
import ReviewEdit from './components/ReviewEdit';
import RecommendPage from './pages/RecommendPage';
import FloatingChatButton from './components/chat/FloatingChatButton';
import ChatBotModal from './components/chat/ChatBotModal';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // 페이지별로 ChatConfig 결정
  const getChatConfig = (): ChatConfig => {
    const path = location.pathname;

    // TODO: 리뷰 상세 페이지(/review/:id)에서는 해당 책 정보 사용
    // 지금은 모든 페이지에서 site-guide 모드
    
    // 나중에 책 관련 페이지에서는:
    // if (path.includes('/review/') || path.includes('/mypage')) {
    //   return {
    //     context: 'book-discussion',
    //     bookData: {
    //       title: '실제 책 제목',
    //       author: '실제 저자',
    //       isbn13: '실제 ISBN'
    //     }
    //   };
    // }

    // 🎬 데모: 리뷰 페이지에서는 책 토론 모드
    if (path.includes('/review/')) {
      return {
        context: 'book-discussion',
        bookData: {
          title: '데미안',  // 데모용 고정 데이터
          author: '헤르만 헤세',
          isbn13: '9788937460449'
        }
      };
    }

    // 기본: 사이트 가이드 모드
    return {
      context: 'site-guide'
    };
  };

  const chatConfig = getChatConfig();

  // 로그인/회원가입 페이지에서는 챗봇 숨기기
  const shouldShowChatBot = !location.pathname.includes('/login') && 
                           !location.pathname.includes('/register');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[1200px] mx-auto flex-1 w-full">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/mypage"
            element={user ? <MyPage /> : <Navigate to="/" />}
          />
          <Route path="/mypage/edit" element={<EditProfile />} />
          <Route
            path="/recommend"
            element={user ? <RecommendPage /> : <Navigate to="/" />}
          />
          <Route path="/barcode" element={<BarcodeScanPage />} />
          <Route path="/isbn" element={<IsbnInputPage />} />
          <Route path="/my-review/:isbn" element={<ReviewCreatePage />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/review/edit/:id" element={<ReviewEdit />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
        </Routes>
      </div>
      <Footer />

      {/* ChatBot: 모든 페이지에 표시 (로그인/회원가입 제외) */}
      {shouldShowChatBot && (
        <>
          <FloatingChatButton onClick={() => setIsChatOpen(true)} />
          {isChatOpen && (
            <ChatBotModal
              onClose={() => setIsChatOpen(false)}
              config={chatConfig}  // ← config 전달!
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;