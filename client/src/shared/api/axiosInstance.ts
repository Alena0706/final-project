import type { AxiosError } from 'axios';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Включаем отправку cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для получения токена из localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Функция для сохранения токена в localStorage
const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// Функция для удаления токена из localStorage
const removeAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Sending request with token:', token.substring(0, 20) + '...');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: { sent: boolean } }) => {
    const prev = err.config;

    if (prev && err.response?.status === 403 && !prev.sent) {
      prev.sent = true;
      try {
        const response = await axios.get<{ user: any; accessToken: string }>('/api/auth/refresh', {
          withCredentials: true,
        });
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        prev.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(prev);
      } catch (refreshError) {
        // Если refresh не удался, удаляем токен и перенаправляем на логин
        removeAccessToken();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);

// Экспортируем функции для управления токенами
export { setAccessToken, removeAccessToken, getAccessToken };
export default axiosInstance;
