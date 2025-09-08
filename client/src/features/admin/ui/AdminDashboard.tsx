import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { fetchAllInvoices, createInvoice, cancelInvoice } from '@/entities/invoice/model/thunks';
import { fetchAllNotifications, sendBroadcastNotification, sendUserNotification } from '@/entities/notification/model/thunks';
import UserService, { type User } from '@/entities/user/api/userService';
import type { CreateInvoiceRequest, SendNotificationRequest } from '@/entities/notification/api/notificationService';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices, loading: invoiceLoading } = useAppSelector((state) => state.invoice);
  const { notifications, loading: notificationLoading } = useAppSelector((state) => state.notification);
  const { user, status } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState<'invoices' | 'notifications' | 'create-invoice' | 'send-notification'>('invoices');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

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
      dispatch(fetchAllInvoices());
    } else if (activeTab === 'notifications') {
      dispatch(fetchAllNotifications());
    }
  }, [activeTab, dispatch, user, status]); // Добавляем user и status в зависимости

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

  // Мемоизируем проверку прав доступа
  const isAdmin = useMemo(() => {
    return user && status === 'logged' && user.user?.admin;
  }, [user, status]);

  const handleCreateInvoice = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createInvoice(invoiceForm)).unwrap();
      setInvoiceForm({ userId: 0, amount: 0, description: '', dueDate: '' });
      setActiveTab('invoices');
      dispatch(fetchAllInvoices());
    } catch (error) {
      console.error('Ошибка создания счета:', error);
    }
  }, [dispatch, invoiceForm]);

  const handleSendBroadcastNotification = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(sendBroadcastNotification(notificationForm)).unwrap();
      setNotificationForm({ title: '', message: '', sendEmail: false, userType: 'all' });
      setActiveTab('notifications');
      dispatch(fetchAllNotifications());
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    }
  }, [dispatch, notificationForm]);

  const handleCancelInvoice = useCallback(async (invoiceId: number) => {
    try {
      await dispatch(cancelInvoice(invoiceId)).unwrap();
      dispatch(fetchAllInvoices());
    } catch (error) {
      console.error('Ошибка отмены счета:', error);
    }
  }, [dispatch]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  }, []);

  // Проверяем, что пользователь авторизован и является админом
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Доступ запрещен</h3>
        <p className="text-gray-500">У вас нет прав для доступа к админской панели</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient-primary">Админская панель</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('create-invoice')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Создать счет
          </button>
          <button
            onClick={() => setActiveTab('send-notification')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Отправить уведомление
          </button>
        </div>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'invoices', label: 'Счета' },
            { id: 'notifications', label: 'Уведомления' },
            { id: 'create-invoice', label: 'Создать счет' },
            { id: 'send-notification', label: 'Отправить уведомление' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Контент табов */}
      <div className="mt-6">
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Все счета</h2>
            {invoiceLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">Счет #{invoice.id}</h3>
                        <p className="text-gray-600">{invoice.description}</p>
                        <p className="text-sm text-gray-500">
                          Пользователь: {invoice.user?.name} ({invoice.user?.email})
                        </p>
                        <p className="text-sm text-gray-500">
                          Создан: {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </span>
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleCancelInvoice(invoice.id)}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm"
                          >
                            Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Все уведомления</h2>
            {notificationLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="bg-white border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        <p className="text-gray-600">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          Пользователь: {notification.user?.name} ({notification.user?.email})
                        </p>
                        <p className="text-sm text-gray-500">
                          Отправлено: {formatDate(notification.sentAt || notification.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          notification.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notification.isRead ? 'Прочитано' : 'Непрочитано'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create-invoice' && (
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Создать новый счет</h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пользователь
                </label>
                <select
                  value={invoiceForm.userId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, userId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value={0}>Выберите пользователя</option>
                  {users
                    .filter(user => !user.admin) // Только обычные пользователи
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Загружено пользователей: {users.length} | 
                  Обычных пользователей: {users.filter(user => !user.admin).length}
                </div>
                {loadingUsers && (
                  <p className="text-sm text-gray-500 mt-1">Загрузка пользователей...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Срок оплаты
                </label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Создать счет
              </button>
            </form>
          </div>
        )}

        {activeTab === 'send-notification' && (
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Отправить уведомление</h2>
            <form onSubmit={handleSendBroadcastNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип пользователей
                </label>
                <select
                  value={notificationForm.userType}
                  onChange={(e) => setNotificationForm({ ...notificationForm, userType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Все пользователи</option>
                  <option value="user">Только пользователи</option>
                  <option value="admin">Только админы</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={notificationForm.sendEmail}
                  onChange={(e) => setNotificationForm({ ...notificationForm, sendEmail: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-700">
                  Отправить по email
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Отправить уведомление
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
