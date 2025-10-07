import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/booksSlice";
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/signup/fulfilled', 'auth/checkSession/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
