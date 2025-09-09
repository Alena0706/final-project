import { updateUser } from '@/entities/auth/model/thunks';
import { walletSchema } from '@/entities/wallet/model/schemas';
import { setBalance } from '@/entities/wallet/model/slice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

const WalletTopUp = (): React.JSX.Element => {
  const dispatsch = useAppDispatch();
  const balance = useAppSelector((store) => store.user.user?.user.balance);
  const transactions = useAppSelector((store) => store.wallet.transactions);
  const trans = useAppSelector((store) => store.user.user?.user.transactions);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    try {
      if (Number.isNaN(numAmount) || numAmount <= 0) {
        setError('Пожалуйста, введите корректную сумму больше нуля');
        setSuccess(false);
        return;
      }
      setError(null);
      // Здесь логика отправки платежа, API запрос и т.д.
      if (numAmount > 0) {
        const dataValidate = walletSchema.parse(numAmount);
        const transaction = { id: uuidv4(), amount: dataValidate, date: new Date().toISOString() };
        // dispatsch(addTransaction(transaction));
        void dispatsch(
          updateUser({
            balance: (balance ?? 0) + dataValidate,
            transactions: [...transactions, transaction],
          }),
        );
        if (balance && balance < dataValidate) {
          dispatsch(setBalance(balance));
        }
        console.log(`Пополнение кошелька на сумму: ${numAmount.toString()}`);
        setSuccess(true);
        setAmount('');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('Пожалуйста, введите корректную сумму меньше или равно 1000000');
        setSuccess(false);
      } else {
        setError('Ошибка валидации');
        setSuccess(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Пополнение кошелька</h2>
        <h2>{balance?.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</h2>
      </div>
      <form onSubmit={handleSubmit} className="max-w-sm" noValidate>
        <label htmlFor="amount" className="block mb-2 font-medium">
          Сумма к пополнению (₽)
        </label>
        <input
          type="number"
          min="0"
          max="1000000"
          id="amount"
          name="balance"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-indigo-500"
          placeholder="Введите сумму"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">Кошелек успешно пополнен</p>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Пополнить
        </button>
      </form>
      {(trans?.length ?? 0) > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">История пополнений</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trans?.map((transaction, index) => (
              <div key={`${transaction.id}-${index}`} className="space-y-4">
                <p className="text-gray-500">
                  {new Date(transaction.date).toLocaleString('ru-RU', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-900">
                  {transaction.amount.toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletTopUp;
