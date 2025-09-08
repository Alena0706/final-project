import { useAppSelector } from '@/shared/hooks/hooks';
import PartnerFormModal from '@/widgets/modalMain/ui/PartnerFormModal';
import { ArrowRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};
const Card = ({ children, className = '', ...props }: CardProps) => (
  <div
    className={`bg-gradient-card border-0 shadow-elegant rounded-3xl p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'outline' | 'filled';
  children: React.ReactNode;
};
const Badge = ({ children, variant = 'filled', className = '', ...props }: BadgeProps) => {
  const base = 'inline-block rounded-full px-4 py-1 font-semibold text-sm uppercase tracking-wide';
  const variantClass =
    variant === 'outline'
      ? 'border border-current bg-transparent text-current'
      : 'bg-current text-white';
  return (
    <span className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

const FranchisePage = (): React.JSX.Element => {
  const user = useAppSelector((store) => store.user.user?.user);
  // Состояния для калькулятора
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState(100000);
  const [monthlyCosts, setMonthlyCosts] = useState(50000);
  const [paushalnyVznos, setPaushalnyVznos] = useState(300000);
  const [investment, setInvestment] = useState(500000);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const netMonthlyProfit = avgMonthlyRevenue - monthlyCosts;
  const paybackPeriodMonths =
    netMonthlyProfit > 0 ? Math.ceil((paushalnyVznos + investment) / netMonthlyProfit) : 0;

  // Для документов
  const documents = [
    { id: 1, name: 'Договор франшизы.pdf', url: '#' },
    { id: 2, name: 'Прайс.xls', url: '#' },
    { id: 3, name: 'Бизнес-план.pdf', url: '#' },
  ];

  // Для загрузки файлов
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
  };

  // Пример данных отзывов
  const reviews = [
    { id: 1, user: 'Иван', text: 'Отличная франшиза, быстрый старт и поддержка на высоте.' },
    { id: 2, user: 'Мария', text: 'Очень выручает маркетинговая помощь, рекомендую!' },
    { id: 3, user: 'Олег', text: 'Учебные материалы помогли быстро освоиться.' },
  ];

  // Данные для графика окупаемости — месяцы и накопленная прибыль
  const profitabilityData = [
    { month: 'Янв', profit: 0 },
    { month: 'Фев', profit: 50000 },
    { month: 'Мар', profit: 120000 },
    { month: 'Апр', profit: 200000 },
    { month: 'Май', profit: 300000 },
    { month: 'Июн', profit: 380000 },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto p-6 space-y-16">
        {/* Преимущества франшизы */}
        <div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Преимущества франшизы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="font-semibold mb-2">Быстрый старт</h3>
              <p>Поддержка и обучение помогут быстро открыть и запустить бизнес.</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="font-semibold mb-2">Надежная модель</h3>
              <p>Проверенная бизнес-модель для стабильной прибыли.</p>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="font-semibold mb-2">Поддержка франчайзера</h3>
              <p>Маркетинговая и техническая поддержка на всех этапах.</p>
            </Card>
          </div>
        </div>

        {/* Калькулятор */}
        <div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Калькулятор дохода и окупаемости
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="space-y-4">
              <label>
                Среднемесячный доход, ₽
                <input
                  type="number"
                  className="w-full rounded border border-border bg-background px-3 py-2 mt-1"
                  value={avgMonthlyRevenue}
                  onChange={(e) => setAvgMonthlyRevenue(Number(e.target.value))}
                />
              </label>
              <label>
                Ежемесячные расходы, ₽
                <input
                  type="number"
                  className="w-full rounded border border-border bg-background px-3 py-2 mt-1"
                  value={monthlyCosts}
                  onChange={(e) => setMonthlyCosts(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="space-y-4 bg-gradient-card rounded-2xl p-6 shadow-elegant text-foreground">
              <p>
                Чистая прибыль: <b>{netMonthlyProfit.toLocaleString()} ₽</b>
              </p>
              <p>
                Паушальный взнос: <b>{paushalnyVznos.toLocaleString()} ₽</b>
              </p>
              <p>
                Общие инвестиции: <b>{investment.toLocaleString()} ₽</b>
              </p>
              <p>
                Окупаемость:{' '}
                <b>
                  {paybackPeriodMonths > 0
                    ? `${paybackPeriodMonths} мес.`
                    : 'Невозможно рассчитать'}
                </b>
              </p>
            </div>
          </div>
        </div>
        <button
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-700/50 text-lg px-8 py-6 group"
          onClick={openModal}
        >
          <>
            Стать партнером
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        </button>
        {/* Документы и загрузка */}
        <div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Документы и договоры
          </h2>
          <div className="max-w-4xl space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Доступные документы</h3>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <a href={doc.url} className="text-primary underline" download>
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Загрузите договор и чеки</h3>
              <input
                type="file"
                multiple
                onChange={onFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white cursor-pointer"
              />
              {uploadedFiles.length > 0 && (
                <ul className="mt-2 text-sm text-muted-foreground">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <section className="container mx-auto p-6 space-y-16">
          {/* Отзывы */}
          <div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Отзывы партнеров
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map(({ id, user, text }) => (
                <Card key={id} className="p-6 shadow-lg">
                  <h3 className="font-semibold mb-2">{user}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* График окупаемости */}
          <div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              График окупаемости
            </h2>
            <Card className="p-6 shadow-lg">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={profitabilityData}
                  margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(val) => `${val / 1000}k ₽`} />
                  <Tooltip
                    formatter={(value: number) =>
                      value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })
                    }
                  />
                  <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

        {/* Модальное окно обратной связи */}
        <div className="text-center">
          <button
            className="px-8 py-3 mt-12 bg-gradient-iris rounded-xl text-white shadow-iris hover:shadow-gold transition-all duration-300 hover:scale-105"
            onClick={() => setModalOpen(true)}
          >
            Обратная связь
          </button>
        </div>

        {/* Модалка */}
        <PartnerFormModal isOpen={isModalOpen} onClose={closeModal} user={user} />
      </section>
    </main>
  );
};

export default FranchisePage;
