import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { fetchAllInvoices, createInvoice, cancelInvoice } from '@/entities/invoice/model/thunks';
import {
  fetchAllNotifications,
  sendBroadcastNotification,
  addNotification,
} from '@/entities/notification/model/thunks';
import UserService, { type User } from '@/entities/user/api/userService';
import type { SendNotificationRequest } from '@/entities/notification/api/notificationService';
import type { CreateInvoiceRequest } from '@/entities/invoice/api/invoiceService';
import axiosInstance from '@/shared/api/axiosInstance';
import { io } from 'socket.io-client';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices, loading: invoiceLoading } = useAppSelector((state) => state.invoice);
  const { notifications, loading: notificationLoading } = useAppSelector(
    (state) => state.notification,
  );
  const { user, status } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState<
    'invoices' | 'notifications' | 'create-invoice' | 'send-notification'
  >('invoices');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  
  // Состояние для поиска и фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Загружаем пользователей при монтировании компонента
  useEffect(() => {
    const loadUsers = async () => {
      console.log('🔄 Loading users...');
      console.log('  user:', user);
      console.log('  status:', status);
      console.log('  user?.user?.admin:', user?.user?.admin);
      console.log('  usersLoaded:', usersLoaded);

      // Проверяем, что пользователь авторизован и является админом
      if (!user || status !== 'logged' || !user.user?.admin) {
        console.log('❌ User not authorized or not admin');
        return;
      }

      // Предотвращаем повторную загрузку
      if (usersLoaded) {
        console.log('⏭️ Users already loaded');
        return;
      }

      setLoadingUsers(true);
      try {
        console.log('📡 Fetching users...');
        const response = await UserService.getAllUsers();
        console.log('✅ Users fetched:', response.data);
        setUsers(response.data);
        setUsersLoaded(true);
      } catch (error) {
        console.error('❌ Ошибка загрузки пользователей:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [user, status, usersLoaded]); // Добавляем status в зависимости

  // Загружаем данные при переключении табов
  useEffect(() => {
    // Проверяем, что пользователь авторизован и является админом
    if (!user || status !== 'logged' || !user.user?.admin) {
      return;
    }

    if (activeTab === 'invoices') {
      dispatch(fetchAllInvoices({}));
    } else if (activeTab === 'notifications') {
      dispatch(fetchAllNotifications({}));
    }
  }, [activeTab, dispatch, user, status]); // Добавляем user и status в зависимости

  // Мемоизируем проверку прав доступа
  const isAdmin = useMemo(() => user && status === 'logged' && user.user?.admin, [user, status]);

  // Функции фильтрации
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;
    
    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }
    
    // Фильтр по пользователю
    if (userFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.userId === parseInt(userFilter));
    }
    
    // Поиск по тексту
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.id.toString().includes(query) ||
        invoice.description.toLowerCase().includes(query) ||
        invoice.user?.name.toLowerCase().includes(query) ||
        invoice.user?.email.toLowerCase().includes(query) ||
        invoice.amount.toString().includes(query)
      );
    }
    
    return filtered;
  }, [invoices, statusFilter, userFilter, searchQuery]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    
    // Поиск по тексту
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.type.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [notifications, searchQuery]);


  // WebSocket подключение для админа (уведомления)
  useEffect(() => {
    if (!isAdmin || !user?.user?.id) {
      console.log('❌ Админ не авторизован, пропускаем WebSocket подключение');
      return;
    }

    console.log(`🔌 Админ подключается к WebSocket, userId: ${user.user.id}`);
    const socket = io('/', { autoConnect: true, transports: ['websocket'] });

    socket.on('connect', () => {
      console.log(`✅ Админ WebSocket подключен, userId: ${user.user.id}`);
      // Присоединяемся к персональной комнате уведомлений админа
      socket.emit('joinNotificationRoom', user.user.id);
      console.log(`🏠 Админ присоединился к комнате уведомлений: notifications_${user.user.id}`);
    });

    socket.on('newNotification', (notification) => {
      console.log(`🔔 Админ получил уведомление:`, notification);
      console.log(`🔔 Тип уведомления: ${notification.type}`);
      console.log(`🔔 Заголовок: ${notification.title}`);
      console.log(`🔔 Сообщение: ${notification.message}`);
      // Добавляем уведомление в Redux store
      dispatch(addNotification(notification));
      console.log(`✅ Уведомление добавлено в Redux store`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Админ WebSocket отключен, userId: ${user.user.id}`);
    });

    return () => {
      console.log(`🔌 Отключаем WebSocket для админа ${user.user.id}`);
      socket.disconnect();
    };
  }, [isAdmin, user?.user?.id, dispatch]);

  // Формы
  const [invoiceForm, setInvoiceForm] = useState<CreateInvoiceRequest>({
    userId: 0,
    amount: 0,
    description: '',
    dueDate: '',
  });

  const [notificationForm, setNotificationForm] = useState<SendNotificationRequest>({
    title: '',
    message: '',
    sendEmail: false,
    userType: 'all',
  });

  const handleCreateInvoice = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await dispatch(createInvoice(invoiceForm)).unwrap();
        setInvoiceForm({ userId: 0, amount: 0, description: '', dueDate: '' });
        setActiveTab('invoices');
        void dispatch(fetchAllInvoices({}));
      } catch (error) {
        console.error('Ошибка создания счета:', error);
      }
    },
    [dispatch, invoiceForm],
  );

  const handleSendBroadcastNotification = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await dispatch(sendBroadcastNotification(notificationForm)).unwrap();
        setNotificationForm({ title: '', message: '', sendEmail: false, userType: 'all' });
        setActiveTab('notifications');
        void dispatch(fetchAllNotifications({}));
      } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
      }
    },
    [dispatch, notificationForm],
  );

  const handleCancelInvoice = useCallback(
    async (invoiceId: number) => {
      try {
        await dispatch(cancelInvoice(invoiceId)).unwrap();
        void dispatch(fetchAllInvoices({}));
      } catch (error) {
        console.error('Ошибка отмены счета:', error);
      }
    },
    [dispatch],
  );

  const formatDate = useCallback(
    (dateString: string) =>
      new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  const getNotificationTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'invoice_reminder':
        return 'Напоминание о счете';
      case 'payment_reminder':
        return 'Напоминание об оплате';
      case 'invoice_generated':
        return 'Счет создан';
      case 'payment_received':
        return 'Платеж получен';
      case 'manual':
        return 'Уведомление';
      case 'franchise_application':
        return 'Заявки';
      default:
        return type;
    }
  }, []);

  const formatCurrency = useCallback(
    (amount: number) =>
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      }).format(amount),
    [],
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'paid':
        return 'Оплачен';
      case 'pending':
        return 'Ожидает оплаты';
      case 'overdue':
        return 'Просрочен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  }, []);

  // Проверяем, что пользователь авторизован и является админом
  if (!isAdmin) {
    return (
      <div className="text-center py-12 pt-20">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Доступ запрещен</h3>
        <p className="text-gray-500">У вас нет прав для доступа к админской панели</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-8">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient-primary mb-4">Админская панель</h1>
        <p className="text-lg text-muted-foreground">Управление счетами и уведомлениями</p>
        
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center">
          {[
            { id: 'invoices', label: 'Счета' },
            { id: 'notifications', label: 'Уведомления' },
            { id: 'create-invoice', label: 'Создать счет' },
            { id: 'send-notification', label: 'Отправить уведомление' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Поиск и быстрые фильтры */}
      <div className="mt-8 px-4 md:px-8 lg:px-12">
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          {/* Поиск и сброс */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Поиск
              </label>
              <input
                type="text"
                placeholder={
                  activeTab === 'invoices' 
                    ? 'Поиск по ID, описанию, пользователю, email или сумме...'
                    : 'Поиск по заголовку, сообщению или типу...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setUserFilter('all');
                }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Быстрые фильтры по статусу для счетов */}
          {activeTab === 'invoices' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Быстрые фильтры по статусу
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:shadow-sm'
                  }`}
                >
                  Все ({invoices.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'pending'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-yellow-100 hover:text-yellow-700 hover:shadow-sm'
                  }`}
                >
                  Ожидает оплаты ({invoices.filter(i => i.status === 'pending').length})
                </button>
                <button
                  onClick={() => setStatusFilter('paid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'paid'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-green-100 hover:text-green-700 hover:shadow-sm'
                  }`}
                >
                  Оплачен ({invoices.filter(i => i.status === 'paid').length})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === 'cancelled'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-700 hover:shadow-sm'
                  }`}
                >
                  Отменен ({invoices.filter(i => i.status === 'cancelled').length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Контент табов */}
      <div className="mt-8 px-4 md:px-8 lg:px-12">
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Все счета</h2>
              <p className="text-muted-foreground">Управление счетами пользователей</p>
            </div>
            {invoiceLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Ничего не найдено' 
                    : 'Нет счетов'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Попробуйте изменить параметры поиска или фильтры'
                    : 'Счета появятся здесь после создания'
                  }
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Счет #{invoice.id}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {invoice.description}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full min-w-[120px] justify-center ${getStatusColor(
                            invoice.status,
                          )}`}
                        >
                          {getStatusText(invoice.status)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Сумма:</span>
                          <span className="text-xl font-bold text-foreground">
                            {formatCurrency(invoice.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Пользователь:</span>
                          <span className="text-sm text-foreground">{invoice.user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm text-foreground">{invoice.user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Создан:</span>
                          <span className="text-sm text-foreground">
                            {formatDate(invoice.createdAt)}
                          </span>
                        </div>
                      </div>

                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                        <button
                          onClick={() => handleCancelInvoice(invoice.id)}
                          className="w-full mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Отменить счет
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Все уведомления</h2>
              <p className="text-muted-foreground">История отправленных уведомлений</p>
            </div>
            {notificationLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery 
                    ? 'Ничего не найдено' 
                    : 'Нет уведомлений'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Попробуйте изменить параметры поиска'
                    : 'Уведомления появятся здесь после отправки'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Сбросить поиск
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4 pb-8">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-background border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {notification.message}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            notification.isRead
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {notification.isRead ? 'Прочитано' : 'Непрочитано'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-sm text-muted-foreground">Пользователь:</span>
                          <p className="text-sm text-foreground">{notification.user?.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <p className="text-sm text-foreground">{notification.user?.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Отправлено:</span>
                          <p className="text-sm text-foreground">
                            {formatDate(notification.sentAt || notification.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Тип:</span>
                          <p className="text-sm text-foreground">
                            {getNotificationTypeLabel(notification.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create-invoice' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Создать новый счет</h2>
              <p className="text-muted-foreground">Выставление счета пользователю</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleCreateInvoice} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Пользователь
                    </label>
                    <select
                      value={invoiceForm.userId}
                      onChange={(e) =>
                        setInvoiceForm({ ...invoiceForm, userId: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      required
                    >
                      <option value={0}>Выберите пользователя</option>
                      {users
                        .filter((user) => !user.admin) // Только обычные пользователи
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                    </select>
                    <div className="text-xs text-muted-foreground mt-2">
                      Загружено пользователей: {users.length} | Обычных пользователей:{' '}
                      {users.filter((user) => !user.admin).length}
                    </div>
                    {loadingUsers && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Загрузка пользователей...
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Сумма (₽)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoiceForm.amount}
                      onChange={(e) =>
                        setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Описание счета
                  </label>
                  <textarea
                    value={invoiceForm.description}
                    onChange={(e) =>
                      setInvoiceForm({ ...invoiceForm, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={4}
                    placeholder="Опишите назначение счета..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Срок оплаты
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Создать счет
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'send-notification' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Отправить уведомление</h2>
              <p className="text-muted-foreground">Рассылка уведомлений пользователям</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSendBroadcastNotification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Заголовок уведомления
                  </label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Введите заголовок..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Текст сообщения
                  </label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm({ ...notificationForm, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    rows={5}
                    placeholder="Введите текст уведомления..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Тип пользователей
                    </label>
                    <select
                      value={notificationForm.userType}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          userType: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="all">Все пользователи</option>
                      <option value="user">Только пользователи</option>
                      <option value="admin">Только админы</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sendEmail"
                        checked={notificationForm.sendEmail}
                        onChange={(e) =>
                          setNotificationForm({ ...notificationForm, sendEmail: e.target.checked })
                        }
                        className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="sendEmail" className="text-sm font-medium text-foreground">
                        Отправить по email
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Отправить уведомление
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
