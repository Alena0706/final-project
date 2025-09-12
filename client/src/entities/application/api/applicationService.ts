import axiosInstance from '@/shared/api/axiosInstance';

export interface ApplicationData {
  name: string;
  phone: string;
  email: string;
  city?: string;
  message?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    notificationId: number;
  };
}

class ApplicationService {
  // Отправка заявки на франшизу
  async submitApplication(data: ApplicationData): Promise<ApplicationResponse> {
    const response = await axiosInstance.post('/applications/submit', data);
    return response.data;
  }
}

export default new ApplicationService();
