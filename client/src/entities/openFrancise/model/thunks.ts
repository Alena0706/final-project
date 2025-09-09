import { createAsyncThunk } from '@reduxjs/toolkit';
import FranchiseService from '../api/ franchiseService';
import type { FranchiseCreateT, FranchiseUpdateT } from './types';

export const getAllFranchises = createAsyncThunk('franchise/getAllFranchises', async () =>
  FranchiseService.getAllFranchises(),
);
export const updateFranchise = createAsyncThunk(
  'franchise/updateFranchise',
  async (franchise: FranchiseUpdateT) => FranchiseService.updateFranchise(franchise),
);
export const createFranchise = createAsyncThunk(
  'franchise/createFranchise',
  async (franchise: FranchiseCreateT) => FranchiseService.createFranchise(franchise),
);
export const deleteFranchise = createAsyncThunk(
  'franchise/deleteFranchise',
  async (franchiseId: number): Promise<void> => FranchiseService.deleteFranchise(franchiseId),
);
export const uploadImage = createAsyncThunk(
  'franchise/uploadImage',
  async (formData: { image: File; franchiseId: number }) => FranchiseService.uploadImage(formData),
);
