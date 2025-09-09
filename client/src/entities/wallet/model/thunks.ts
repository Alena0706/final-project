import { createAsyncThunk } from '@reduxjs/toolkit';
import WalletService, { TopUpRequest } from '../api/walletService';
import { setBalance, setLoading, setError, addTransaction } from './slice';

// Получить данные кошелька
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await WalletService.getWallet();
      dispatch(setBalance(response.data.balance));
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка загрузки кошелька'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Пополнить кошелек
export const topUpWallet = createAsyncThunk(
  'wallet/topUpWallet',
  async (data: TopUpRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await WalletService.topUpWallet(data);
      dispatch(setBalance(response.data.balance));
      dispatch(addTransaction({
        id: response.data.transaction.id.toString(),
        amount: response.data.transaction.amount,
        date: response.data.transaction.createdAt
      }));
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Ошибка пополнения кошелька'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
