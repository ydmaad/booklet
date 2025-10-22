import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession } from './store/slices/authSlice';
import type { AppDispatch, RootState } from './store/store';

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

  // 앱 시작 시 세션 확인 (새로고침 대응)
  // Redux Persist가 이미 상태를 복원했지만,
  // Supabase 세션이 유효한지 백그라운드에서 확인
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // 페이지별 책 정보 결정
  const getBookInfo = () => {
    // 리뷰 상세 페이지에서는 해당 책 정보를 사용
    // 지금은 일반 독서 상담으로 설정
    // TODO: 나중에 페이지별로 책 정보 전달
    return {
      title: '독서 도우미',
      author: '별책부록',
    };
  };

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
          <Route path="/barcode" element={<BarcodeScanPage />} />/
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

      {/* 👇 ChatBot: 모든 페이지에 표시 (로그인/회원가입 제외) */}
      {shouldShowChatBot && (
        <>
          <FloatingChatButton onClick={() => setIsChatOpen(true)} />
          {isChatOpen && (
            <ChatBotModal
              onClose={() => setIsChatOpen(false)}
              bookInfo={getBookInfo()}
            />
          )}
        </>
      )}

    </div>
  );
}

export default App;
