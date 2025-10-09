import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import type { Profile, AuthState } from '../../types/user.types';

// 초기 상태
const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
};

// ========================================
// 비동기 Thunk Actions
// ========================================

// 회원가입
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
      // 1. 닉네임 중복 체크
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('이미 사용 중인 닉네임입니다.');
      }

      // 2. 회원가입 (auth.users에 계정 생성)
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

// 로그인
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
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
        .maybeSingle();

      if (profileError) {
        console.error('프로필 조회 실패:', profileError);        
        throw new Error('프로필을 불러올 수 없습니다.');
      }

      return { user: authData.user, profile };
    } catch (error: any) {
      console.error('로그인 에러:', error);
      return rejectWithValue(error.message || '로그인에 실패했습니다.');
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

      // 닉네임 변경 시 중복 확인
      if (updates.nickname && updates.nickname !== state.auth.profile?.nickname) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('nickname', updates.nickname)
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

// ========================================
// Slice
// ========================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
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
      // 로그인
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(login.rejected, (state, action) => {
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
      });
  },
});

export const { clearError, setProfile } = authSlice.actions;
export default authSlice.reducer;