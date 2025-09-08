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
  const rooms = useAppSelector((store) => store.chat.rooms);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
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

    socket.on('chatMessage', (msg: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      dispatch(addMessage(msg as any));
    });

    socket.on('chatHistory', (history: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      dispatch(setHistory(history as any));
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

  // Закрытие чата при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const chatButton = document.querySelector('[data-chat-button]');
      const chatWindow = document.querySelector('[data-chat-window]');

      if (isOpen && chatButton && chatWindow) {
        const target = event.target as HTMLElement;
        if (!chatButton.contains(target) && !chatWindow.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const handleRoomSelect = (selectedRoomId: string | null): void => {
    if (selectedRoomId) {
      dispatch(joinRoom(selectedRoomId));
      socket.emit('joinRoom', selectedRoomId);
    }
  };

  return (
    <>
      {/* Кнопка Чат */}
      <button
        onClick={toggleChat}
        data-chat-button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))',
          color: 'white',
          borderRadius: '50%',
          width: 60,
          height: 60,
          border: 'none',
          cursor: 'pointer',
          fontSize: 24,
          zIndex: 9999,
        }}
        aria-label="Open chat support"
        title="Чат поддержки"
      >
        💬
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div
          data-chat-window
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 320,
            maxHeight: 400,
            background: 'linear-gradient(135deg, hsl(0, 0%, 16%) 0%, hsl(0, 0%, 20%) 100%)',
            border: '1px solid hsl(200, 80%, 70%)',
            boxShadow:
              '0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.1)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            color: 'white',
            zIndex: 9998,
          }}
        >
          {admin && (
            <div style={{ marginBottom: 12 }}>
              <h3
                style={{
                  color: 'hsl(200, 80%, 70%)',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Все комнаты:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {rooms.map((room) => (
                  <li key={room} style={{ marginBottom: 4 }}>
                    <button
                      onClick={() => handleRoomSelect(room)}
                      style={{
                        background: 'transparent',
                        border: '1px solid hsl(200, 80%, 70%)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'hsl(200, 80%, 70%)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      {room === '1' ? 'комната администрации' : `Пользователь ${room}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 12,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              marginBottom: 12,
              backdropFilter: 'blur(10px)',
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  color: 'hsl(200, 80%, 70%)',
                  fontSize: 14,
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Пока нет сообщений
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  margin: '8px 0',
                  padding: '8px 12px',
                  background:
                    msg.sender === 'user'
                      ? 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))'
                      : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  color: 'white',
                  fontSize: 14,
                  lineHeight: 1.4,
                  maxWidth: '80%',
                  marginLeft: msg.sender === 'user' ? 'auto' : 0,
                  marginRight: msg.sender === 'user' ? 0 : 'auto',
                  wordWrap: 'break-word',
                }}
              >
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите сообщение..."
              style={{
                flexGrow: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: 14,
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'hsl(200, 80%, 70%)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))',
                color: 'white',
                borderRadius: 8,
                border: 'none',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 80,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, hsl(200, 80%, 60%), hsl(210, 80%, 40%))';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))';
                e.currentTarget.style.transform = 'translateY(0)';
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
