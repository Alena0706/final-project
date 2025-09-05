import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/auth/model/slice';
import twoFAReducer from '@/entities/2fa/model/slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    twoFactor: twoFAReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
