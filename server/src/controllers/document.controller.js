const { Document } = require('../../db/models');
const fs = require('fs');
const path = require('path');

class DocumentController {
  // Получить все документы пользователя
  static async getUserDocuments(req, res) {
    try {
      const userId = res.locals.user.id;
      const documents = await Document.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error getting user documents:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Загрузить контракт
  static async uploadContract(req, res) {
    try {
      const userId = res.locals.user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: 'Файл контракта не найден' });
      }

      // Создаем папку для документов пользователя, если её нет
      const userDocumentsDir = path.join(__dirname, '../../public/documents', userId.toString());
      if (!fs.existsSync(userDocumentsDir)) {
        fs.mkdirSync(userDocumentsDir, { recursive: true });
      }

      // Сохраняем файл
      const fileName = `contract_${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = path.join(userDocumentsDir, fileName);
      await fs.promises.writeFile(filePath, req.file.buffer);

      // Сохраняем путь в БД
      const document = await Document.create({
        contract: `documents/${userId}/${fileName}`,
        userId
      });

      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading contract:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Загрузить платежный документ
  static async uploadReceipt(req, res) {
    try {
      const userId = res.locals.user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: 'Файл платежного документа не найден' });
      }

      // Создаем папку для документов пользователя, если её нет
      const userDocumentsDir = path.join(__dirname, '../../public/documents', userId.toString());
      if (!fs.existsSync(userDocumentsDir)) {
        fs.mkdirSync(userDocumentsDir, { recursive: true });
      }

      // Сохраняем файл
      const fileName = `receipt_${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = path.join(userDocumentsDir, fileName);
      await fs.promises.writeFile(filePath, req.file.buffer);

      // Сохраняем путь в БД
      const document = await Document.create({
        receipt: `documents/${userId}/${fileName}`,
        userId
      });

      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading receipt:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Обновить документ (заменить файл)
  static async updateDocument(req, res) {
    try {
      const userId = res.locals.user.id;
      const documentId = parseInt(req.params.id);
      const { type } = req.body; // 'contract' или 'receipt'

      if (isNaN(documentId)) {
        return res.status(400).json({ message: 'Некорректный ID документа' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Файл не найден' });
      }

      // Находим документ
      const document = await Document.findOne({
        where: { id: documentId, userId }
      });

      if (!document) {
        return res.status(404).json({ message: 'Документ не найден' });
      }

      // Создаем папку для документов пользователя, если её нет
      const userDocumentsDir = path.join(__dirname, '../../public/documents', userId.toString());
      if (!fs.existsSync(userDocumentsDir)) {
        fs.mkdirSync(userDocumentsDir, { recursive: true });
      }

      // Удаляем старый файл, если он существует
      if (type === 'contract' && document.contract) {
        const oldFilePath = path.join(__dirname, '../../public', document.contract);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } else if (type === 'receipt' && document.receipt) {
        const oldFilePath = path.join(__dirname, '../../public', document.receipt);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Сохраняем новый файл
      const fileName = `${type}_${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = path.join(userDocumentsDir, fileName);
      await fs.promises.writeFile(filePath, req.file.buffer);

      // Обновляем запись в БД
      const updateData = {};
      updateData[type] = `documents/${userId}/${fileName}`;
      
      await document.update(updateData);

      res.status(200).json(document);
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Удалить документ
  static async deleteDocument(req, res) {
    try {
      const userId = res.locals.user.id;
      const documentId = parseInt(req.params.id);

      if (isNaN(documentId)) {
        return res.status(400).json({ message: 'Некорректный ID документа' });
      }

      // Находим документ
      const document = await Document.findOne({
        where: { id: documentId, userId }
      });

      if (!document) {
        return res.status(404).json({ message: 'Документ не найден' });
      }

      // Удаляем файлы с диска
      if (document.contract) {
        const contractPath = path.join(__dirname, '../../public', document.contract);
        if (fs.existsSync(contractPath)) {
          fs.unlinkSync(contractPath);
        }
      }

      if (document.receipt) {
        const receiptPath = path.join(__dirname, '../../public', document.receipt);
        if (fs.existsSync(receiptPath)) {
          fs.unlinkSync(receiptPath);
        }
      }

      // Удаляем запись из БД
      await document.destroy();

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Скачать документ
  static async downloadDocument(req, res) {
    try {
      const userId = res.locals.user.id;
      const documentId = parseInt(req.params.id);
      const { type } = req.query; // 'contract' или 'receipt'

      if (isNaN(documentId)) {
        return res.status(400).json({ message: 'Некорректный ID документа' });
      }

      // Находим документ
      const document = await Document.findOne({
        where: { id: documentId, userId }
      });

      if (!document) {
        return res.status(404).json({ message: 'Документ не найден' });
      }

      const filePath = type === 'contract' ? document.contract : document.receipt;
      
      if (!filePath) {
        return res.status(404).json({ message: 'Файл не найден' });
      }

      const fullPath = path.join(__dirname, '../../public', filePath);
      
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: 'Файл не найден на диске' });
      }

      res.download(fullPath);
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DocumentController;
