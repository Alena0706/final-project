import axios from 'axios';
import { AuthResponseSchema, userUpdateResponseSchema } from '../model/schemas';
import type {
  AuthResponseT,
  UserLoginT,
  UserRegisterT,
  UserUpdateResponseT,
  UserUpdateT,
} from '../model/types';
import axiosInstance from '@/shared/api/axiosInstance';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserServices {
  static async register(user: UserRegisterT): Promise<AuthResponseT> {
    const response = await axios.post('/api/auth/signup', user);
    return AuthResponseSchema.parse(response.data);
  }

  static async updateUser(user: UserUpdateT): Promise<AuthResponseT> {
    const updateUser = await axiosInstance.patch('/auth/update', user);
    console.log(updateUser);
    return AuthResponseSchema.parse(updateUser.data);
  }

  static async uploadAvatar(formData: FormData): Promise<void> {
    await axiosInstance.post('/auth/upload', formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data', // Указываем, что отправляем файл
      },
    });
  }

  static async login(user: UserLoginT): Promise<AuthResponseT> {
    const response = await axios.post('/api/auth/signin', user);
    return AuthResponseSchema.parse(response.data);
  }

  static async refresh(): Promise<AuthResponseT> {
    const response = await axios.get('/api/auth/refresh');
    console.log(response.data);
    return AuthResponseSchema.parse(response.data);
  }

  static async logout(): Promise<void> {
    await axios.delete('/api/auth/logout');
  }

  static async verify2FA(token: string, email: string): Promise<AuthResponseT> {
    const response = await axios.post('/api/auth/verify2FA', { token, email });
    return AuthResponseSchema.parse(response.data);
  }
}

export default UserServices;
