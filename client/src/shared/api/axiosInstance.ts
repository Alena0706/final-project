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
const getAccessToken = (): string | null => localStorage.getItem('accessToken');

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
    console.log('Sending request with token:', `${token.substring(0, 20)}...`);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    console.log('Response received:', res.status, res.config.url);
    return res;
  },
  async (err: AxiosError & { config?: { sent: boolean } }) => {
    console.error('Response error:', err.response?.status, err.config?.url, err.message);

    const prev = err.config;

    if (prev && (err.response?.status === 401 || err.response?.status === 403) && !prev.sent) {
      // Проверяем, есть ли токен - если нет, то пользователь гость и не нужно пытаться обновить токен
      const currentToken = getAccessToken();
      if (!currentToken) {
        console.log('No token found, user is guest - not attempting refresh');
        return Promise.reject(err);
      }


      console.log('Attempting token refresh...');
      prev.sent = true;
      try {
        const response = await axios.get<{
          user: { id: number; email: string; name: string };
          accessToken: string;
        }>('/api/auth/refresh', {
          withCredentials: true,
        });
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        prev.headers.Authorization = `Bearer ${newToken}`;
        console.log('Token refreshed successfully');
        return await axiosInstance(prev);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Если refresh не удался, удаляем токен
        removeAccessToken();
        // Используем replace для избежания добавления в историю браузера
        window.location.replace('/signin');
        return Promise.reject(
          refreshError instanceof Error ? refreshError : new Error(String(refreshError)),
        );
      }
    }

    return Promise.reject(err);
  },
);

// Экспортируем функции для управления токенами
export { setAccessToken, removeAccessToken, getAccessToken };
export default axiosInstance;
