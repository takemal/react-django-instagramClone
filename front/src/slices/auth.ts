import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Authen, Profile } from '../types/type';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

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

// ログイン
export const fetchAsyncLogin = createAsyncThunk('auth/post', async (authen: Authen) => {
  const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

// サインアップ
export const fetchAsyncRegister = createAsyncThunk('auth/register', async (auth: Authen) => {
  const res = await axios.post(`${apiUrl}api/register/`, auth, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

// プロフィール作成
export const fetchAsyncCreateProf = createAsyncThunk('profile/post', async (nickName: string) => {
  const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

// プロフィール更新
export const fetchAsyncUpdateProf = createAsyncThunk('profile/put', async (profile: Profile) => {
  const uploadData = new FormData();
  uploadData.append('nickName', profile.nickName);
  profile.img && uploadData.append('img', profile.img, profile.img.name);
  const res = await axios.put(`${apiUrl}api/profile/${profile.id}/`, uploadData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

// ログインしているユーザを取得する
export const fetchAsyncGetMyProf = createAsyncThunk('profile/get', async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

// プロフィールを全件取得する
export const fetchAsyncGetProfs = createAsyncThunk('profiles/get', async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
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
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem('localJWT', action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
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
