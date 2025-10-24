import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BooksState, Book } from "../../types/book.types";

const initialState: BooksState = {
  items: {
    version: "",
    logo: "",
    title: "",
    item: [],
  },
  loading: false,
  error: null,
  currentBook: null,  // 추가!
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
    setCurrentBook: (state, action: PayloadAction<Book | null>) => {
      state.currentBook = action.payload;
    },
  },
});

export const { 
  fetchBooksStart, 
  fetchBooksSuccess, 
  fetchBooksFailure, 
  setCurrentBook
} = booksSlice.actions;

export default booksSlice.reducer;
