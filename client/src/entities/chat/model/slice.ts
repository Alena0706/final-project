import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Message = {
  id?: number; // или _id если используете UUID
  roomId: string;
  sender: 'user' | 'admin' | 'assistant' | 'system';
  message: string;
  createdAt?: string;
};

type ChatState = {
  messages: Message[];
  roomId: string | null;
  rooms: string[]; // добавляем для списка комнат
};

const initialState: ChatState = {
  messages: [],
  roomId: null,
  rooms: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    joinRoom(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
      // Не очищаем сообщения при присоединении к комнате
      // state.messages = [];
    },
    addMessage(state, action: PayloadAction<Message>) {
      // Проверяем, нет ли уже такого сообщения
      const existingMessage = state.messages.find(msg => msg.id === action.payload.id);
      if (!existingMessage) {
        state.messages.push(action.payload);
        // Сортируем сообщения по времени создания
        state.messages.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeA - timeB;
        });
      }
    },
    setHistory(state, action: PayloadAction<Message[]>) {
      // Объединяем существующие сообщения с историей, избегая дублирования
      const existingIds = new Set(state.messages.map(msg => msg.id));
      const newMessages = action.payload.filter(msg => !existingIds.has(msg.id));
      state.messages = [...state.messages, ...newMessages];
      // Сортируем сообщения по времени создания
      state.messages.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      });
    },
    setRooms(state, action: PayloadAction<string[]>) {
      state.rooms = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { joinRoom, addMessage, setHistory, setRooms, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
