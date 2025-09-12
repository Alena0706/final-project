import { useAppSelector } from '@/shared/hooks/hooks';
import PartnerFormModal from '@/widgets/modalMain/ui/PartnerFormModal';
import FranchiseList from '@/widgets/franchise/ui/FranchiseList';
import { ArrowRight, Calculator, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';
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
const Card = ({ children, className = '', ...props }: CardProps): React.JSX.Element => (
  <div
    className={`bg-gradient-card border-0 shadow-elegant rounded-3xl p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const FranchisePage = (): React.JSX.Element => {
  const user = useAppSelector((store) => store.user.user?.user);
  // Состояния для калькулятора
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState('300000');
  const [monthlyCosts, setMonthlyCosts] = useState('100000');
  const [paushalnyVznos, setPaushalnyVznos] = useState('150000');
  const [investment, setInvestment] = useState('50000');
  const [isModalOpen, setModalOpen] = useState(false);

  const closeModal = (): void => setModalOpen(false);

  const avgMonthlyRevenueNum = Number(avgMonthlyRevenue) || 0;
  const monthlyCostsNum = Number(monthlyCosts) || 0;
  const paushalnyVznosNum = Number(paushalnyVznos) || 0;
  const investmentNum = Number(investment) || 0;

  const netMonthlyProfit = avgMonthlyRevenueNum - monthlyCostsNum;
  const totalInvestment = paushalnyVznosNum + investmentNum;
  const paybackPeriodMonths =
    netMonthlyProfit > 0 ? Math.ceil(totalInvestment / netMonthlyProfit) : 0;
  const annualProfit = netMonthlyProfit * 12;
  const roi = totalInvestment > 0 ? (annualProfit / totalInvestment) * 100 : 0;


  // Пример данных отзывов
  const reviews = [
    { id: 1, usr: 'Иван', text: 'Отличная франшиза, быстрый старт и поддержка на высоте.' },
    { id: 2, usr: 'Мария', text: 'Очень выручает маркетинговая помощь, рекомендую!' },
    { id: 3, usr: 'Олег', text: 'Учебные материалы помогли быстро освоиться.' },
  ];

  // Данные для графика окупаемости — месяцы и накопленная прибыль
  const generateProfitabilityData = () => {
    const months = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ];
    const data = [];
    let cumulativeProfit = 0;

    for (let i = 0; i < Math.min(12, paybackPeriodMonths + 6); i++) {
      cumulativeProfit += netMonthlyProfit;
      data.push({
        month: months[i],
        profit: Math.max(0, cumulativeProfit - totalInvestment),
        cumulative: cumulativeProfit,
        investment: totalInvestment,
      });
    }
    return data;
  };

  const profitabilityData = generateProfitabilityData();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок страницы */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-4">
            <h1 className="heading-2 text-gradient-primary">Франшиза "Твой взгляд"</h1>
          </div>
          <p className="text-muted-foreground text-xl">
            Уникальная возможность стать частью инновационного бизнеса
          </p>
        </div>

        {/* Преимущества франшизы */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="heading-3 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Преимущества франшизы
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Станьте частью успешной сети и получите все необходимые инструменты для быстрого
              старта
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card group animate-slide-up">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(200_80%_70%)] transition-colors">
                  Быстрый старт
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Поддержка и обучение помогут быстро открыть и запустить бизнес
                </p>
              </div>
            </div>
            <div className="card group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(200_80%_70%)] transition-colors">
                  Надежная модель
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Проверенная бизнес-модель для стабильной прибыли
                </p>
              </div>
            </div>
            <div className="card group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-iris">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(200_80%_70%)] transition-colors">
                  Поддержка франчайзера
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Маркетинговая и техническая поддержка на всех этапах
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Калькулятор */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Калькулятор доходности
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Рассчитайте потенциальную прибыль и срок окупаемости вашей франшизы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Настройки калькулятора */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Параметры расчета</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Среднемесячный доход, ₽
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={avgMonthlyRevenue}
                    onChange={(e) => setAvgMonthlyRevenue(e.target.value)}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ежемесячные расходы, ₽
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={monthlyCosts}
                    onChange={(e) => setMonthlyCosts(e.target.value)}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Паушальный взнос, ₽
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={paushalnyVznos}
                    onChange={(e) => setPaushalnyVznos(e.target.value)}
                    placeholder="300000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Дополнительные инвестиции, ₽
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="500000"
                  />
                </div>
              </div>
            </div>

            {/* Результаты расчета */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Результаты расчета</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Чистая прибыль в месяц:</span>
                  <span className="text-lg font-semibold text-foreground">
                    {netMonthlyProfit.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Годовая прибыль:</span>
                  <span className="text-lg font-semibold text-foreground">
                    {annualProfit.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Общие инвестиции:</span>
                  <span className="text-lg font-semibold text-foreground">
                    {totalInvestment.toLocaleString()} ₽
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Срок окупаемости:</span>
                  <span className="text-lg font-semibold text-foreground">
                    {paybackPeriodMonths > 0
                      ? `${paybackPeriodMonths} мес.`
                      : 'Невозможно рассчитать'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-lg text-white">
                  <span className="font-medium">ROI (годовая доходность):</span>
                  <span className="text-xl font-bold">{roi.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* График окупаемости */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              График окупаемости
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Визуализация накопленной прибыли и точки окупаемости инвестиций
            </p>
          </div>

          <div className="card max-w-6xl mx-auto">
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={profitabilityData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="month" stroke="#ffffff" fontSize={16} />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1000).toString()}k ₽`}
                    stroke="#ffffff"
                    fontSize={16}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }),
                      name === 'profit' ? 'Накопленная прибыль' : 'Накопленный доход',
                    ]}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(200, 75%, 55%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(200, 75%, 55%)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(200, 75%, 55%)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Список франшиз */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Наши франшизы
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Посмотрите на существующие франшизы и вдохновитесь успешными примерами
            </p>
          </div>

          <FranchiseList />
        </section>

        {/* Кнопки действий */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white text-lg font-semibold rounded-xl shadow-iris hover:shadow-gold transition-all duration-300 group"
            >
              Стать партнером
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] text-white text-lg font-semibold rounded-xl shadow-iris hover:shadow-gold transition-all duration-300"
              onClick={() => setModalOpen(true)}
            >
              Обратная связь
            </button>
          </div>
        </section>


        {/* Отзывы партнеров */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="heading-2 bg-gradient-to-r from-[hsl(200_80%_70%)] to-[hsl(210_90%_30%)] bg-clip-text text-transparent mb-6">
              Отзывы партнеров
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Реальные истории успеха наших партнеров
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map(({ id, usr, text }) => (
              <div
                key={id}
                className="card group animate-slide-up"
                style={{ animationDelay: `${id * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[hsl(200_75%_55%)] to-[hsl(210_75%_35%)] rounded-full flex items-center justify-center text-white font-semibold">
                      {usr.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-foreground">{usr}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">"{text}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Модалка */}
        <PartnerFormModal isOpen={isModalOpen} onClose={closeModal} user={user} />
      </div>
    </div>
  );
};

export default FranchisePage;
