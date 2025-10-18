import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProfile, updateProfile, updatePassword, softDeleteAccount } from '../store/slices/authSlice';
import { supabase } from '../lib/supabaseClient';
import { User } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user, profile, loading } = useAppSelector((state) => state.auth);

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [originalNickname, setOriginalNickname] = useState('');

  // 로그인 확인
  useEffect(() => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 프로필 로드
    if (!profile) {
      dispatch(fetchProfile(user.id));
    }
  }, [user, profile, dispatch, navigate]);

  // 프로필 데이터를 state에 설정
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setOriginalNickname(profile.nickname);
      setBio(profile.bio || '');
      setKeywordInput(profile.keywords ? profile.keywords.join(', ') : '');
      setPreviewUrl(profile.avatar_url);
    }
  }, [profile]);

  // 이미지 파일 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('이미지 크기는 2MB 이하여야 합니다.');
        return;
      }

      // 이미지 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (trimmedNickname.length < 2) {
      alert('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    // 기존 닉네임과 같으면 중복 확인 스킵
    if (trimmedNickname === originalNickname) {
      setNicknameAvailable(true);
      alert('현재 사용 중인 닉네임입니다.');
      return;
    }

    setNicknameChecking(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', trimmedNickname)
        .eq('is_deleted', false)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setNicknameAvailable(false);
        alert('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameAvailable(true);
        alert('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      console.error('닉네임 확인 에러:', error);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setNicknameChecking(false);
    }
  };

  // 프로필 이미지 업로드
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user?.id) return profile?.avatar_url || null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.error('이미지 업로드 에러:', uploadError);
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // Public URL 생성
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('이미지 업로드 에러:', error);
      throw error;
    }
  };

  // 저장
  const handleSave = async () => {
    if (!user?.id) return;

    // 닉네임 변경 시 중복 확인 체크
    if (nickname !== originalNickname && nicknameAvailable !== true) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    // 비밀번호 검증
    if (currentPassword || newPassword || newPasswordConfirm) {
      if (!currentPassword) {
        alert('현재 비밀번호를 입력해주세요.');
        return;
      }
      if (!newPassword) {
        alert('새 비밀번호를 입력해주세요.');
        return;
      }
      if (newPassword.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    try {
      // 1. 비밀번호 변경 (입력했다면)
      if (currentPassword && newPassword) {
        await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      }

      // 2. 이미지 업로드
      let avatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // 3. 키워드 배열 변환
      const keywords = keywordInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // 4. 프로필 업데이트
      await dispatch(
        updateProfile({
          nickname: nickname.trim(),
          bio: bio.trim() || undefined,
          keywords: keywords.length > 0 ? keywords : undefined,
          avatar_url: avatarUrl || undefined,
        })
      ).unwrap();

      alert('프로필이 수정되었습니다! 🎉');
      navigate('/mypage');
    } catch (error: any) {
      console.error('저장 에러:', error);
      alert(error || '프로필 저장 중 오류가 발생했습니다.');
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까?\n\n탈퇴 후 30일 이내에는 복구할 수 있지만,\n30일이 지나면 모든 데이터가 영구적으로 삭제됩니다.'
    );

    if (!confirmed) return;

    const doubleCheck = window.confirm(
      '정말로 탈퇴하시겠습니까?\n이 작업은 신중하게 결정해주세요.'
    );

    if (!doubleCheck) return;

    if (!user?.id) return;

    try {
      await dispatch(softDeleteAccount(user.id)).unwrap();
      alert('회원탈퇴가 완료되었습니다.\n30일 이내 재로그인 시 계정을 복구할 수 있습니다.');
      navigate('/');
    } catch (error: any) {
      console.error('탈퇴 에러:', error);
      alert(error || '회원탈퇴 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-8">내 정보 수정</h1>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-lg">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-purple-600" />
            )}
          </div>
          <label className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-400 transition text-sm font-medium">
            사진 업로드
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, GIF (최대 2MB)
          </p>
        </div>

        {/* 닉네임 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameAvailable(null);
              }}
              placeholder="닉네임을 입력하세요"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleCheckNickname}
              disabled={nicknameChecking || loading}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:bg-gray-400 transition whitespace-nowrap text-sm"
            >
              {nicknameChecking ? '확인중...' : '중복 확인'}
            </button>
          </div>
          {nicknameAvailable === true && (
            <p className="text-sm text-green-600 mt-1">
              ✓ 사용 가능한 닉네임입니다
            </p>
          )}
          {nicknameAvailable === false && (
            <p className="text-sm text-red-600 mt-1">
              ✗ 이미 사용 중인 닉네임입니다
            </p>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            비밀번호 변경 (선택사항)
          </h3>
          
          {/* 현재 비밀번호 */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 text-sm"
            />
          </div>

          {/* 새 비밀번호 */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 (6자 이상)"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 text-sm"
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호 확인"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 text-sm"
            />
            {newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm && (
              <p className="text-sm text-red-600 mt-1">
                ✗ 비밀번호가 일치하지 않습니다
              </p>
            )}
            {newPassword && newPasswordConfirm && newPassword === newPasswordConfirm && (
              <p className="text-sm text-green-600 mt-1">
                ✓ 비밀번호가 일치합니다
              </p>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            💡 비밀번호를 변경하지 않으려면 비워두세요
          </p>
        </div>

        {/* 나의 키워드 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            나의 키워드
          </label>
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="예) 국내소설, 철학, 베스트셀러, 자기계발"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            쉼표(,)로 구분하여 입력해주세요
          </p>
        </div>

        {/* 한 줄 소개 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            한 줄 소개
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 소개해주세요"
            disabled={loading}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            최대 200자
          </p>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => navigate('/mypage')}
            disabled={loading}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded hover:bg-gray-50 disabled:opacity-50 transition font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50 transition font-medium"
          >
            {loading ? '저장중...' : '저장'}
          </button>
        </div>

        {/* 회원탈퇴 버튼 */}
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 disabled:opacity-50 transition font-medium"
        >
          {loading ? '처리중...' : '회원탈퇴'}
        </button>

        {/* 안내 메시지 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            💡 <strong>회원탈퇴 안내</strong>
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            탈퇴 후 30일 이내에 재로그인하면 계정을 복구할 수 있습니다.
            30일이 지나면 모든 데이터가 영구적으로 삭제됩니다.
          </p>
        </div>
      </div>
    </div>
  );
  
  // return (
  //   <div className="flex justify-center my-20">
  //     <div className="flex flex-col items-center w-1/4">
  //       <p className="text-3xl font-bold mb-8">내 정보 수정</p>
        
  //       <div className="flex flex-col justify-center items-center mb-10">
  //         <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-lg">
  //           {previewUrl ? (
  //             <img
  //               src={previewUrl}
  //               alt="프로필"
  //               className="w-full h-full object-cover"
  //             />
  //           ) : (
  //             <User size={64} className="text-purple-600" />
  //           )}
  //         </div>
  //         <label className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-400 transition text-sm font-medium">
  //           사진 업로드
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={handleImageChange}
  //             className="hidden"
  //             disabled={loading}
  //           />
  //         </label>
  //         <p className="text-xs text-gray-500 mt-2">
  //           JPG, PNG, GIF (최대 2MB)
  //         </p>
  //       </div>
        
  //       <div className="flex flex-col w-full mb-5">
  //         <p className="block text-sm font-medium text-gray-700 mb-2">
  //           닉네임 <span className="text-red-500">*</span>
  //         </p>
  //         <div className="flex flex-row">
  //           <input
  //             type="text"
  //             value={nickname}
  //             onChange={(e) => {
  //               setNickname(e.target.value);
  //               setNicknameAvailable(null);
  //             }}
  //             placeholder="닉네임을 입력하세요"
  //             disabled={loading}
  //             className="border rounded-md px-2 py-1 flex-1 mr-1"
  //           />
  //           <button 
  //             onClick={handleCheckNickname}
  //             disabled={nicknameChecking || loading}
  //             className="w-24 flex-shrink-0 border text-sm text-white bg-gray-700 rounded-lg py-1"
  //           >
  //             {nicknameChecking ? '확인중...' : '중복 확인'}
  //           </button>
  //         </div>
  //         {nicknameAvailable === true && (
  //           <p className="text-sm text-green-600 mt-1">
  //             ✓ 사용 가능한 닉네임입니다
  //           </p>
  //         )}
  //         {nicknameAvailable === false && (
  //           <p className="text-sm text-red-600 mt-1">
  //             ✗ 이미 사용 중인 닉네임입니다
  //           </p>
  //         )}
  //       </div>

  //       <div className="flex flex-col w-full mb-5">
  //         <p>비밀번호</p>
  //         <input
  //           type="text"
  //           placeholder="Value"
  //           className="border rounded-md px-2 py-1 w-full"
  //         />
  //       </div>
  //       <div className="flex flex-col w-full mb-5">
  //         <p>비밀번호 확인</p>
  //         <input
  //           type="text"
  //           placeholder="Value"
  //           className="border rounded-md px-2 py-1 w-full"
  //         />
  //       </div>
  //       <div className="flex flex-col w-full mb-5">
  //         <p>나의 키워드</p>
  //         <input
  //           type="text"
  //           placeholder="Value"
  //           className="border rounded-md px-2 py-1 w-full"
  //         />
  //         <p className="text-sm text-gray-400">
  //           ex) 국내소설, 한강, 베스트셀러, 자기개발 등
  //         </p>
  //       </div>
  //       <div className="flex flex-col w-full mb-5">
  //         <p>한 줄 소개</p>
  //         <input
  //           type="text"
  //           placeholder="Value"
  //           className="border rounded-md px-2 py-1 w-full"
  //         />
  //       </div>
  //       <div className="flex gap-3 my-10">
  //         <button className="w-24 border border-gray-400 text-sm bg-white rounded-lg py-1">
  //           취소
  //         </button>
  //         <button className="w-24 text-sm text-white bg-[#ec221f] rounded-lg py-1">
  //           계정 삭제
  //         </button>
  //         <button className="w-24 text-sm text-white bg-gray-700 rounded-lg py-1">
  //           수정
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default EditProfile;
