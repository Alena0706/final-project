import type { Message } from '@/entities/chat/model/slice';
import { addMessage, joinRoom, setHistory, setRooms } from '@/entities/chat/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { autoConnect: true });

export default function SupportChat(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((store) => store.chat.messages);
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const admin = useAppSelector((store) => store.user.user?.user.admin);
  const roomId = useAppSelector((store) => store.chat.roomId);
  const rooms = useAppSelector((store) => store.chat.rooms || []);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (admin) {
      socket.emit('getRooms');
    }

    socket.on('roomList', (roomsList: string[]) => {
      dispatch(setRooms(roomsList));
    });

    socket.on('chatMessage', (msg) => {
      dispatch(addMessage(msg));
    });

    socket.on('chatHistory', (history) => {
      dispatch(setHistory(history));
    });

    return () => {
      socket.off('roomList');
      socket.off('chatMessage');
      socket.off('chatHistory');
    };
  }, [admin, dispatch]);

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
    }
  }, [roomId]);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
    if (userId) {
      dispatch(joinRoom(userId.toString()));
    }
  };

  const handleSendMessage = (): void => {
    if (!roomId || !inputValue.trim()) return;
    socket.emit('chatMessage', {
      roomId,
      sender: admin ? 'admin' : 'user',
      message: inputValue.trim(),
    });
    setInputValue('');
    if (!inputValue.trim()) return;

    // const newMessage: Message = {
    //   id: Date.now(), // или используйте uuid
    //   roomId: userId?.toString() || 'default-room',
    //   sender: admin ? 'admin' : 'user',
    //   message: inputValue.trim(),
    //   createdAt: new Date().toISOString(),
    // };

    // dispatch(addMessage(newMessage));
    setInputValue('');
  };

  const handleRoomSelect = (roomId: string | null): void => {
    if (roomId) {
      setSelectedRoom(roomId);
      dispatch(joinRoom(roomId));
      socket.emit('joinRoom', roomId);
    }
  };

  return (
    <>
      {/* Кнопка Чат */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#4F46E5',
          color: 'white',
          borderRadius: '50%',
          width: 60,
          height: 60,
          border: 'none',
          cursor: 'pointer',
          fontSize: 24,
        }}
        aria-label="Open chat support"
        title="Чат поддержки"
      >
        💬
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 320,
            maxHeight: 400,
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            padding: 10,
          }}
        >
          {admin && (
            <div>
              <h3>Все комнаты:</h3>
              <ul>
                {rooms.map((room) => (
                  <li key={room}>
                    <button onClick={() => handleRoomSelect(room)}>{room === "1" ? "комната администрации" : `Пользователь ${room}`}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: '#888', fontSize: 14 }}>Пока нет сообщений</p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  margin: '6px 0',
                  padding: 6,
                  backgroundColor: '#f1f1f1',
                  borderRadius: 6,
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                }}
              >
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите сообщение..."
              style={{ flexGrow: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: 6,
                padding: '6px 12px',
                backgroundColor: '#4F46E5',
                color: 'white',
                borderRadius: 6,
                border: 'none',
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </>
  );
}
