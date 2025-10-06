import { createSlice } from "@reduxjs/toolkit";
import type { BooksState } from "../../types/book.types";

const initialState: BooksState = {
  items: [],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    fetchBooksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBooksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure } =
  booksSlice.actions;
export default booksSlice.reducer;
