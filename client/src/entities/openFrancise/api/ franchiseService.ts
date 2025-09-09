import axiosInstance from '@/shared/api/axiosInstance';
import { FranchiseSchema } from '../model/schemas';
import type { FranchiseT, FranchiseUpdateT } from '../model/types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class FranchiseService {
  static async getAllFranchises(): Promise<FranchiseT[]> {
    const response = await axiosInstance.get('/franchise');
    console.log(response.data);
    const validatedResponse = FranchiseSchema.array().parse(response.data);
    console.log(validatedResponse);
    return validatedResponse;
  }

  static async uploadImage({
    image,
    franchiseId,
  }: {
    image: File;
    franchiseId: number;
  }): Promise<void> {
    await axiosInstance.post(
      '/franchise/upload',
      { image, franchiseId },
      {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data', // Указываем, что отправляем файл
        },
      },
    );
  }

  static async updateFranchise(franchise: FranchiseUpdateT): Promise<FranchiseT> {
    const response = await axiosInstance.patch('/franchise', franchise);
    const validatedResponse = FranchiseSchema.parse(response.data);
    return validatedResponse;
  }

  static async createFranchise(formData: FormData): Promise<FranchiseT> {
    const response = await axiosInstance.post('/franchise', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const validatedResponse = FranchiseSchema.parse(response.data);
    return validatedResponse;
  }

  static async deleteFranchise(franchiseId: number): Promise<void> {
    await axiosInstance.delete(`/franchise/${franchiseId.toString()}`);
  }
}

export default FranchiseService;
