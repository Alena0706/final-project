import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type Transaction = {
  id: string;
  amount: number;
  date: string;
};

type WalletState = {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
};

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setBalance, addTransaction, setLoading, setError } = walletSlice.actions;

export default walletSlice.reducer;
