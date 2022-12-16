import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

// ユーザー情報の初期化
export const initialModalState = {
  openSignUp: false,
  openSignIn: true,
  openProfile: false,
  openNewPost: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    openModalAction: (state, action) => {
      if (action.payload === 'signUp') {
        state.openSignIn = false;
        state.openSignUp = true;
        state.openProfile = false;
        state.openNewPost = false;
      }
      if (action.payload === 'signIn') {
        state.openSignIn = true;
        state.openSignUp = false;
        state.openProfile = false;
        state.openNewPost = false;
      }
      if (action.payload === 'profile') {
        state.openSignIn = false;
        state.openSignUp = false;
        state.openProfile = true;
        state.openNewPost = false;
      }
      if (action.payload === 'newPost') {
        state.openSignIn = false;
        state.openSignUp = false;
        state.openProfile = false;
        state.openNewPost = true;
      }
    },
    closeModalAction: (state) => {
      state.openSignIn = false;
      state.openSignUp = false;
      state.openProfile = false;
      state.openNewPost = false;
    },
  },
});

export const modalReducer = modalSlice.reducer;
export const { openModalAction, closeModalAction } = modalSlice.actions;
// state情報をそのままとる
export const selectModal = (state: RootState) => state.modal;
