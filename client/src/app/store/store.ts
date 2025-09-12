import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '@/entities/auth/model/slice';
import chatReducer from '@/entities/chat/model/slice';
import walletReducer from '@/entities/wallet/model/slice';
import franchiseReducer from '@/entities/openFrancise/model/slice';
import adminReducer from '@/entities/admin/model/slice';
import invoiceReducer from '@/entities/invoice/model/slice';
import notificationReducer from '@/entities/notification/model/slice';
import twoFactorReducer from '@/entities/2fa/model/slice';
import modalReducer from '@/entities/modal/model/slice';
import usersReducer from '@/entities/user/model/slice';

// Конфигурация для персистентности чата
const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['messages', 'roomId'], // Сохраняем только сообщения и roomId
};

// Конфигурация для персистентности пользователя
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'status'], // Сохраняем данные пользователя и статус
};

const rootReducer = combineReducers({
  twoFactor: twoFactorReducer,
  user: persistReducer(userPersistConfig, userReducer),
  chat: persistReducer(chatPersistConfig, chatReducer),
  wallet: walletReducer,
  franchise: franchiseReducer,
  admin: adminReducer,
  invoice: invoiceReducer,
  notification: notificationReducer,
  modal: modalReducer,
  users: usersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
