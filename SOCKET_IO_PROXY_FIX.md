# 🔧 Исправление CORS для Socket.IO

## Проблема

Socket.IO не мог подключиться из-за CORS ошибки:

```
Access to XMLHttpRequest at 'http://localhost:3000/socket.io/...' from origin 'http://localhost:5174' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.
```

## Исправления

### 1. Vite конфигурация (vite.config.ts)

**Добавлен прокси для socket.io:**

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3000',
    '/uploads': 'http://localhost:3000',
    '/socket.io': {
      target: 'http://localhost:3000',
      ws: true,
      changeOrigin: true,
    },
  },
},
```

### 2. SupportChat.tsx

**Изменен URL сокета:**

```typescript
// Было:
const socket = io("http://localhost:3000", { autoConnect: true });

// Стало:
const socket = io("/", { autoConnect: true });
```

## Как применить исправления

1. **Остановите сервер разработки** (Ctrl+C)
2. **Перезапустите сервер разработки:**
   ```bash
   cd client
   npm run dev
   ```
3. **Проверьте, что чат работает** без CORS ошибок

## Ожидаемый результат

- ✅ Socket.IO подключается без CORS ошибок
- ✅ Чат поддержки работает корректно
- ✅ WebSocket соединение устанавливается через прокси

## Что изменилось

- Socket.IO теперь использует относительный URL `/` вместо `http://localhost:3000`
- Vite прокси перенаправляет запросы `/socket.io` на сервер
- `changeOrigin: true` исправляет проблему с заголовками CORS
- `ws: true` поддерживает WebSocket соединения
