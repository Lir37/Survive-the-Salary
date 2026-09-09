import { Achievement, GameState } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_month', title: 'Первый месяц', description: 'Прожить первый месяц', icon: '🌱', unlocked: false },
  { id: 'second_month', title: 'Дожил до второго', description: 'Дожить до второго месяца', icon: '📅', unlocked: false },
  { id: 'money_100k', title: '100 000 ₽', description: 'Накопить 100 000 ₽', icon: '💰', unlocked: false },
  { id: 'money_500k', title: '500 000 ₽', description: 'Накопить 500 000 ₽', icon: '🏦', unlocked: false },
  { id: 'no_credit', title: 'Ни одного кредита', description: 'Прожить год без кредитов', icon: '🚫', unlocked: false },
  { id: 'first_credit', title: 'Первый кредит', description: 'Взять первый кредит', icon: '💳', unlocked: false },
  { id: 'all_spent', title: 'Всё потратил', description: 'Потратить всю зарплату за один месяц', icon: '💸', unlocked: false },
  { id: 'zero_money', title: 'Ноль рублей', description: 'Дойти до нулевого баланса', icon: '0️⃣', unlocked: false },
  { id: 'buckwheat', title: 'Гречка спасла', description: 'Выбрать эконом-режим питания 5 раз', icon: '🥣', unlocked: false },
  { id: 'taxi_mistake', title: 'Такси — ошибка', description: 'Пользоваться такси 10 раз', icon: '🚕', unlocked: false },
  { id: 'marketplace_won', title: 'Маркетплейс победил', description: 'Сделать 5 заказов на маркетплейсе', icon: '📦', unlocked: false },
  { id: '3_days_left', title: 'До зарплаты 3 дня', description: 'Иметь меньше 1000 ₽ при живом балансе', icon: '⏳', unlocked: false },
  { id: 'car_ate_salary', title: 'Автомобиль съел зарплату', description: 'Потратить 15000+ на ремонт машины', icon: '🚗', unlocked: false },
  { id: 'survived_no_car', title: 'Выжил без машины', description: 'Прожить год без автомобиля', icon: '🚌', unlocked: false },
  { id: 'no_purchase_sale', title: 'Не купил на распродаже', description: 'Устоять перед распродажей', icon: '🛍️', unlocked: false },
  { id: 'cancelled_sub', title: 'Отменил подписку', description: 'Отменить подписку', icon: '🔁', unlocked: false },
  { id: 'found_gig', title: 'Нашёл подработку', description: 'Выполнить подработку', icon: '💵', unlocked: false },
  { id: 'paid_off_credit', title: 'Погасил кредит', description: 'Полностью погасить кредит', icon: '✅', unlocked: false },
  { id: 'financial_genius', title: 'Финансовый гений', description: 'Закончить год с 200 000+ ₽', icon: '🏆', unlocked: false },
  { id: 'survived_12', title: 'Выжил 12 месяцев', description: 'Дожить до конца года', icon: '🎉', unlocked: false },
  { id: 'stress_master', title: 'Стресс-машина', description: 'Достичь стресса 90+', icon: '😰', unlocked: false },
  { id: 'zen_master', title: 'Дзен-мастер', description: 'Держать стресс ниже 30 весь год', icon: '🧘', unlocked: false },
];

export function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = [];
  const unlocked = new Set(state.achievements);

  const check = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      newlyUnlocked.push(id);
      unlocked.add(id);
    }
  };

  check('first_month', state.month >= 1);
  check('second_month', state.month >= 2);
  check('money_100k', state.money + state.savings >= 100000);
  check('money_500k', state.money + state.savings >= 500000);
  check('first_credit', state.stats.creditsTaken > 0);
  check('zero_money', state.money <= 0 && state.money > -1000);
  check('taxi_mistake', state.stats.taxiRides >= 10);
  check('marketplace_won', state.stats.ordersPlaced >= 5);
  check('3_days_left', state.money < 1000 && state.money > 0);
  check('car_ate_salary', state.flags['car_ate_salary'] === true);
  check('survived_no_car', !state.hasCar && state.month >= 12);
  check('no_purchase_sale', state.flags['no_purchase'] === true);
  check('cancelled_sub', state.stats.subscriptionsCancelled > 0);
  check('found_gig', state.stats.gigsDone > 0);
  check('paid_off_credit', state.flags['paid_off_credit'] === true);
  check('stress_master', state.stress >= 90);
  check('zen_master', state.stress < 30 && state.month >= 12);
  check('no_credit', state.stats.creditsTaken === 0 && state.month >= 12);
  check('all_spent', state.flags['all_spent'] === true);
  check('buckwheat', typeof state.flags['buckwheat_count'] === 'number' && state.flags['buckwheat_count'] >= 5);
  check('financial_genius', state.money + state.savings >= 200000 && state.month >= 12);
  check('survived_12', state.month >= 12);

  return newlyUnlocked;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
