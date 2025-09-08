import axiosInstance from '@/shared/api/axiosInstance';
import { FranchiseSchema } from '../model/schemas';
import type { FranchiseT } from '../model/types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class FranchiseService {
  static async getAllFranchises(): Promise<FranchiseT[]> {
    const response = await axiosInstance.get('/api/franchise');
    const validatedResponse = FranchiseSchema.array().parse(response.data);
    return validatedResponse;
  }
}

export default FranchiseService;
