import { createAsyncThunk } from '@reduxjs/toolkit';
import NotificationService, { SendNotificationRequest } from '../api/notificationService';
import {
  setNotifications,
  setUnreadCount,
  setLoading,
  setError,
  setPagination,
  markAsRead,
  markAllAsRead,
  removeNotification,
  addNotification,
} from './slice';
import { forceRefreshTokens } from '@/shared/api/axiosInstance';

// Получить уведомления пользователя
export const fetchUserNotifications = createAsyncThunk(
  'notification/fetchUserNotifications',
  async (
    params: { page?: number; limit?: number; isRead?: boolean; type?: string } = {},
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await NotificationService.getUserNotifications(params);
      dispatch(setNotifications(response.data.notifications));
      dispatch(setPagination(response.data.pagination));
      return response.data;
    } catch (error: any) {
      // Если получили 401, пытаемся обновить токены и повторить запрос
      if (error?.response?.status === 401) {
        console.log('🔄 Получен 401 при загрузке уведомлений, пытаемся обновить токены...');
        const refreshSuccess = await forceRefreshTokens();
        if (refreshSuccess) {
          console.log('🔄 Повторяем загрузку уведомлений с обновленным токеном...');
          try {
            const response = await NotificationService.getUserNotifications(params);
            dispatch(setNotifications(response.data.notifications));
            dispatch(setPagination(response.data.pagination));
            return response.data;
          } catch (retryError) {
            console.error('❌ Повторная попытка загрузки уведомлений не удалась:', retryError);
            dispatch(setError('Ошибка загрузки уведомлений'));
            return rejectWithValue(retryError);
          }
        }
      }
      dispatch(setError(error.response?.data?.message || 'Ошибка загрузки уведомлений'));
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Получить все уведомления (админ)
export const fetchAllNotifications = createAsyncThunk(
  'notification/fetchAllNotifications',
  async (
    params: {
      page?: number;
      limit?: number;
      userId?: number;
      type?: string;
      isRead?: boolean;
    } = {},
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await NotificationService.getAllNotifications(params);
      dispatch(setNotifications(response.data.notifications));
      dispatch(setPagination(response.data.pagination));
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка загрузки уведомлений'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Получить количество непрочитанных уведомлений
export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await NotificationService.getUnreadCount();
      dispatch(setUnreadCount(response.data.unreadCount));
      return response.data.unreadCount;
    } catch (error: any) {
      // Если получили 401, пытаемся обновить токены и повторить запрос
      if (error?.response?.status === 401) {
        console.log('🔄 Получен 401 при загрузке количества уведомлений, пытаемся обновить токены...');
        const refreshSuccess = await forceRefreshTokens();
        if (refreshSuccess) {
          console.log('🔄 Повторяем загрузку количества уведомлений с обновленным токеном...');
          try {
            const response = await NotificationService.getUnreadCount();
            dispatch(setUnreadCount(response.data.unreadCount));
            return response.data.unreadCount;
          } catch (retryError) {
            console.error('❌ Повторная попытка загрузки количества уведомлений не удалась:', retryError);
            dispatch(setError('Ошибка загрузки количества уведомлений'));
            return rejectWithValue(retryError);
          }
        }
      }
      dispatch(setError(error.response?.data?.message || 'Ошибка загрузки количества уведомлений'));
      return rejectWithValue(error);
    }
  },
);

// Отметить уведомление как прочитанное
export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: number, { dispatch }) => {
    try {
      await NotificationService.markAsRead(notificationId);
      dispatch(markAsRead(notificationId));
      return notificationId;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка отметки уведомления'));
      throw error;
    }
  },
);

// Отметить все уведомления как прочитанные
export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { dispatch }) => {
    try {
      await NotificationService.markAllAsRead();
      dispatch(markAllAsRead());
      return true;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка отметки всех уведомлений'));
      throw error;
    }
  },
);

// Удалить уведомление
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: number, { dispatch }) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      dispatch(removeNotification(notificationId));
      return notificationId;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка удаления уведомления'));
      throw error;
    }
  },
);

// Отправить уведомление всем пользователям (админ)
export const sendBroadcastNotification = createAsyncThunk(
  'notification/sendBroadcastNotification',
  async (data: SendNotificationRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await NotificationService.sendBroadcastNotification(data);
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка отправки уведомления'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Отправить уведомление конкретному пользователю (админ)
export const sendUserNotification = createAsyncThunk(
  'notification/sendUserNotification',
  async (data: SendNotificationRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await NotificationService.sendUserNotification(data);
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка отправки уведомления'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Экспортируем addNotification для использования в WebSocket
export { addNotification };
