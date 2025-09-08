const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const authRouter = require('./routes/auth.router');
const franchiseRouter = require('./routes/franchise.router');
const walletRouter = require('./routes/wallet.router');
const invoiceRouter = require('./routes/invoice.router');
const notificationRouter = require('./routes/notification.router');
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
app.use('/api/uploads', express.static(path.join(__dirname, '../public')));

module.exports = app;
