import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import type { Profile, AuthState, DeletedAccountInfo } from '../../types/user.types';
import type { User } from '@supabase/supabase-js';

// 초기 상태
const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
  deletedAccountInfo: null,
};

// 복구 가능 기간 계산
const calculateDaysLeft = (deletedAt: string): number => {
  const deletedDate = new Date(deletedAt);
  const now = new Date();
  const daysElapsed = Math.floor(
    (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return 30 - daysElapsed;
};

// ========================================
// 비동기 Thunk Actions
// ========================================

// 회원가입(재가입 차단 로직 추가)
export const register = createAsyncThunk(
  'auth/register',
  async (
    { 
      email, 
      password, 
      nickname 
    }: { 
      email: string; 
      password: string; 
      nickname: string; 
    },
    { rejectWithValue }
  ) => {
    try {
      // 1. 탈퇴한 계정인지 확인
      const { data: deletedAccount } = await supabase
        .from('profiles')
        .select('is_deleted, deleted_at, email')
        .eq('email', email)
        .maybeSingle();

      if (deletedAccount && deletedAccount.is_deleted) {
        const daysLeft = calculateDaysLeft(deletedAccount.deleted_at);
        
        if (daysLeft > 0) {
          throw new Error(
            `이 이메일은 탈퇴 후 ${daysLeft}일이 남았습니다.\n로그인하여 계정을 복구하거나, ${daysLeft}일 후에 다시 시도해주세요.`
          );
        }
      }

      // 2. 닉네임 중복 체크
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .eq('is_deleted', false) // 활성 계정만 체크
        .maybeSingle();

      if (existingProfile) {
        throw new Error('이미 사용 중인 닉네임입니다.');
      }

      // 3. 회원가입 (auth.users에 계정 생성)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname, // 트리거에서 사용할 닉네임
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('회원가입에 실패했습니다.');

      // 3. 프로필 생성 (profiles 테이블)
      let profile = null;
      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (!error && data) {
          profile = data;
          break;
        }
      }

      if (!profile) {
        throw new Error('프로필 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }

      return {
        user: authData.user,
        profile,
      };
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      return rejectWithValue(error.message || '회원가입에 실패했습니다.');
    }
  }
);

// 로그인(탈퇴 계정 감지 추가)
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 1. 탈퇴한 계정인지 먼저 확인
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('is_deleted, deleted_at, email')
        .eq('email', email)
        .maybeSingle();

      if (profileCheck && profileCheck.is_deleted) {
        const daysLeft = calculateDaysLeft(profileCheck.deleted_at);

        // 복구 가능 기간이 지났으면
        if (daysLeft <= 0) {
          throw new Error('탈퇴 후 30일이 지나 계정이 삭제되었습니다.');
        }

        // 복구 가능하면 정보 반환 (에러로 처리하여 복구 모달 표시)
        return rejectWithValue({
          type: 'ACCOUNT_DELETED',
          message: '탈퇴한 계정입니다. 복구하시겠습니까?',
          deletedAccountInfo: {
            email: profileCheck.email,
            deleted_at: profileCheck.deleted_at,
            days_left: daysLeft,
          },
        });
      }

      // 1. 로그인 (auth.users에서 인증)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('로그인에 실패했습니다.');

      // 2. 프로필 정보 가져오기
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .eq('is_deleted', false) // 🆕 활성 계정만
        .maybeSingle();

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);        
        throw new Error('프로필을 불러올 수 없습니다.');
      }

      return { user: authData.user, profile };
    } catch (error: any) {
      console.error('로그인 에러:', error);

      // 🆕 탈퇴 계정인 경우 특별 처리
      if (error.type === 'ACCOUNT_DELETED') {
        return rejectWithValue(error);
      }
      
      return rejectWithValue(error.message || '로그인에 실패했습니다.');
    }
  }
);

// 🆕 탈퇴한 계정 복구
export const recoverAccount = createAsyncThunk(
  'auth/recoverAccount',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // 1. 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('인증에 실패했습니다.');

      // 2. 프로필 복구
      const { data: profile, error: recoverError } = await supabase
        .from('profiles')
        .update({
          is_deleted: false,
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id)
        .select()
        .maybeSingle();

      if (recoverError || !profile) {
        throw new Error('계정 복구에 실패했습니다.');
      }

      // 3. 리뷰도 복구 (있다면)
      // await supabase
      //   .from('book_reviews')
      //   .update({
      //     is_deleted: false,
      //     deleted_at: null,
      //   })
      //   .eq('user_id', authData.user.id);

      return {
        user: authData.user,
        profile,
      };
    } catch (error: any) {
      console.error('계정 복구 에러:', error);
      return rejectWithValue(error.message || '계정 복구에 실패했습니다.');
    }
  }
);

