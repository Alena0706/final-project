const multer = require('multer');
const path = require('path');

const imageStorage = multer.memoryStorage(); // для обработки sharp
const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/videoFranchise');
  },
  filename(req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Будем использовать memoryStorage, но для видео после можно выполнять отдельную обработку и сохранять на диск

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const imageFileTypes = /jpeg|jpg|png|webp/;
    const videoFileTypes = /mp4|x-m4v|quicktime|ogg|mpeg/;
    const documentFileTypes = /pdf/;

    if (imageFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else if (videoFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else if (documentFileTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Ошибка: разрешены только изображения (jpeg, jpg, png, webp), видео (mp4 и др.) и документы (pdf)!'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

module.exports = upload;
