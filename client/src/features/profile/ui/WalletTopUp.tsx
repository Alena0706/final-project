import { walletSchema } from '@/entities/wallet/model/schemas';
import { setBalance } from '@/entities/wallet/model/slice';

import { topUpWallet } from '@/entities/wallet/model/thunks';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import React, { useState } from 'react';

import z from 'zod';

const WalletTopUp = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const balance = useAppSelector((store) => store.wallet.balance);
  const transactions = useAppSelector((store) => store.wallet.transactions);

  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    try {
      if (Number.isNaN(numAmount) || numAmount <= 0) {
        setError('Пожалуйста, введите корректную сумму больше нуля');
        setSuccess(false);
        return;
      }
      setError(null);

      // Валидируем сумму
      const dataValidate = walletSchema.parse(numAmount);

      // Используем API для пополнения кошелька
      await dispatch(
        topUpWallet({
          amount: dataValidate,
          description: 'Пополнение кошелька',
        }),
      ).unwrap();

      console.log(`Пополнение кошелька на сумму: ${numAmount.toString()}`);
      setSuccess(true);
      setAmount('');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Пожалуйста, введите корректную сумму меньше или равно 1000000');
        setSuccess(false);
      } else {
        setError('Ошибка пополнения кошелька');
        setSuccess(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-4 text-gradient-primary">Пополнение кошелька</h2>
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-card rounded-xl shadow-elegant">
          <span className="text-muted-foreground">Текущий баланс:</span>
          <span className="text-2xl font-bold text-foreground">
            {balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </span>
        </div>
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
          className="w-full border rounded px-3 py-2 mb-3 focus:outline-[hsl(200_75%_55%)]"
          placeholder="Введите сумму"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">Кошелек успешно пополнен</p>}
        <button
          type="submit"
          className="bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white px-4 py-2 rounded hover:from-[hsl(200_80%_60%)] hover:to-[hsl(210_80%_40%)] transition-all duration-300"
        >
          Пополнить кошелек
        </button>
      </form>

      {transactions.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-gradient-primary text-center">
            История пополнений
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction, index) => (
              <div
                key={`${transaction.id}-${index.toString()}`}
                className="bg-gradient-card rounded-lg p-4 border border-border shadow-elegant hover:shadow-iris transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-muted-foreground text-sm">
                    {new Date(transaction.date).toLocaleString('ru-RU', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-foreground font-semibold text-lg">
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
