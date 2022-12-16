import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

// ユーザー情報の初期化
export const initialFetchState = {
  isLoading: false,
  getErr: '',
};

export const fetchStateSlice = createSlice({
  name: 'fetchState',
  initialState: initialFetchState,
  reducers: {
    isLoadingAction: (state, action) => {
      state.isLoading = action.payload;
    },
    getErrAction: (state, action) => {
      state.getErr = action.payload;
    },
  },
});

export const fetchStateReducer = fetchStateSlice.reducer;
export const { isLoadingAction, getErrAction } = fetchStateSlice.actions;

// state情報をそのままとる
export const selectFetchState = (state: RootState) => state.fetchState;
