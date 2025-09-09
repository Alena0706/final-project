import { AuthResponseSchema } from '../model/schemas';
import type { AuthResponseT, UserLoginT, UserRegisterT, UserUpdateT } from '../model/types';
import axiosInstance from '@/shared/api/axiosInstance';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserServices {
  static async register(user: UserRegisterT): Promise<AuthResponseT> {
    const response = await axiosInstance.post('/auth/signup', user);
    return AuthResponseSchema.parse(response.data);
  }

  static async updateUser(user: UserUpdateT): Promise<AuthResponseT> {
    console.log(user);
    const updateUser = await axiosInstance.patch('/auth/update', user);
    console.log(updateUser);
    return AuthResponseSchema.parse(updateUser.data);
  }

  static async uploadAvatar(formData: FormData): Promise<unknown> {
    const response = await axiosInstance.post('/auth/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Указываем, что отправляем файл
      },
    });
    return response.data;
  }

  static async login(user: UserLoginT): Promise<AuthResponseT> {
    console.log('Attempting login for:', user.email);
    try {
      const response = await axiosInstance.post('/auth/signin', user);
      console.log('Login successful:', response.status);
      console.log('Raw response data:', response.data);
      const parsedData = AuthResponseSchema.parse(response.data);
      console.log('Parsed data:', parsedData);
      console.log('Parsed user admin:', parsedData.user.admin);
      return parsedData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async refresh(): Promise<AuthResponseT> {
    const response = await axiosInstance.get('/auth/refresh');
    return AuthResponseSchema.parse(response.data);
  }

  static async logout(): Promise<void> {
    await axiosInstance.delete('/auth/logout');
  }

  static async verify2FA(token: string, email: string): Promise<AuthResponseT> {
    const response = await axiosInstance.post('/auth/verify2FA', { token, email });
    return AuthResponseSchema.parse(response.data);
  }
}

export default UserServices;
