import axiosInstance from '@/shared/api/axiosInstance';

export interface Wallet {
  id: number;
  userId: number;
  balance: number;
}

export interface Transaction {
  id: number;
  walletId: number;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  adminId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WalletResponse {
  success: boolean;
  data: {
    id: number;
    balance: number;
    transactions: Transaction[];
  };
}

export interface TopUpRequest {
  amount: number;
  description?: string;
}

export interface TopUpResponse {
  success: boolean;
  data: {
    balance: number;
    transaction: Transaction;
  };
}

class WalletService {
  // Получить данные кошелька
  static async getWallet(): Promise<WalletResponse> {
    const response = await axiosInstance.get('/wallet');
    return response.data;
  }

  // Пополнить кошелек
  static async topUpWallet(data: TopUpRequest): Promise<TopUpResponse> {
    const response = await axiosInstance.post('/wallet/topup', data);
    return response.data;
  }
}

export default WalletService;
