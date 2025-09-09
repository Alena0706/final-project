import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Invoice } from '../api/invoiceService';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoices(state, action: PayloadAction<Invoice[]>) {
      state.invoices = action.payload;
    },
    setCurrentInvoice(state, action: PayloadAction<Invoice | null>) {
      state.currentInvoice = action.payload;
    },
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.invoices.unshift(action.payload);
    },
    updateInvoice(state, action: PayloadAction<Invoice>) {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
      if (state.currentInvoice?.id === action.payload.id) {
        state.currentInvoice = action.payload;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setPagination(state, action: PayloadAction<{
      page: number;
      limit: number;
      total: number;
      pages: number;
    }>) {
      state.pagination = action.payload;
    },
    clearInvoices(state) {
      state.invoices = [];
      state.currentInvoice = null;
      state.error = null;
    },
  },
});

export const {
  setInvoices,
  setCurrentInvoice,
  addInvoice,
  updateInvoice,
  setLoading,
  setError,
  setPagination,
  clearInvoices,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
