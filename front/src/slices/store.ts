import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
  },
});

// Stateの型定義
export type RootState = ReturnType<typeof store.getState>;

// dispatch設定
export type AppDispatch = typeof store.dispatch;
