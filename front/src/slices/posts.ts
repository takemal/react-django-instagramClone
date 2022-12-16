import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Liked, NewPost } from '../types/post';
import { postsURL, postURL } from '../urls';
import { RootState } from './store';

// ユーザー情報の初期化
export const initialPostsState = [
  {
    id: 0,
    title: '',
    imgUrl: '',
    postUser_id: 0,
    likedUser_ids: [0],
    created_at: '',
  },
];

// 投稿取得
//prettier-ignore
export const asyncGetPosts = createAsyncThunk('post/get', async () => {
  return axios.get(postsURL, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
      },
  })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
});

// 投稿作成
//prettier-ignore
export const asyncNewPost = createAsyncThunk("post/post", async (newPost: NewPost) => {
    const uploadData = new FormData();
    uploadData.append("title", newPost.title);
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    const res = await axios.post(postsURL, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

// いいねした時の挙動
//prettier-ignore
export const asyncUpdateLiked = createAsyncThunk("post/patch", async (liked: Liked) => {
    const uploadData = new FormData();
    const currentIds=liked.currentLikedUser_ids
    const newId = liked.newLikedUser_id
    // uploadDataに今回いいねしたユーザid以外のid群を追加
    // 既存いいねが1つで、今回いいねしたuidと同一の場合、タイトルのみを残して置き換え
    currentIds.forEach((id) => {
      // idが今回いいねしたid以外の場合
      if (id !== newId) {
        uploadData.append("likedUser_Ids", String(id));
        // idが今回いいねしたidで既存いいねが1つの場合
      } else if (id === newId && currentIds.length === 1){
        uploadData.append("title", liked.title);
        return axios.put(postURL(liked.id), uploadData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          }
        })
        .then(res => { return res.data })
        .catch((e) => console.error(e))
      }
    }) 
    uploadData.append("likedUser_Ids", String(liked.newLikedUser_id));
    return await axios.patch(postURL(liked.id), uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState: initialPostsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncGetPosts.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(asyncNewPost.fulfilled, (state, action) => {
      return [...state, action.payload];
    });
    builder.addCase(asyncUpdateLiked.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.map((post) => (post.id === action.payload.id ? action.payload : post)),
      };
    });
  },
});

export const postsReducer = postsSlice.reducer;

// state情報をそのままとる
export const selectPosts = (state: RootState) => state.posts;
