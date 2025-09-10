/**
 * Безопасно форматирует дату в локальном формате
 * @param dateString - строка с датой или undefined
 * @param locale - локаль для форматирования (по умолчанию 'ru-RU')
 * @returns отформатированная дата или 'Не указано'
 */
export const formatDate = (dateString?: string, locale: string = 'ru-RU'): string => {
  if (!dateString) {
    return 'Не указано';
  }

  try {
    const date = new Date(dateString);
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return 'Не указано';
    }

    return date.toLocaleDateString(locale);
  } catch (error) {
    console.warn('Ошибка форматирования даты:', error);
    return 'Не указано';
  }
};

/**
 * Безопасно форматирует дату и время в локальном формате
 * @param dateString - строка с датой или undefined
 * @param locale - локаль для форматирования (по умолчанию 'ru-RU')
 * @returns отформатированная дата и время или 'Не указано'
 */
export const formatDateTime = (dateString?: string, locale: string = 'ru-RU'): string => {
  if (!dateString) {
    return 'Не указано';
  }

  try {
    const date = new Date(dateString);
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return 'Не указано';
    }

    return date.toLocaleString(locale);
  } catch (error) {
    console.warn('Ошибка форматирования даты и времени:', error);
    return 'Не указано';
  }
};
