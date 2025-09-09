import axiosInstance from '@/shared/api/axiosInstance';

export interface Notification {
  id: number;
  userId: number;
  type: 'invoice_reminder' | 'payment_reminder' | 'invoice_generated' | 'payment_received' | 'manual';
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface NotificationListResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface SendNotificationRequest {
  userId?: number;
  title: string;
  message: string;
  sendEmail?: boolean;
  userType?: 'all' | 'user' | 'admin';
}

class NotificationService {
  // Получить уведомления пользователя
  static async getUserNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<NotificationListResponse> {
    const response = await axiosInstance.get('/notifications/my', { params });
    return response.data;
  }

  // Получить все уведомления (админ)
  static async getAllNotifications(params?: {
    page?: number;
    limit?: number;
    userId?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<NotificationListResponse> {
    const response = await axiosInstance.get('/notifications/all', { params });
    return response.data;
  }

  // Получить количество непрочитанных уведомлений
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  }

  // Отметить уведомление как прочитанное
  static async markAsRead(notificationId: number): Promise<{ success: boolean; data: any }> {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  // Отметить все уведомления как прочитанные
  static async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.patch('/notifications/mark-all-read');
    return response.data;
  }

  // Удалить уведомление
  static async deleteNotification(notificationId: number): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  // Отправить уведомление всем пользователям (админ)
  static async sendBroadcastNotification(data: SendNotificationRequest): Promise<{ success: boolean; data: any }> {
    const response = await axiosInstance.post('/notifications/broadcast', data);
    return response.data;
  }

  // Отправить уведомление конкретному пользователю (админ)
  static async sendUserNotification(data: SendNotificationRequest): Promise<{ success: boolean; data: any }> {
    const response = await axiosInstance.post('/notifications/send', data);
    return response.data;
  }
}

export default NotificationService;
