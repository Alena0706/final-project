import {
  addMessage,
  joinRoom,
  setHistory,
  setRooms,
  clearMessages,
  Message,
} from '@/entities/chat/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router';
import { getAllUsers } from '@/entities/user/model/thunks';

const socket = io('/', { autoConnect: true, transports: ['websocket'] });

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

export default function SupportChat(): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const messages = useAppSelector((store) => store.chat.messages);
  const userId = useAppSelector((store) => store.user.user?.user.id);
  const userName = useAppSelector((store) => store.user.user?.user.name);
  const admin = useAppSelector((store) => store.user.user?.user.admin);
  const userStatus = useAppSelector((store) => store.user.status);
  const roomId = useAppSelector((store) => store.chat.roomId);
  const rooms = useAppSelector((store) => store.chat.rooms);
  const users = useAppSelector((store) => store.users.users);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [aiActive, setAiActive] = useState(true);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [roomSearch, setRoomSearch] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Функция для получения имени пользователя по ID комнаты
  const getUserNameByRoomId = (roomId: string): string => {
    if (roomId === '1') {
      return 'Админская';
    }

    const userId = parseInt(roomId);
    const user = users.find((u) => u.id === userId);

    console.log('🔍 getUserNameByRoomId:', {
      roomId,
      userId,
      usersCount: users.length,
      users: users.map((u) => ({ id: u.id, name: u.name })),
      foundUser: user,
    });

    return user ? user.name : `Пользователь ${roomId}`;
  };

  // Функция для фильтрации комнат
  const getFilteredRooms = () => {
    if (!roomSearch.trim()) return rooms;

    return rooms.filter((room) => {
      const roomName = getUserNameByRoomId(room).toLowerCase();
      return roomName.includes(roomSearch.toLowerCase());
    });
  };

  // Разделяем комнаты на админскую и пользовательские
  const { adminRoom, userRooms } = getFilteredRooms().reduce(
    (acc, room) => {
      if (room === '1') {
        acc.adminRoom = room;
      } else {
        acc.userRooms.push(room);
      }
      return acc;
    },
    { adminRoom: null as string | null, userRooms: [] as string[] },
  );

  // Компонент для отображения кнопки комнаты
  const RoomButton = ({ room, isCompact = false }: { room: string; isCompact?: boolean }) => {
    const isActive = room === roomId;
    const roomName = getUserNameByRoomId(room);

    return (
      <button
        onClick={() => handleRoomSelect(room)}
        style={{
          background: isActive ? 'hsl(200, 80%, 70%)' : 'transparent',
          border: `1px solid ${isActive ? 'hsl(200, 80%, 50%)' : 'hsl(200, 80%, 70%)'}`,
          color: 'white',
          padding: isCompact ? '6px 10px' : '8px 12px',
          borderRadius: 8,
          fontSize: isCompact ? 11 : 12,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          opacity: isActive ? 1 : 0.8,
          width: isCompact ? 'auto' : '100%',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: isCompact ? 32 : 36,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'hsl(200, 80%, 70%)';
            e.currentTarget.style.opacity = '1';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.opacity = '0.8';
          }
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {roomName}
        </span>
        {isActive && (
          <span
            style={{
              fontSize: 10,
              opacity: 0.8,
              marginLeft: 8,
            }}
          >
            ●
          </span>
        )}
      </button>
    );
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Сбрасываем флаг приветствия и очищаем чат при смене пользователя
  useEffect(() => {
    setWelcomeShown(false);
    // Очищаем сообщения при смене пользователя
    dispatch(clearMessages());
  }, [userId, dispatch]);

  // Загружаем пользователей для админа
  useEffect(() => {
    console.log('🔄 Проверка загрузки пользователей:', { admin, usersCount: users.length });
    if (admin && users.length === 0) {
      console.log('📡 Загружаем пользователей...');
      dispatch(getAllUsers());
    }
  }, [admin, users.length, dispatch]);

  useEffect(() => {
    console.log('🔧 Настройка Socket.IO слушателей, admin:', admin);

    if (admin) {
      console.log('📡 Запрашиваем список комнат...');
      socket.emit('getRooms');
    }

    socket.on('roomList', (roomsList: string[]) => {
      console.log('📋 Получен список комнат:', roomsList);
      dispatch(setRooms(roomsList));

      // Загружаем пользователей, если их еще нет
      if (admin && users.length === 0) {
        console.log('📡 Загружаем пользователей после получения списка комнат...');
        dispatch(getAllUsers());
      }
    });

    socket.on('chatMessage', (msg: unknown) => {
      console.log('💬 Получено сообщение:', msg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = msg as any;
      console.log(
        `💬 Добавляем сообщение в Redux: sender=${message.sender}, message="${message.message}"`,
      );
      dispatch(addMessage(message));

      // Проверяем, если это системное сообщение об отключении AI
      if (
        message.sender === 'system' &&
        message.message?.includes('AI-помощник временно отключен')
      ) {
        setAiActive(false);
      }

      // Проверяем, если это системное сообщение о возобновлении AI
      if (message.sender === 'system' && message.message?.includes('AI-помощник возобновлен')) {
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
    console.log('🔄 useEffect roomId изменился:', { roomId, admin });
    if (roomId) {
      console.log('📡 Присоединяемся к комнате:', roomId);
      socket.emit('joinRoom', roomId);
    }
  }, [roomId]);

  // Добавляем приветственное сообщение только если чат действительно пустой
  useEffect(() => {
    if (userId && messages.length === 0 && !welcomeShown && isOpen) {
      const welcomeMessage: Message = {
        id: Math.floor(Date.now() / 1000000),
        roomId: userId.toString(),
        sender: 'assistant',
        message:
          'Добрый день! На связи - ИИ-Ассистент. Готов рассказать о магии фотографии радужки глаза, ответить на все вопросы о франшизе и помочь найти нужную информацию на сайте.',
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage(welcomeMessage));
      setWelcomeShown(true);
    }
  }, [userId, messages.length, welcomeShown, isOpen, dispatch]);

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
      // Запрашиваем историю чата при открытии
      socket.emit('joinRoom', userId.toString());
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

    // Определяем отправителя: если админ находится в комнате пользователя, то он отвечает как админ
    // Если админ в своей комнате, то он пишет как пользователь
    const isAdminRespondingToUser = admin && roomId !== userId?.toString();

    console.log('🔍 Отладка отправителя:', {
      admin,
      roomId,
      userId: userId?.toString(),
      isAdminRespondingToUser,
      finalSender: isAdminRespondingToUser ? 'admin' : 'user',
    });

    const messageData = {
      roomId,
      sender: isAdminRespondingToUser ? 'admin' : 'user',
      message: inputValue.trim(),
    };

    console.log('📤 Отправляем сообщение:', messageData);
    socket.emit('chatMessage', messageData);
    setInputValue('');
  };

  const handleRoomSelect = (selectedRoomId: string | null): void => {
    console.log('🔄 handleRoomSelect вызвана:', { selectedRoomId, currentRoomId: roomId });
    if (selectedRoomId) {
      console.log('📡 Переключаемся на комнату:', selectedRoomId);
      // Очищаем сообщения при переключении комнат
      dispatch(clearMessages());
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

  // Функция обработки клика по кнопке
  const handleButtonClick = (link: string): void => {
    // Проверяем права доступа
    if (link.startsWith('/admin') && !admin) {
      // eslint-disable-next-line no-alert
      alert('У вас нет прав доступа к админ-панели');
      return;
    }

    if (link.startsWith('/profile') && userStatus === 'guest') {
      void navigate('/signin');
      return;
    }

    if (link.startsWith('/')) {
      // Внутренняя ссылка - используем роутер
      void navigate(link);
    } else {
      // Внешняя ссылка
      window.open(link, '_blank');
    }
  };

  // Функция для рендеринга сообщений с кнопками
  const renderMessageWithButtons = (message: string): React.ReactNode[] => {
    const buttonRegex = /\[КНОПКА:([^:]+):([^\]]+)\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // eslint-disable-next-line no-cond-assign
    while ((match = buttonRegex.exec(message)) !== null) {
      // Добавляем текст до кнопки
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${String(lastIndex)}`}>{message.slice(lastIndex, match.index)}</span>,
        );
      }

      // Добавляем кнопку
      const buttonText = match[1];
      const buttonLink = match[2];
      parts.push(
        <button
          key={`button-${String(match.index)}`}
          onClick={() => handleButtonClick(buttonLink)}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            margin: '0 4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
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
          {buttonText}
        </button>,
      );

      lastIndex = match.index + match[0].length;
    }

    // Добавляем оставшийся текст
    if (lastIndex < message.length) {
      parts.push(<span key={`text-${String(lastIndex)}`}>{message.slice(lastIndex)}</span>);
    }

    return parts;
  };

  // Показываем кнопку чата только для авторизованных пользователей
  if (userStatus !== 'logged') {
    return null;
  }

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
            width: admin ? 400 : 320,
            maxHeight: admin ? 800 : 400,
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
              {/* Заголовок и поиск */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    color: 'hsl(200, 80%, 70%)',
                    fontSize: 14,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Комнаты ({rooms.length})
                </h3>
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid hsl(200, 80%, 70%)',
                    borderRadius: 6,
                    padding: '4px 8px',
                    color: 'white',
                    fontSize: 11,
                    width: 80,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Админская комната */}
              {adminRoom && (
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'hsl(200, 80%, 60%)',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Админ
                  </div>
                  <RoomButton room={adminRoom} />
                </div>
              )}

              {/* Пользовательские комнаты */}
              {userRooms.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'hsl(200, 80%, 60%)',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Пользователи ({userRooms.length})
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: 6,
                      maxHeight: admin ? 200 : 120,
                      overflowY: 'auto',
                      paddingRight: 4,
                    }}
                  >
                    {userRooms.map((room) => (
                      <RoomButton key={room} room={room} isCompact={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Сообщение если комнат нет */}
              {getFilteredRooms().length === 0 && roomSearch && (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'hsl(200, 80%, 60%)',
                    fontSize: 12,
                    padding: 8,
                  }}
                >
                  Комнаты не найдены
                </div>
              )}
            </div>
          )}

          {/* Заголовок с названием текущей комнаты - только для админа */}
          {roomId && admin && (
            <div style={{ marginBottom: 8, textAlign: 'center' }}>
              <h3
                style={{
                  color: 'hsl(200, 80%, 70%)',
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {getUserNameByRoomId(roomId)}
              </h3>
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
              minHeight: admin ? 300 : 200,
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
              const showLabel = msg.sender !== 'system';
              const getLabelText = (): string => {
                console.log('🏷️ Определяем подпись для сообщения:', {
                  sender: msg.sender,
                  userName,
                  admin,
                  roomId,
                  userId: userId?.toString(),
                });

                // Если админ находится в комнате пользователя, то сообщения от 'user' - это сообщения пользователя
                // Если админ в своей комнате, то сообщения от 'user' - это его собственные сообщения
                if (msg.sender === 'user') {
                  // Если админ в чужой комнате, то 'user' = пользователь
                  // Если админ в своей комнате, то 'user' = админ
                  if (admin && roomId !== userId?.toString()) {
                    return 'Пользователь';
                  } else {
                    return userName ?? 'Пользователь';
                  }
                }
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
                  {renderMessageWithButtons(msg.message)}
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
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
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
