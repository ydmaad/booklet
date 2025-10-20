import type { Review } from './../../types/book.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

type ReviewState = {
  myReviews: Review[];
  loading: boolean;
  error: string | null;
};

const initialState: ReviewState = {
  myReviews: [],
  loading: false,
  error: null,
};

const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export { fetchMyReviews };
export default reviewSlice.reducer;
