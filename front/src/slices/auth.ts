import { myprofileURL, profilesURL, profileURL } from './../urls/index';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Authen, Profile } from '../types/type';
import axios from 'axios';
import { jwtURL, registerURL } from '../urls';
import { RootState } from './store';

// ユーザー情報の初期化
export const initialAuthState = {
  // モーダル
  openSignIn: true,
  openSignUp: false,
  openProfile: false,
  isLoadingAuth: false,
  myprofile: {
    id: 0,
    nickName: '',
    userProfile: 0,
    created_on: '',
    img: '',
  },
  profiles: [
    {
      id: 0,
      nickName: '',
      userProfile: 0,
      created_on: '',
      img: '',
    },
  ],
};

//prettier-ignore
//ログイン
export const asyncLogin = createAsyncThunk('auth/post', async (authData: Authen) => {
  return axios.post(jwtURL, authData, {
    headers: {
        'Content-Type': 'application/json',
      },
  })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
});

//prettier-ignore
//ユーザ登録
export const asyncRegister = createAsyncThunk('auth/register', async (authData: Authen) => {
  return await axios.post(registerURL, authData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
});

//プロフィール作成(名前のみ)
//prettier-ignore
export const asyncCreateProf = createAsyncThunk('profile/post', async (nickName: string) => {
  return await axios.post(profilesURL, {nickName:nickName}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  .then(res => { return res.data })
  .catch((e) => console.error(e))
});

//プロフィール更新
//prettier-ignore
export const asyncUpdateProf = createAsyncThunk('profile/put', async (profile: Profile) => {
  const uploadData = new FormData();
  uploadData.append('nickName', profile.nickName);
  profile.img && uploadData.append('img', profile.img, profile.img.name);
  return await axios.put(profilesURL, uploadData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  .then(res => { return res.data })
  .catch((e) => console.error(e))
});

//ログインユーザプロフィール取得
//prettier-ignore
export const asyncGetMyProf = createAsyncThunk('profile/get', async () => {
  return await axios.get(myprofileURL, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
    // 配列で返るため、[0]指定
    .then(res => { return res.data[0] })
    .catch((e) => console.error(e))
});

//プロフィール全件取得
//prettier-ignore
export const asyncGetProfs = createAsyncThunk('profiles/get', async () => {
  return await axios.get(profilesURL, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  .then(res => { return res.data })
  .catch((e) => console.error(e))
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    // fetchの開始
    fetchStartAction: (state) => {
      return { ...state, isLoadingAuth: true };
    },

    // fetchの終了
    fetchEndAction: (state) => {
      return { ...state, isLoadingAuth: false };
    },
    // サインインモード
    setOpenSignInAction: (state) => {
      return { ...state, openSignIn: true };
    },
    // サインインモード解除
    resetOpenSignInAction: (state) => {
      return { ...state, openSignIn: false };
    },
    // サインアップモード
    setOpenSignUpAction: (state) => {
      return { ...state, openSignUp: true };
    },
    // サインアップモード解除
    resetOpenSignUpAction: (state) => {
      return { ...state, openSignUp: false };
    },
    // プロフィールモード
    setOpenProfileAction: (state) => {
      return { ...state, openProfile: true };
    },
    // プロフィールモード解除
    resetOpenProfileAction: (state) => {
      return { ...state, openProfile: false };
    },
    // プロフィール編集
    editNickNameAction: (state, action) => {
      state.myprofile.nickName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncLogin.fulfilled, (state, action) => {
      localStorage.setItem('localJWT', action.payload.access);
    });
    builder.addCase(asyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(asyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(asyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(asyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) => (prof.id === action.payload.id ? action.payload : prof));
    });
  },
});

export const authReducer = authSlice.reducer;
export const {
  fetchStartAction,
  fetchEndAction,
  setOpenSignInAction,
  resetOpenSignInAction,
  setOpenSignUpAction,
  resetOpenSignUpAction,
  setOpenProfileAction,
  resetOpenProfileAction,
  editNickNameAction,
} = authSlice.actions;

// state情報をそのままとる
export const selectAuth = (state: RootState) => state.auth;
