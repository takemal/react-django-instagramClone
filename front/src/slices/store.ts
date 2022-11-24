import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Stateの型定義
export type RootState = {
  auth: ReturnType<typeof authReducer>;
};

// dispatch設定
export type AppDispatch = typeof store.dispatch;
