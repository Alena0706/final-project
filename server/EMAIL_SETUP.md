# Настройка Gmail для отправки email

## 1. Настройка Google аккаунта

### Шаг 1: Включите двухфакторную аутентификацию

1. Перейдите в [настройки Google аккаунта](https://myaccount.google.com/security)
2. В разделе "Вход в Google" нажмите "2-этапная аутентификация"
3. Следуйте инструкциям для настройки

### Шаг 2: Создайте пароль приложения

1. В настройках безопасности найдите "Пароли приложений"
2. Выберите "Почта" как приложение
3. Выберите "Другой (указать имя)" и введите "Node.js App"
4. Скопируйте сгенерированный пароль (16 символов)

### Шаг 3: Настройте переменные окружения

Добавьте в ваш `.env` файл:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
CLIENT_URL=http://localhost:3000
```

## 2. Тестирование

Запустите тест для проверки настройки:

```bash
node test-email.js
```

## 3. Альтернативные провайдеры

Если Gmail не подходит, можно использовать:

### Outlook/Hotmail

```javascript
// В email.service.js измените transporter:
this.transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Yahoo

```javascript
this.transporter = nodemailer.createTransporter({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### Кастомный SMTP

```javascript
this.transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## 4. Устранение проблем

### Ошибка "Invalid login"

- Проверьте правильность EMAIL_USER
- Убедитесь, что используете пароль приложения, а не обычный пароль
- Включите двухфакторную аутентификацию

### Ошибка "Less secure app access"

- Включите доступ для менее безопасных приложений в Gmail
- Или используйте пароль приложения (рекомендуется)

### Ошибка "Connection timeout"

- Проверьте интернет-соединение
- Убедитесь, что порт 587 не заблокирован файрволом

## 5. Безопасность

- Никогда не коммитьте .env файл в git
- Используйте пароли приложений вместо основных паролей
- Регулярно обновляйте пароли приложений
- Ограничьте доступ к .env файлу только необходимым пользователям
