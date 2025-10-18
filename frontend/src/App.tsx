import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // 앱 시작 시 세션 확인 (새로고침 대응)
  // Redux Persist가 이미 상태를 복원했지만,
  // Supabase 세션이 유효한지 백그라운드에서 확인
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/mypage"
          element={user ? <MyPage /> : <Navigate to="/" />}
        />
        <Route path="/mypage/edit" element={<EditProfile />} />
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
      <Footer />
    </div>
  );
}

export default App;
