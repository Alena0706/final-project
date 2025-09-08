const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const authRouter = require('./routes/auth.router');
const app = express();
const franchiseRouter = require('./routes/franchise.router');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/franchise', franchiseRouter);
app.use('/api/uploads', express.static(path.join(__dirname, '../public')));

module.exports = app;
