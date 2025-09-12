import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { addMessage, joinRoom, setHistory } from '@/entities/chat/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.DEV ? 'http://localhost:3000' : '/', { autoConnect: true });

// Добавляем логирование для диагностики
socket.on('connect', () => {
  console.log('✅ ChatPage Socket.IO подключен:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ ChatPage Socket.IO отключен');
});

socket.on('connect_error', (error) => {
  console.error('❌ ChatPage Ошибка подключения Socket.IO:', error);
});

export default function ChatPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const messages = useAppSelector((store) => store.chat.messages);
  const roomId = useAppSelector((store) => store.chat.roomId);
  const userName = useAppSelector((store) => store.user.user?.user.name);
  const [input, setInput] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [sender, setSender] = useState<'user' | 'admin'>('user');

  const handleButtonClick = (link: string): void => {
    console.log('🔗 ChatPage: Переход по ссылке:', link);
    navigate(link);
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
          <span key={`text-${String(lastIndex)}`}>
            {message.slice(lastIndex, match.index)}
          </span>
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
            e.currentTarget.style.background = 'linear-gradient(135deg, hsl(200, 80%, 60%), hsl(210, 80%, 40%))';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(210, 75%, 35%))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {buttonText}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Добавляем оставшийся текст
    if (lastIndex < message.length) {
      parts.push(
        <span key={`text-${String(lastIndex)}`}>
          {message.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  useEffect(() => {
    console.log('🔧 ChatPage: Настройка Socket.IO слушателей');

    socket.on('chatMessage', (msg: any) => {
      console.log('💬 ChatPage: Получено сообщение:', msg);
      dispatch(addMessage(msg));
    });
    socket.on('chatHistory', (history: any) => {
      console.log('📜 ChatPage: Получена история чата:', history);
      dispatch(setHistory(history));
      
      // Если нет сообщений после загрузки истории, добавляем приветствие
      if (history.length === 0 && messages.length === 0) {
        const welcomeMessage = {
          id: 'welcome-' + Date.now(),
          roomId: roomId || 'default',
          sender: 'assistant',
          message: 'Добрый день! На связи - ИИ-Ассистент. Готов рассказать о магии фотографии радужки глаза, ответить на все вопросы о франшизе и помочь найти нужную информацию на сайте.',
          createdAt: new Date().toISOString(),
        };
        dispatch(addMessage(welcomeMessage));
      }
    });
    return () => {
      console.log('🧹 ChatPage: Очистка Socket.IO слушателей');
      socket.off('chatMessage');
      socket.off('chatHistory');
    };
  }, [dispatch, messages.length, roomId]);

  const handleJoinRoom = (): void => {
    console.log('🏠 ChatPage: Попытка присоединиться к комнате:', roomInput);
    if (roomInput.trim() !== '') {
      dispatch(joinRoom(roomInput));
      socket.emit('joinRoom', roomInput);
      console.log('✅ ChatPage: Присоединились к комнате:', roomInput);
    }
  };

  const handleSendMessage = (): void => {
    console.log('📤 ChatPage: Попытка отправить сообщение:', { roomId, sender, message: input });
    if (!roomId || !input.trim()) {
      console.log('❌ ChatPage: Не удается отправить: нет roomId или пустое сообщение');
      return;
    }
    socket.emit('chatMessage', { roomId, sender, message: input });
    setInput('');
    console.log('✅ ChatPage: Сообщение отправлено');
  };

  return (
    <div>
      <div>
        <input
          placeholder="ID комнаты"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <select value={sender} onChange={(e) => setSender(e.target.value as 'user' | 'admin')}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleJoinRoom}>Войти в чат</button>
      </div>
      <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll' }}>
        {messages.map((m) => {
          const getSenderName = () => {
            if (m.sender === 'user') return userName || 'Пользователь';
            if (m.sender === 'assistant') return 'AI-помощник';
            if (m.sender === 'admin') return 'Администратор';
            if (m.sender === 'system') return 'Система';
            return m.sender;
          };

          return (
            <div key={m.id} style={{ textAlign: m.sender === 'user' ? 'right' : 'left' }}>
              <b>{getSenderName()}: </b> {renderMessageWithButtons(m.message)}
            </div>
          );
        })}
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
