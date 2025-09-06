import { createSlice } from '@reduxjs/toolkit';
import type { UserStateT } from './types';
import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  updateUser,
  uploadAvatar,
  verify2FA,
} from './thunks';

const initialState: UserStateT = {
  user: null,
  status: 'loading',
  error: null,
  secret: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(refreshUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload;
        state.status = 'logged';
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
      })
      .addCase(refreshUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'logged';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.error = null;
        console.log(action.payload);
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      });

    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'guest';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      });

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'logged';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.status = 'guest';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });
    builder
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.status = 'logged';
        state.user = action.payload;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(verify2FA.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      });

    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log(action.payload);
        if(state.user) {
          state.user = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'guest';
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
      });
  },
});

export default userSlice.reducer;
