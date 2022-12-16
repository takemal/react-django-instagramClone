import { configureStore } from '@reduxjs/toolkit';
import { profileReducer } from './profile';
import { postsReducer } from './posts';
import { modalReducer } from './modal';
import { fetchStateReducer } from './fetchState';
import { commentsReducer } from './comments';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    posts: postsReducer,
    comments: commentsReducer,
    modal: modalReducer,
    fetchState: fetchStateReducer,
  },
});

// Stateの型定義
export type RootState = ReturnType<typeof store.getState>;

// dispatch設定
export type AppDispatch = typeof store.dispatch;
