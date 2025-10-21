import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, recoverAccount, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error, deletedAccountInfo } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // 탈퇴한 계정 감지
  useEffect(() => {
    if (deletedAccountInfo) {
      setShowRecoveryModal(true);
    }
  }, [deletedAccountInfo]);

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // 유효성 검사
    if (!email || !password) {
      setValidationError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const result = await dispatch(login({ email, password })).unwrap();

      if (result) {
        navigate('/');
      }
    } catch (err: any) {
      console.error('로그인 오류:', err);
    }
  };

  // 계정 복구
  const handleRecoverAccount = async () => {
    try {
      await dispatch(recoverAccount({ email, password })).unwrap();
      alert('계정이 복구되었습니다! 환영합니다. 🎉');
      setShowRecoveryModal(false);
    } catch (error: any) {
      alert(error || '계정 복구에 실패했습니다.');
    }
  };

  // 복구 취소
  const handleCancelRecovery = () => {
    setShowRecoveryModal(false);
    dispatch(clearError());
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <p className="text-5xl font-bold text-brand-title">로그인</p>
        {/* 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                disabled={loading}
              />
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
                placeholder="비밀번호를 입력하세요"
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

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-button text-white rounded hover:bg-brand-button/75 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '로그인'}
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center text-sm">
            <span className="text-gray-600">아직 계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-gray-900 font-medium hover:underline"
            >
              회원가입하기
            </button>
          </div>
        </form>
      </div>
      
      {/* 계정 복구 모달 */}
      {showRecoveryModal && deletedAccountInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                탈퇴한 계정입니다
              </h2>
              <p className="text-gray-600">
                {deletedAccountInfo.email}
              </p>
            </div>

            {/* 복구 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 mb-2">
                <strong>탈퇴 일시:</strong>{' '}
                {new Date(deletedAccountInfo.deleted_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-blue-800">
                <strong>남은 기간:</strong>{' '}
                <span className="font-bold text-lg">{deletedAccountInfo.days_left}일</span>
                <span className="text-xs ml-1">
                  ({deletedAccountInfo.days_left}일 후 영구 삭제)
                </span>
              </p>
            </div>

            {/* 복구 안내 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                계정을 복구하시겠습니까?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ 기존 프로필 정보가 복원됩니다</li>
                <li>✅ 작성한 리뷰가 복원됩니다</li>
                <li>✅ 모든 데이터가 그대로 유지됩니다</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelRecovery}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleRecoverAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition font-medium"
              >
                {loading ? '복구 중...' : '계정 복구'}
              </button>
            </div>

            {/* 추가 안내 */}
            <p className="text-xs text-gray-500 text-center mt-4">
              복구를 원하지 않으시면 {deletedAccountInfo.days_left}일 후 자동으로 완전 삭제됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;