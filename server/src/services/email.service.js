const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Создаем транспортер для отправки email через Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // ваш Gmail адрес
        pass: process.env.EMAIL_PASSWORD, // пароль приложения Gmail
      },
    });
  }

  // Отправка приветственного email при регистрации
  async sendWelcomeEmail(userEmail, userName) {
    const mailOptions = {
      from: {
        name: 'Твой взгляд', // Имя отправителя
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: '🎉 Добро пожаловать! Регистрация прошла успешно',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Добро пожаловать, ${userName}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Спасибо за регистрацию в нашем сервисе</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Ваш аккаунт успешно создан!</h2>
            <p style="color: #666; line-height: 1.6;">
              Теперь вы можете пользоваться всеми возможностями нашего сервиса. 
              Если у вас есть вопросы, не стесняйтесь обращаться к нам.
            </p>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Войти в аккаунт
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background: #e9ecef; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">С уважением,<br><strong>Команда "Твой взгляд"</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              Это автоматическое сообщение, пожалуйста, не отвечайте на него.
            </p>
          </div>
        </div>
      `,
      // Текстовая версия для старых почтовых клиентов
      text: `
        Добро пожаловать, ${userName}!
        
        Спасибо за регистрацию в нашем сервисе. Ваш аккаунт успешно создан!
        
        Теперь вы можете пользоваться всеми возможностями нашего сервиса.
        
        Войти в аккаунт: ${process.env.CLIENT_URL || 'http://localhost:5173'}/signin
        
        С уважением,
        Команда проекта
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  // Отправка email для сброса пароля (на будущее)
  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${
      process.env.CLIENT_URL || 'http://localhost:5173'
    }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: 'Твой взгляд',
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: '🔐 Сброс пароля',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Сброс пароля</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Привет, ${userName}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Вы запросили сброс пароля для вашего аккаунта. 
              Нажмите на кнопку ниже, чтобы создать новый пароль.
            </p>
            
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Сбросить пароль
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px;">
              Если кнопка не работает, скопируйте эту ссылку в браузер:<br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, 
              просто проигнорируйте это письмо.
            </p>
          </div>
        </div>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      throw error;
    }
  }

  // Отправка уведомления по email
  async sendNotificationEmail(userEmail, userName, title, message) {
    const mailOptions = {
      from: {
        name: 'Твой взгляд',
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: `🔔 ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">${title}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Уведомление от "Твой взгляд"</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Привет, ${userName}!</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="color: #666; line-height: 1.6; margin: 0; white-space: pre-line;">${message}</p>
            </div>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Перейти в профиль
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background: #e9ecef; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">С уважением,<br><strong>Команда "Твой взгляд"</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              Это автоматическое сообщение, пожалуйста, не отвечайте на него.
            </p>
          </div>
        </div>
      `,
      text: `
        ${title}
        
        Привет, ${userName}!
        
        ${message}
        
        Перейти в профиль: ${process.env.CLIENT_URL || 'http://localhost:5173'}/profile
        
        С уважением,
        Команда "Твой взгляд"
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending notification email:', error);
      throw error;
    }
  }

  // Отправка уведомления о новом счете
  async sendInvoiceNotificationEmail(userEmail, userName, invoiceAmount, dueDate, description) {
    const mailOptions = {
      from: {
        name: 'Твой взгляд',
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: '📄 Новый счет для оплаты',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">📄 Новый счет</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Требуется оплата</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Привет, ${userName}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Вам выставлен новый счет, который необходимо оплатить.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Детали счета:</h3>
              <p style="margin: 10px 0;"><strong>Сумма:</strong> ${invoiceAmount} ₽</p>
              <p style="margin: 10px 0;"><strong>Срок оплаты:</strong> ${new Date(dueDate).toLocaleDateString('ru-RU')}</p>
              <p style="margin: 10px 0;"><strong>Описание:</strong> ${description || 'Счет за услуги'}</p>
            </div>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Оплатить счет
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background: #e9ecef; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">С уважением,<br><strong>Команда "Твой взгляд"</strong></p>
          </div>
        </div>
      `,
      text: `
        Новый счет
        
        Привет, ${userName}!
        
        Вам выставлен новый счет, который необходимо оплатить.
        
        Детали счета:
        - Сумма: ${invoiceAmount} ₽
        - Срок оплаты: ${new Date(dueDate).toLocaleDateString('ru-RU')}
        - Описание: ${description || 'Счет за услуги'}
        
        Оплатить счет: ${process.env.CLIENT_URL || 'http://localhost:5173'}/profile
        
        С уважением,
        Команда "Твой взгляд"
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Invoice notification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending invoice notification email:', error);
      throw error;
    }
  }

  // Отправка уведомления об оплате
  async sendPaymentConfirmationEmail(userEmail, userName, amount, description) {
    const mailOptions = {
      from: {
        name: 'Твой взгляд',
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: '✅ Платеж успешно проведен',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">✅ Платеж проведен</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Оплата успешно обработана</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Привет, ${userName}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Ваш платеж был успешно обработан.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Детали платежа:</h3>
              <p style="margin: 10px 0;"><strong>Сумма:</strong> ${amount} ₽</p>
              <p style="margin: 10px 0;"><strong>Описание:</strong> ${description}</p>
              <p style="margin: 10px 0;"><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
            </div>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Перейти в профиль
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background: #e9ecef; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">С уважением,<br><strong>Команда "Твой взгляд"</strong></p>
          </div>
        </div>
      `,
      text: `
        Платеж проведен
        
        Привет, ${userName}!
        
        Ваш платеж был успешно обработан.
        
        Детали платежа:
        - Сумма: ${amount} ₽
        - Описание: ${description}
        - Дата: ${new Date().toLocaleString('ru-RU')}
        
        Перейти в профиль: ${process.env.CLIENT_URL || 'http://localhost:5173'}/profile
        
        С уважением,
        Команда "Твой взгляд"
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment confirmation email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      throw error;
    }
  }

  // Проверка подключения к Gmail
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Gmail connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Gmail connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
