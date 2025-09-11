import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/auth/model/slice';
import chatReducer from '@/entities/chat/model/slice';
import walletReducer from '@/entities/wallet/model/slice';
import franchiseReducer from '@/entities/openFrancise/model/slice';
import adminReducer from '@/entities/admin/model/slice';
import invoiceReducer from '@/entities/invoice/model/slice';
import notificationReducer from '@/entities/notification/model/slice';
import twoFactorReducer from '@/entities/2fa/model/slice';

export const store = configureStore({
  reducer: {
    twoFactor: twoFactorReducer,
    user: userReducer,
    chat: chatReducer,
    wallet: walletReducer,
    franchise: franchiseReducer,
    admin: adminReducer,
    invoice: invoiceReducer,
    notification: notificationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
