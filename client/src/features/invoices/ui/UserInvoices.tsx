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
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
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
            className="px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-transparent text-foreground"
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
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Счетов пока нет</h3>
          <p className="text-muted-foreground">Когда вам будут выставлены счета, они появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="dark-glass border border-white/10 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Счет #{invoice.id}</h3>
                  <p className="text-muted-foreground">{invoice.description}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      invoice.status,
                    )}`}
                  >
                    {getStatusText(invoice.status)}
                  </span>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Срок оплаты</p>
                  <p className="font-medium text-foreground">{formatDate(invoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата создания</p>
                  <p className="font-medium text-foreground">{formatDate(invoice.createdAt)}</p>
                </div>
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Дата оплаты</p>
                    <p className="font-medium text-foreground">{formatDate(invoice.paidAt)}</p>
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
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-foreground mb-2">История платежей</h4>
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">{formatCurrency(payment.amount)}</span>
                      <span className="text-muted-foreground">{formatDate(payment.createdAt)}</span>
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
            className="px-3 py-2 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 text-foreground"
          >
            Назад
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Страница {currentPage} из {pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={currentPage === pagination.pages}
            className="px-3 py-2 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 text-foreground"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
