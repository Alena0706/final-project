import axios from 'axios';
import { AuthResponseSchema } from '../model/schemas';
import type { AuthResponseT, UserLoginT, UserRegisterT, UserUpdateT } from '../model/types';
import axiosInstance from '@/shared/api/axiosInstance';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserServices {
  static async register(user: UserRegisterT): Promise<AuthResponseT> {
    const response = await axios.post('/auth/signup', user, {
      withCredentials: true,
      baseURL: '/api',
    });
    return AuthResponseSchema.parse(response.data);
  }

  static async updateUser(user: UserUpdateT): Promise<AuthResponseT> {
    console.log(user);
    const updateUser = await axiosInstance.patch('/auth/update', user);
    console.log(updateUser);
    return AuthResponseSchema.parse(updateUser.data);
  }

  static async uploadAvatar(formData: FormData): Promise<any> {
    const response = await axiosInstance.post('/auth/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Указываем, что отправляем файл
      },
    });
    return response.data;
  }

  static async login(user: UserLoginT): Promise<AuthResponseT> {
    const response = await axios.post('/auth/signin', user, {
      withCredentials: true,
      baseURL: '/api',
    });
    return AuthResponseSchema.parse(response.data);
  }

  static async refresh(): Promise<AuthResponseT> {
    const response = await axios.get('/auth/refresh', {
      withCredentials: true,
      baseURL: '/api', // Добавляем baseURL для корректной работы
    });
    return AuthResponseSchema.parse(response.data);
  }

  static async logout(): Promise<void> {
    await axios.delete('/auth/logout', {
      withCredentials: true,
      baseURL: '/api',
    });
  }

  static async verify2FA(token: string, email: string): Promise<AuthResponseT> {
    const response = await axios.post('/auth/verify2FA', { token, email }, {
      withCredentials: true,
      baseURL: '/api',
    });
    return AuthResponseSchema.parse(response.data);
  }
}

export default UserServices;
