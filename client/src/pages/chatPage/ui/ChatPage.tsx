import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { addMessage, joinRoom, setHistory } from '@/entities/chat/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';

const socket = io();

export default function ChatPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((store) => store.chat.messages);
  const roomId = useAppSelector((store) => store.chat.roomId);
  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [sender, setSender] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      dispatch(addMessage(msg));
    });
    socket.on('chatHistory', (history) => {
      dispatch(setHistory(history));
    });
    return () => {
      socket.off('chatMessage');
      socket.off('chatHistory');
    };
  }, [dispatch]);

  const handleJoinRoom = (): void => {
    if (roomInput.trim() !== '') {
      dispatch(joinRoom(roomInput));
      socket.emit('joinRoom', roomInput);
    }
  };

  const handleSendMessage = (): void => {
    if (!roomId || !input.trim()) return;
    socket.emit('chatMessage', { roomId, sender, message: input });
    setInput('');
  };

  return (
    <div>
      <div>
        <input
          placeholder="ID комнаты"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <select value={sender} onChange={(e) => setSender(e.target.value as any)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleJoinRoom}>Войти в чат</button>
      </div>
      <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ textAlign: m.sender === 'user' ? 'right' : 'left' }}>
            <b>{m.sender}: </b> {m.message}
          </div>
        ))}
      </div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Сообщение..."
        />
        <button onClick={handleSendMessage} disabled={!roomId}>
          Отправить
        </button>
      </div>
    </div>
  );
}
