import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { fetchUserInvoices, payInvoice } from '@/entities/invoice/model/thunks';

const UserInvoices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices, loading, error, pagination } = useAppSelector((state) => state.invoice);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    dispatch(fetchUserInvoices({ page: currentPage, status: statusFilter }));
  }, [dispatch, currentPage, statusFilter]);

  const handlePayInvoice = async (invoiceId: number) => {
    try {
      console.log('💳 Paying invoice:', invoiceId);
      await dispatch(payInvoice(invoiceId)).unwrap();
      console.log('✅ Invoice paid successfully');
      // Обновляем список счетов после оплаты
      dispatch(fetchUserInvoices({ page: currentPage, status: statusFilter }));
    } catch (error: any) {
      console.error('❌ Ошибка оплаты счета:', error);
      console.error('❌ Error details:', error.response?.data);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  const getStatusText = (status: string) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gradient-primary">Мои счета</h2>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Все статусы</option>
            <option value="pending">Ожидает оплаты</option>
            <option value="paid">Оплачен</option>
            <option value="overdue">Просрочен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Счетов пока нет</h3>
          <p className="text-gray-500">Когда вам будут выставлены счета, они появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Счет #{invoice.id}</h3>
                  <p className="text-gray-600">{invoice.description}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      invoice.status,
                    )}`}
                  >
                    {getStatusText(invoice.status)}
                  </span>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Срок оплаты</p>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата создания</p>
                  <p className="font-medium">{formatDate(invoice.createdAt)}</p>
                </div>
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm text-gray-500">Дата оплаты</p>
                    <p className="font-medium">{formatDate(invoice.paidAt)}</p>
                  </div>
                )}
              </div>

              {invoice.status === 'pending' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePayInvoice(invoice.id)}
                    disabled={loading}
                    className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Обработка...' : 'Оплатить счет'}
                  </button>
                </div>
              )}

              {invoice.payments && invoice.payments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">История платежей</h4>
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center text-sm">
                      <span>{formatCurrency(payment.amount)}</span>
                      <span className="text-gray-500">{formatDate(payment.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Страница {currentPage} из {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={currentPage === pagination.pages}
            className="px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
