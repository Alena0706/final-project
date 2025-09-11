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
  }): Promise<FranchiseT> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await axiosInstance.post(`/franchise/my/${franchiseId.toString()}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const validatedResponse = FranchiseSchema.parse(response.data);
    return validatedResponse;
  }

  static async updateFranchise(franchise: FranchiseUpdateT): Promise<FranchiseT> {
    const response = await axiosInstance.put(`/franchise/my/${String(franchise.id)}`, franchise);
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
