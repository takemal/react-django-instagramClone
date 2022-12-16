import { myprofileURL, profilesURL } from '../urls/index';
import { Action, createAsyncThunk, createSelector, createSlice, Dispatch } from '@reduxjs/toolkit';
import { Authen, Profile } from '../types/type';
import axios from 'axios';
import { jwtURL, registerURL } from '../urls';
import { RootState } from './store';
import { isLoadingAction } from './fetchState';

// ユーザー情報の初期化
export const initialProfileState = {
  // モーダル
  myprofile: {
    id: 0,
    nickName: '',
    user_id: 0,
    created_at: '',
    img: '',
  },
  profiles: [
    {
      id: 0,
      nickName: '',
      user_id: 0,
      created_at: '',
      img: '',
    },
  ],
};

//prettier-ignore
//ログイン
export const asyncLogin = createAsyncThunk('auth/post', async (data: Authen, thunkAPI) => {
  thunkAPI.dispatch(isLoadingAction(true))
  return axios.post(jwtURL, data, {
    headers: {
        'Content-Type': 'application/json',
      },
  })
    .then(res => { return res.data })
    .catch((e) => console.error(e))
});

//prettier-ignore
//ユーザ登録
export const asyncRegister = createAsyncThunk('auth/register', async (data: Authen) => {
  console.log(data)
  return await axios.post(registerURL, data, {
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

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialProfileState,
  reducers: {
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

export const profileReducer = profileSlice.reducer;
export const { editNickNameAction } = profileSlice.actions;

// state情報をそのままとる
export const selectProfile = (state: RootState) => state.profile;

// セレクター
const profileSelector = (state: RootState) => state.profile;
export const getProfiles = createSelector([profileSelector], (state) => state.profiles);

export const getMyProfile = createSelector([profileSelector], (state) => state.myprofile);
