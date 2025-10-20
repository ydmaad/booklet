import type { Review } from './../../types/book.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

type ReviewState = {
  myReviews: Review[];
  allReviews: Review[];
  myReviewsLoading: boolean;
  allReviewsLoading: boolean;
  myReviewsError: string | null;
  allReviewsError: string | null;
};

const initialState: ReviewState = {
  myReviews: [],
  allReviews: [],
  myReviewsLoading: false,
  allReviewsLoading: false,
  myReviewsError: null,
  allReviewsError: null,
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

const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('book_reviews').select('*');
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
        state.myReviewsLoading = true;
        state.myReviewsError = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload;
        state.myReviewsLoading = false;
        state.myReviewsError = null;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.myReviewsLoading = false;
        state.myReviewsError = action.payload as string;
      })
      .addCase(fetchAllReviews.pending, (state) => {
        state.allReviewsLoading = true;
        state.allReviewsError = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.allReviews = action.payload;
        state.allReviewsLoading = false;
        state.allReviewsError = null;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.allReviewsLoading = false;
        state.allReviewsError = action.payload as string;
      });
  },
});

export { fetchMyReviews, fetchAllReviews };
export default reviewSlice.reducer;
