import { addMessage, joinRoom, setHistory, setRooms } from '@/entities/chat/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.DEV ? 'http://localhost:3000' : '/', { autoConnect: true, transports: ['websocket'] });
// Добавляем логирование для диагностики

socket.on('connect', () => {
  console.log('✅ Socket.IO подключен:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket.IO отключен');
});

socket.on('connect_error', (error) => {
  console.error('❌ Ошибка подключения Socket.IO:', error);
});

export default function SupportChat(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const messages = useAppSelector((store) => store.chat.messages);
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const admin = useAppSelector((store) => store.user.user?.user.admin);
  const roomId = useAppSelector((store) => store.chat.roomId);
  const rooms = useAppSelector((store) => store.chat.rooms);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [aiActive, setAiActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    console.log('🔧 Настройка Socket.IO слушателей, admin:', admin);

    if (admin) {
      console.log('📡 Запрашиваем список комнат...');
      socket.emit('getRooms');
    }

    socket.on('roomList', (roomsList: string[]) => {
      console.log('📋 Получен список комнат:', roomsList);
      dispatch(setRooms(roomsList));
    });

    socket.on('chatMessage', (msg: unknown) => {
      console.log('💬 Получено сообщение:', msg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = msg as any;
      dispatch(addMessage(message));

      // Проверяем, если это системное сообщение об отключении AI
      if (
        message.sender === 'system' &&
        message.message.includes('AI-помощник временно отключен')
      ) {
        setAiActive(false);
      }

      // Проверяем, если это системное сообщение о возобновлении AI
      if (message.sender === 'system' && message.message.includes('AI-помощник возобновлен')) {
        setAiActive(true);
      }
    });

    socket.on('chatHistory', (history: unknown) => {
      console.log('📜 Получена история чата:', history);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      dispatch(setHistory(history as any));
    });

    return () => {
      console.log('🧹 Очистка Socket.IO слушателей');
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
    console.log('🔄 Переключение чата, userId:', userId);
    setIsOpen(!isOpen);
    if (userId) {
      console.log('🏠 Присоединяемся к комнате:', userId.toString());
      dispatch(joinRoom(userId.toString()));
    } else {
      console.log('❌ Нет userId для присоединения к комнате');
    }
  };

  const handleSendMessage = (): void => {
    console.log('📤 Попытка отправить сообщение:', {
      roomId,
      inputValue: inputValue.trim(),
      admin,
    });

    if (!roomId || !inputValue.trim()) {
      console.log('❌ Не удается отправить: нет roomId или пустое сообщение');
      return;
    }

    const messageData = {
      roomId,
      sender: admin ? 'admin' : 'user',
      message: inputValue.trim(),
    };

    console.log('📤 Отправляем сообщение:', messageData);
    socket.emit('chatMessage', messageData);
    setInputValue('');
  };

  const handleRoomSelect = (selectedRoomId: string | null): void => {
    if (selectedRoomId) {
      dispatch(joinRoom(selectedRoomId));
      socket.emit('joinRoom', selectedRoomId);
    }
  };

  const handleResumeAI = (): void => {
    if (roomId) {
      socket.emit('resumeAI', roomId);
      setAiActive(true);
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
            {messages.map((msg) => {
              // Базовые стили
              const baseStyle: React.CSSProperties = {
                margin: '8px 0',
                padding: '8px 12px',
                borderRadius: 12,
                color: 'white',
                fontSize: 14,
                lineHeight: 1.4,
                maxWidth: '80%',
                wordWrap: 'break-word',
                textAlign: 'left',
                marginLeft: 0,
                marginRight: 'auto',
              };

              // Стили для разных типов сообщений
              let messageStyle: React.CSSProperties = { ...baseStyle };

              if (msg.sender === 'user') {
                messageStyle = {
                  ...baseStyle,
                  background: 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))',
                  textAlign: 'right',
                  marginLeft: 'auto',
                  marginRight: 0,
                };
              } else if (msg.sender === 'assistant') {
                messageStyle = {
                  ...baseStyle,
                  background: 'linear-gradient(135deg, hsl(120, 50%, 40%), hsl(140, 50%, 30%))',
                };
              } else if (msg.sender === 'admin') {
                messageStyle = {
                  ...baseStyle,
                  background: 'linear-gradient(135deg, hsl(280, 60%, 50%), hsl(300, 60%, 40%))',
                };
              } else if (msg.sender === 'system') {
                messageStyle = {
                  ...baseStyle,
                  background: 'rgba(255, 193, 7, 0.2)',
                  border: '1px solid rgba(255, 193, 7, 0.5)',
                  textAlign: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                };
              } else {
                messageStyle = {
                  ...baseStyle,
                  background: 'rgba(255, 255, 255, 0.1)',
                };
              }

              // Определяем, нужно ли показывать подпись
              const showLabel = msg.sender !== 'user' && msg.sender !== 'system';
              const getLabelText = () => {
                if (msg.sender === 'assistant') return 'AI-помощник';
                if (msg.sender === 'admin') return 'Администратор';
                return msg.sender;
              };

              return (
                <div key={msg.id} style={messageStyle}>
                  {showLabel && (
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      {getLabelText()}
                    </div>
                  )}
                  {msg.message}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          {/* Статус AI */}
          {/* // {!aiActive && ( */}
          {/* //   <div style={{  */}
          {/* //     marginBottom: 8, 
          //     padding: '8px 12px', 
          //     background: 'rgba(255, 193, 7, 0.1)', 
          //     border: '1px solid rgba(255, 193, 7, 0.3)',
          //     borderRadius: 8,
          //     textAlign: 'center',
          //     fontSize: 12,
          //     color: 'hsl(45, 100%, 70%)'
          //   }}>
          //     AI-помощник отключен. Администратор уведомлен.
          //   </div>
          // )} */}

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
                padding: '8px 10px',
                background: 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))',
                color: 'white',
                borderRadius: 8,
                border: 'none',
                fontSize: 10,
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

          {/* Кнопка возобновления AI для админа */}
          {admin && !aiActive && (
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <button
                onClick={handleResumeAI}
                style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, hsl(120, 50%, 40%), hsl(140, 50%, 30%))',
                  color: 'white',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, hsl(120, 60%, 50%), hsl(140, 60%, 40%))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, hsl(120, 50%, 40%), hsl(140, 50%, 30%))';
                }}
              >
                Включить AI
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
