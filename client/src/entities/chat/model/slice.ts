import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type Message = {
  id: number; // или _id если используете UUID
  roomId: string;
  sender: 'user' | 'admin';
  message: string;
  timestamp: string;
};

type ChatState = {
  messages: Message[];
  roomId: string | null;
};

const initialState: ChatState = {
  messages: [],
  roomId: null,
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
  },
});

export const { joinRoom, addMessage, setHistory } = chatSlice.actions;

export default chatSlice.reducer;
