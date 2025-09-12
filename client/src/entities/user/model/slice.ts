import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllUsers } from './thunks';
import type { User } from '../api/userService';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<{ success: boolean; data: User[] }>) => {
        state.loading = false;
        state.users = action.payload.data;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
