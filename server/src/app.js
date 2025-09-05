const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const sharp = require('sharp'); // Подключаем Sharp для обработки изображений
const authRouter = require('./routes/auth.router');
const path = require('path');
const upload = require('./middlewares/Multer.js'); // Подключаем настроенный Multer

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRouter);

// Папка для сохранения изображений
const uploadDir = path.join(__dirname, './public/Uploads');

app.use('/api/uploads', express.static(path.join(__dirname, './public/Uploads')));

app.post('/api/upload', upload.single('avatar'), async (req, res) => {
  try {
    // Уникальное имя файла
    const fileName = `${Date.now()}.webp`;
    const filePath = path.join(uploadDir,  fileName);
    console.log(req.file);
    console.log(uploadDir);

    // Конвертация и сохранение изображения в WebP с помощью Sharp
    await sharp(req.file.buffer)
      .webp({ quality: 80 }) // Указываем формат WebP и качество 80%
    //   .resize(50, 50) // Указываем размер изображения
      .toFile(filePath);
      
    res.status(200).json({ message: `Изображение успешно сохранено: ${fileName}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обработке изображения' });
  }
});

module.exports = app;
