import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CreateInvoiceRequest, Invoice } from '../api/invoiceService';
import InvoiceService from '../api/invoiceService';
import {
  setInvoices,
  setCurrentInvoice,
  setLoading,
  setError,
  setPagination,
  updateInvoice,
} from './slice';

// Получить счета пользователя
export const fetchUserInvoices = createAsyncThunk(
  'invoice/fetchUserInvoices',
  async (params: { page?: number; limit?: number; status?: string } = {}, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.getUserInvoices(params);
      dispatch(setInvoices(response.data.invoices));
      dispatch(setPagination(response.data.pagination));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка загрузки счетов'
          : 'Ошибка загрузки счетов';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Получить все счета (админ)
export const fetchAllInvoices = createAsyncThunk(
  'invoice/fetchAllInvoices',
  async (
    params: { page?: number; limit?: number; status?: string; userId?: number } = {},
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.getAllInvoices(params);
      dispatch(setInvoices(response.data.invoices));
      dispatch(setPagination(response.data.pagination));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка загрузки счетов'
          : 'Ошибка загрузки счетов';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Получить детали счета
export const fetchInvoiceDetails = createAsyncThunk(
  'invoice/fetchInvoiceDetails',
  async (invoiceId: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.getInvoiceDetails(invoiceId);
      dispatch(setCurrentInvoice(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка загрузки счета'
          : 'Ошибка загрузки счета';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Создать счет (админ)
export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (data: CreateInvoiceRequest, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.createInvoice(data);
      dispatch(setCurrentInvoice(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка создания счета'
          : 'Ошибка создания счета';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Оплатить счет
export const payInvoice = createAsyncThunk(
  'invoice/payInvoice',
  async (invoiceId: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.payInvoice(invoiceId);

      // Обновляем счет в списке
      const updatedInvoice = {
        ...response.data.invoice,
        status: 'paid' as const,
        paidAt: response.data.invoice.paidAt,
      } as Invoice;
      dispatch(updateInvoice(updatedInvoice));

      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка оплаты счета'
          : 'Ошибка оплаты счета';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

// Отменить счет (админ)
export const cancelInvoice = createAsyncThunk(
  'invoice/cancelInvoice',
  async (invoiceId: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await InvoiceService.cancelInvoice(invoiceId);
      dispatch(updateInvoice(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            'Ошибка отмены счета'
          : 'Ошибка отмены счета';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);
