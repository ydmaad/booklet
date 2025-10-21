import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage 사용
import booksReducer from './slices/booksSlice';
import authReducer from './slices/authSlice';
import reviewReducer from './slices/reviewsSlice';

// Persist 설정
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // auth 상태만 저장 (원하는 reducer만 선택 가능)
};

// Root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  reviews: reviewReducer,
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor 생성 (나중에 main.tsx에서 사용)
export const persistor = persistStore(store);

// TypeScript 타입 export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
