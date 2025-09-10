const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const authRouter = require('./routes/auth.router');
const franchiseRouter = require('./routes/franchise.router');
const walletRouter = require('./routes/wallet.router');
const invoiceRouter = require('./routes/invoice.router');
const notificationRouter = require('./routes/notification.router');
const documentRouter = require('./routes/document.router');
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/franchise', franchiseRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/documents', documentRouter);
app.use('/api/uploads', express.static(path.join(__dirname, '../public')));

// Проверяем, существует ли папка dist (для продакшена)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Catch-all handler для SPA
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // В режиме разработки просто возвращаем сообщение
  app.use((req, res) => {
    res.json({ 
      message: 'API Server is running. Frontend should be served from development server.',
      status: 'development'
    });
  });
}

module.exports = app;
