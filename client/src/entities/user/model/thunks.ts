import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService, { type UsersResponse } from '../api/userService';

export const getAllUsers = createAsyncThunk<UsersResponse, void>(
  'user/getAllUsers',
  async () => {
    const response = await UserService.getAllUsers();
    return response;
  }
);
