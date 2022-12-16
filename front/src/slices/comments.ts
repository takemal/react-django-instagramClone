import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Comment } from '../types/post';
import { commentsURL } from '../urls';
import { RootState } from './store';

export const initialCommentsState = [
  {
    id: 0,
    text: '',
    user_id: 0,
    post_id: 0,
  },
];

//コメント一覧取得
export const asyncGetComments = createAsyncThunk('comment/get', async () => {
  const res = await axios.get(commentsURL, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

//コメント新規作成
export const asyncPostComment = createAsyncThunk('comment/post', async (comment: Comment) => {
  const res = await axios.post(commentsURL, comment, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: initialCommentsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncGetComments.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(asyncPostComment.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
  },
});

export const commentsReducer = commentsSlice.reducer;

// state情報をそのままとる
export const selectComments = (state: RootState) => state.comments;
