import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/auth/model/slice';
import twoFAReducer from '@/entities/2fa/model/slice';
import chatReducer from '@/entities/chat/model/slice';
import walletReducer from '@/entities/wallet/model/slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    twoFactor: twoFAReducer,
    chat: chatReducer,
    wallet: walletReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
