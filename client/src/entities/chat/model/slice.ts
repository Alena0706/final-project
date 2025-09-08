import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Message = {
  id: number; // или _id если используете UUID
  roomId: string;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
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
      state.messages = [];
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setHistory(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setRooms(state, action: PayloadAction<string[]>) {
      state.rooms = action.payload;
    },
  },
});

export const { joinRoom, addMessage, setHistory, setRooms } = chatSlice.actions;

export default chatSlice.reducer;