// 로그아웃
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // ✅ 로그아웃 성공하면 localStorage도 비움
      // (이 부분은 extraReducers의 logout.fulfilled에서 처리 가능)
    } catch (error: any) {
      console.error('로그아웃 에러:', error);
      return rejectWithValue(error.message || '로그아웃에 실패했습니다.');
    }
  }
);

// 세션 체크 (새로고침 시 자동 로그인)
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session?.user) {
        return { user: null, profile: null };
      }

      // 프로필 정보 가져오기
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .eq('is_deleted', false)
        .maybeSingle();

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);
        return { user: session.user, profile: null };
      }

      return { user: session.user, profile };
    } catch (error: any) {
      console.error('세션 체크 에러:', error);
      return rejectWithValue(error.message);
    }
  }
);

// 프로필 조회
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (error) throw error;
    return data as Profile;
  }
);

// 프로필 업데이트 Thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    updates: {
      nickname?: string;
      bio?: string;
      keywords?: string[];
      avatar_url?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;

      if (!userId) {
        throw new Error('로그인이 필요합니다.');
      }

      // 닉네임 변경 시 중복 확인(활성 계정만)
      if (updates.nickname && updates.nickname !== state.auth.profile?.nickname) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('nickname', updates.nickname)
          .eq('is_deleted', false) 
          .maybeSingle();

        if (existingProfile) {
          return rejectWithValue('이미 사용 중인 닉네임입니다.');
        }
      }

      // 프로필 업데이트
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('프로필 업데이트에 실패했습니다.');

      return data;
    } catch (error: any) {
      console.error('프로필 업데이트 오류:', error);
      return rejectWithValue(error.message || '프로필 업데이트에 실패했습니다.');
    }
  }
);

// 비밀번호 변경 Thunk
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      // 현재 비밀번호 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('사용자 정보를 찾을 수 없습니다.');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('현재 비밀번호가 일치하지 않습니다.');
      }

      // 새 비밀번호로 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return true;
    } catch (error: any) {
      console.error('비밀번호 변경 오류:', error);
      return rejectWithValue(error.message || '비밀번호 변경에 실패했습니다.');
    }
  }
);

// 회원탈퇴 (Soft Delete)
export const softDeleteAccount = createAsyncThunk(
  'auth/softDeleteAccount',
  async (userId: string, { rejectWithValue }) => {
    try {
      // 1. 프로필 soft delete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // 2. 리뷰도 soft delete
      // const { error: reviewError } = await supabase
      //   .from('book_reviews')
      //   .update({
      //     is_deleted: true,
      //     deleted_at: new Date().toISOString(),
      //   })
      //   .eq('user_id', userId);

      // if (reviewError) throw reviewError;

      // 3. 로그아웃
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      return true;
    } catch (error: any) {
      console.error('회원탈퇴 에러:', error);
      return rejectWithValue(error.message || '회원탈퇴에 실패했습니다.');
    }
  }
);

// ========================================
// Slice
// ========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    // 🆕 탈퇴 계정 정보 설정
    setDeletedAccountInfo: (
      state,
      action: PayloadAction<DeletedAccountInfo | null>
    ) => {
      state.deletedAccountInfo = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.error = null;
      state.deletedAccountInfo = null; // 🆕 추가
    },
    clearError: (state) => {
      state.error = null;
      state.deletedAccountInfo = null; // 🆕 추가
    },    
  },
  extraReducers: (builder) => {
    builder
      // 회원가입
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 로그인 (🆕 탈퇴 계정 감지 처리)
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deletedAccountInfo = null; // 🆕 초기화
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        const payload = action.payload;

        // 🆕 탈퇴 계정인 경우 특별 처리
        if (payload?.type === 'ACCOUNT_DELETED') {
          state.deletedAccountInfo = payload.deletedAccountInfo;
          state.error = payload.message;
        } else {
          state.error = typeof payload === 'string' ? payload : '로그인에 실패했습니다.';
        }
      })
      // 🆕 계정 복구
      .addCase(recoverAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recoverAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.deletedAccountInfo = null; // 복구 완료
      })
      .addCase(recoverAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 로그아웃
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        // ✅ Redux Persist가 자동으로 localStorage에서 삭제함
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 세션 확인
      .addCase(checkSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.profile = action.payload.profile;
        }
      })
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // 프로필 업데이트
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 비밀번호 변경
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // softDeleteAccount
      .addCase(softDeleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
      })
      .addCase(softDeleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setProfile, setDeletedAccountInfo, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;