const axios = require('axios');
require('dotenv').config();

class ChatService {
  constructor() {
    this.accessToken = '';

    this.messages = [
      {
        role: 'system',
        content: `Помощник по продаже франшизы профессиональной фотосъемки радужки глаза. Отвечай на вопросы кратко не более 200 символов, рассказывай о выгодах и условиях, помогай с выбором и заказом. Франшиза по продаже профессиональной фотосъемки радужки глаза — это бизнес-модель, при которой вы получаете права использовать бренд, технологии и методики съемки уникальных, высококачественных фотографий радужки глаза. Франчайзер предоставляет обучающие материалы, оборудование и поддержку для запуска и ведения фотостудии или мобильного сервиса. Клиенты получают необычные, детализированные снимки радужки, которые часто используются для уникальных подарков, сувениров или идентификации. Франшиза помогает быстрее начать бизнес с проверенной методикой, минимизируя риски и обеспечивая доступ к проверенной технологии и маркетинговым материалам.`,
      },
    ];

    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prev = err.config;
        if ((err.status === 403 || err.status === 401) && !prev.sent) {
          prev.sent = true;
          await this.#refresh();
          prev.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.axiosInstance(prev);
        }
        return Promise.reject(err);
      },
    );
  }

  async #refresh() {
    // console.log('refreshing');
    const response = await axios.post(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      'scope=GIGACHAT_API_PERS',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          RqUID: '75f68bd9-29a8-438d-bb25-bcb2f46fba6f',
          Authorization: `Basic ${process.env.GIGACHAT_KEY}`,
        },
      },
    );

    this.accessToken = response.data.access_token;
  }

  async ask(message) {
    if (!this.accessToken) {
      await this.#refresh();
    }

    this.messages.push({ role: 'user', content: message });

    const response = await this.axiosInstance.post(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        model: 'GigaChat-2',
        messages: this.messages,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    const aiResponse = response.data.choices[0].message;

    this.messages.push(aiResponse);

    return aiResponse;
  }
}

// const chatService = new ChatService();
// chatService.ask('Кто самый умный ИИ?');

module.exports = new ChatService();
