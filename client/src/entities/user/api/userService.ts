import axiosInstance from '@/shared/api/axiosInstance';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  admin: boolean;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

class UserService {
  // Получить всех пользователей (только админ)
  static async getAllUsers(): Promise<UsersResponse> {
    const response = await axiosInstance.get('/auth/users');
    return response.data;
  }
}

export default UserService;
