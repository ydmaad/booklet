import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register } from '../store/slices/authSlice';
import { supabase } from '../lib/supabaseClient';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setValidationError('이미 사용 중인 이메일입니다.');
      } else {
        setValidationError('');
        alert('사용 가능한 이메일입니다.');
      }
    } catch (err: any) {
      console.error('이메일 중복 확인 오류:', err);
      setValidationError('이메일 확인 중 오류가 발생했습니다.');
    }
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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setValidationError('이미 사용 중인 닉네임입니다.');
      } else {
        setValidationError('');
        alert('사용 가능한 닉네임입니다.');
      }
    } catch (err: any) {
      console.error('닉네임 중복 확인 오류:', err);
      setValidationError('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // 유효성 검사
    if (!email || !nickname || !password || !confirmPassword) {
      setValidationError('모든 필드를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 20) {
      setValidationError('닉네임은 2~20자 사이여야 합니다.');
      return;
    }

    if (password.length < 6) {
      setValidationError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const result = await dispatch(
        register({ email, password, nickname })
      ).unwrap();

      if (result) {
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      }
    } catch (err: any) {
      console.error('회원가입 오류:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 이메일 입력 + 중복 확인 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
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
                  placeholder="2~20자 사이"
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
                placeholder="최소 6자 이상"
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
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {(validationError || error) && (
            <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded">
              {validationError || error}
            </div>
          )}

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>

          {/* 로그인 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-gray-900 font-medium hover:underline"
            >
              로그인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;