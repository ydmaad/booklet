import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signup, clearError } from '../store/slices/authSlice';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // TODO: 실제로는 Supabase에서 이메일 중복 확인
    setEmailChecked(true);
    alert('사용 가능한 이메일입니다.');
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 2) {
      alert('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    // TODO: 실제로는 Supabase profiles 테이블에서 닉네임 중복 확인
    setNicknameChecked(true);
    alert('사용 가능한 닉네임입니다.');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !nickname || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!emailChecked) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    if (!nicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      await dispatch(signup({ email, password })).unwrap();
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
  };

  // 이메일이 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    setEmailChecked(false);
  }, [email]);

  // 닉네임이 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    setNicknameChecked(false);
  }, [nickname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-12">회원가입</h2>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* 이메일 입력 + 중복 확인 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 닉네임 입력 + 중복 확인 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <div className="flex gap-2">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Value"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Value"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;