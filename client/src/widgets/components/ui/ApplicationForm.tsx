import React, { useState } from 'react';
import ApplicationService, { type ApplicationData } from '@/entities/application/api/applicationService';

const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationData>({
    name: '',
    phone: '+7',
    email: '',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Форматирование телефона
    if (value.length === 0) {
      value = '+7';
    } else if (value.length === 1 && value !== '+') {
      value = '+7';
    } else if (value.length > 1 && !value.startsWith('+7')) {
      value = '+7' + value.replace(/\D/g, '');
    }
    
    // Ограничиваем длину
    if (value.length > 18) {
      value = value.substring(0, 18);
    }
    
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name.trim()) {
      setErrorMessage('Имя обязательно для заполнения');
      setSubmitStatus('error');
      return;
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      setErrorMessage('Введите корректный номер телефона');
      setSubmitStatus('error');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Введите корректный email');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await ApplicationService.submitApplication(formData);
      
      if (response.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '+7',
          email: '',
          city: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (error: any) {
      console.error('Ошибка отправки заявки:', error);
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || 'Произошла ошибка при отправке заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Имя *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input h-10 text-base w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Телефон *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="form-input h-10 text-base w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Email *
          </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input h-10 text-base w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Город
          </label>
          <input
            type="text"
            name="city"
            placeholder="В каком городе планируете открытие?"
            value={formData.city}
            onChange={handleInputChange}
            className="form-input h-10 text-base w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Сообщение
          </label>
          <textarea
            name="message"
            placeholder="Расскажите о ваших планах и вопросах..."
            value={formData.message}
            onChange={handleInputChange}
            className="form-input min-h-[90px] resize-vertical text-base w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Отправляем...
            </>
          ) : (
            'Отправить заявку'
          )}
        </button>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>

      {/* Статус отправки */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center">
            ✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
          </p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-center">
            ❌ {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
