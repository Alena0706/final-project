import type { FranchiseT } from './types';
import {
  createFranchise,
  deleteFranchise,
  getAllFranchises,
  updateFranchise,
  uploadImage,
} from './thunks';
import { createSlice } from '@reduxjs/toolkit';

type FranchiseStateT = {
  franchises: FranchiseT[];
  status: 'loading' | 'loaded' | 'error';
  error: string | null;
};

const initialState: FranchiseStateT = {
  franchises: [],
  status: 'loading',
  error: null,
};

export const franchiseSlice = createSlice({
  name: 'franchise',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllFranchises.fulfilled, (state, action) => {
        console.log(action.payload);
        state.franchises = action.payload;
        state.status = 'loaded';
        state.error = null;
      })
      .addCase(getAllFranchises.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllFranchises.rejected, (state, action) => {
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
        state.status = 'error';
      });

    builder
      .addCase(updateFranchise.fulfilled, (state, action) => {
        const franchise = action.payload;
        state.franchises = state.franchises.map((item) => {
          if (item.id === franchise.id) {
            return franchise;
          }
          return item;
        });
        state.status = 'loaded';
        state.error = null;
      })
      .addCase(updateFranchise.rejected, (state, action) => {
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
        state.status = 'error';
      })
      .addCase(updateFranchise.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(createFranchise.fulfilled, (state, action) => {
        state.franchises = [...state.franchises, action.payload];
        state.status = 'loaded';
        state.error = null;
      })
      .addCase(createFranchise.rejected, (state, action) => {
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
        state.status = 'error';
      })
      .addCase(createFranchise.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });

    builder
      .addCase(deleteFranchise.fulfilled, (state, action) => {
        state.franchises = state.franchises.filter((item) => item.id !== action.meta.arg);
        state.error = null;
      })
      .addCase(deleteFranchise.rejected, (state, action) => {
        if (action.error.name !== `AxiosError`) {
          state.error = action.error.message ?? 'Unknown error';
        } else {
          state.error = null;
        }
        state.status = 'error';
      })
      .addCase(deleteFranchise.pending, (state) => {
        state.error = null;
      });

    builder
      .addCase(uploadImage.fulfilled, (state, action) => {
        const updatedFranchise = action.payload;
        state.franchises = state.franchises.map((item) => {
          if (item.id === updatedFranchise.id) {
            return updatedFranchise;
          }
          return item;
        });
        state.status = 'loaded';
        state.error = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        state.status = 'error';
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });
  },
});

export default franchiseSlice.reducer;
