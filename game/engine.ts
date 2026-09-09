import { GameState, Effect, Difficulty } from './types';
import { BALANCE, FUEL_BASE_PRICE } from './config';
import { checkAchievements } from './achievements';

const SAVE_KEY = 'survive_the_salary_save';

export function clamp(value: number, min: number, max: number): number {
  if (isNaN(value) || !isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export function applyEffect(state: GameState, effect: Effect): GameState {
  const newState = { ...state };

  if (effect.money) newState.money += effect.money;
  if (effect.savings) newState.savings += effect.savings;
  if (effect.debt) newState.debt += effect.debt;
  if (effect.energy) newState.energy = clamp(newState.energy + effect.energy, 0, 100);
  if (effect.stress) newState.stress = clamp(newState.stress + effect.stress, 0, 100);
  if (effect.comfort) newState.comfort = clamp(newState.comfort + effect.comfort, 0, 100);
  if (effect.happiness) newState.happiness = clamp(newState.happiness + effect.happiness, 0, 100);
  if (effect.reputation) newState.reputation = clamp(newState.reputation + effect.reputation, 0, 100);
  if (effect.fuel) newState.fuel = clamp(newState.fuel + effect.fuel, 0, BALANCE[state.difficulty].fuelTankCapacity);
  if (effect.carCondition) newState.carCondition = clamp(newState.carCondition + effect.carCondition, 0, 100);
  if (effect.monthlyPayment) {
    // handled in credit creation, not here
  }
  if (effect.incomeMultiplier) newState.monthlyIncomeMultiplier *= effect.incomeMultiplier;

  newState.money = Math.round(newState.money);
  newState.savings = Math.round(newState.savings);
  newState.debt = Math.round(newState.debt);

  return newState;
}

export function applyChoice(state: GameState, choice: any): GameState {
  let newState = applyEffect(state, choice.effects);

  // Handle flags
  if (choice.flag === 'taxi') {
    newState.stats = { ...newState.stats, taxiRides: newState.stats.taxiRides + 1 };
  }
  if (choice.flag === 'gig') {
    newState.stats = { ...newState.stats, gigsDone: newState.stats.gigsDone + 1 };
  }
  if (choice.flag === 'order') {
    newState.stats = { ...newState.stats, ordersPlaced: newState.stats.ordersPlaced + 1 };
  }
  if (choice.flag === 'credit') {
    newState.stats = { ...newState.stats, creditsTaken: newState.stats.creditsTaken + 1 };
    const principal = choice.effects.money > 0 ? choice.effects.money : Math.abs(choice.effects.debt || 0);
    const monthlyPayment = choice.effects.monthlyPayment || Math.round(principal / 5);
    newState.credits = [
      ...newState.credits,
      {
        id: `credit_${Date.now()}`,
        principal,
        remaining: principal,
        monthlyPayment,
        interestRate: 0.2,
        monthsLeft: Math.ceil(principal / monthlyPayment),
      },
    ];
  }
  if (choice.flag === 'cancel_sub') {
    newState.stats = { ...newState.stats, subscriptionsCancelled: newState.stats.subscriptionsCancelled + 1 };
    newState.subscriptions = newState.subscriptions.map(s =>
      s.id === 'fitness' ? { ...s, active: false } : s
    );
  }
  if (choice.flag === 'buy_car') {
    newState.hasCar = true;
    newState.carCondition = BALANCE[state.difficulty].carStartingCondition;
    newState.fuel = 20;
  }
  if (choice.flag === 'no_purchase') {
    newState.flags = { ...newState.flags, no_purchase: true };
  }

  // Track buckwheat (economy food choice)
  if (choice.label === 'Эконом' || choice.label === 'Гречка, макароны, яйца') {
    newState.flags = { ...newState.flags, buckwheat_count: (typeof newState.flags['buckwheat_count'] === 'number' ? newState.flags['buckwheat_count'] : 0) + 1 };
  }

  // Track car ate salary
  if (choice.effects.money && choice.effects.money <= -15000 && state.hasCar) {
    newState.flags = { ...newState.flags, car_ate_salary: true };
  }

  // Track all spent
  if (newState.money <= 0) {
    newState.flags = { ...newState.flags, all_spent: true };
  }

  newState.stats = { ...newState.stats, eventsResolved: newState.stats.eventsResolved + 1 };

  // Check achievements
  const newAchievements = checkAchievements(newState);
  if (newAchievements.length > 0) {
    newState.achievements = [...newState.achievements, ...newAchievements];
  }

  return newState;
}

export function processMonthlyExpenses(state: GameState): GameState {
  const cfg = BALANCE[state.difficulty];
  let newState = { ...state };

  // Salary
  const salary = Math.round(cfg.salary * newState.monthlyIncomeMultiplier);
  newState.money += salary;
  newState.stats = { ...newState.stats, totalIncome: newState.stats.totalIncome + salary };

  // Reset monthly income multiplier
  newState.monthlyIncomeMultiplier = 1;

  // Rent
  newState.money -= cfg.rent;

  // Utilities
  const utilityVariance = 1 + (Math.random() - 0.5) * 2 * cfg.priceVariance;
  const utilities = Math.round(cfg.utilities * utilityVariance);
  newState.money -= utilities;

  // Phone
  newState.money -= cfg.phone;

  // Internet
  newState.money -= cfg.internet;

  // Subscriptions
  let subTotal = 0;
  newState.subscriptions = newState.subscriptions.map(s => {
    if (s.active) {
      subTotal += s.cost;
      return { ...s, monthsActive: s.monthsActive + 1 };
    }
    return s;
  });
  newState.money -= subTotal;

  // Credits
  if (newState.credits.length > 0) {
    const updatedCredits = [];
    for (const credit of newState.credits) {
      if (credit.remaining > 0) {
        newState.money -= credit.monthlyPayment;
        const interest = Math.round(credit.remaining * credit.interestRate / 12);
        const principalPayment = credit.monthlyPayment - interest;
        const newRemaining = Math.max(0, credit.remaining - principalPayment);
        const newMonthsLeft = credit.monthsLeft - 1;
        if (newRemaining <= 0) {
          newState.flags = { ...newState.flags, paid_off_credit: true };
        } else {
          updatedCredits.push({ ...credit, remaining: newRemaining, monthsLeft: newMonthsLeft });
        }
      } else {
        updatedCredits.push(credit);
      }
    }
    newState.credits = updatedCredits;
  }

  // Car expenses
  if (newState.hasCar) {
    const carMaintenance = Math.round(2000 + Math.random() * 3000);
    newState.money -= carMaintenance;
    newState.carExpenses += carMaintenance;
    // Car condition degrades
    newState.carCondition = clamp(newState.carCondition - 3, 0, 100);
    if (newState.carCondition < 20) {
      newState.stress = clamp(newState.stress + 5, 0, 100);
    }
  }

  // Track expenses
  const totalExpenses = cfg.rent + utilities + cfg.phone + cfg.internet + subTotal + (newState.credits.reduce((sum, c) => sum + c.monthlyPayment, 0));
  newState.stats = { ...newState.stats, totalExpenses: newState.stats.totalExpenses + totalExpenses };

  // Monthly history
  newState.monthlyHistory = [...newState.monthlyHistory, { income: salary, expenses: totalExpenses }];

  // Stress recovery
  newState.stress = clamp(newState.stress - 5, 0, 100);
  // Energy recovery
  newState.energy = clamp(newState.energy + 10, 0, 100);

  newState.money = Math.round(newState.money);

  return newState;
}

export function advanceMonth(state: GameState): GameState {
  let newState = processMonthlyExpenses({ ...state });

  newState.month += 1;
  newState.day = 1;
  newState.stats = { ...newState.stats, monthsSurvived: newState.month - 1 };

  // Check achievements
  const newAchievements = checkAchievements(newState);
  if (newAchievements.length > 0) {
    newState.achievements = [...newState.achievements, ...newAchievements];
  }

  // Check win/lose
  const cfg = BALANCE[state.difficulty];
  if (newState.month > 12) {
    newState.won = true;
    newState.gameOver = true;
    newState.endTitle = getEndTitle(newState);
  } else if (newState.money < cfg.debtThreshold) {
    newState.gameOver = true;
    newState.won = false;
    newState.endTitle = 'Всё. Я увольняюсь.';
  }

  return newState;
}

export function getEndTitle(state: GameState): string {
  const total = state.money + state.savings - state.debt;

  if (total >= 200000) return 'ФИНАНСОВЫЙ ГУРУ';
  if (total >= 100000) return 'НОРМАЛЬНО ПРОЖИЛ';
  if (total >= 50000) return 'ГЛАВНОЕ — НЕ БРАЛ КРЕДИТ';
  if (total >= 0) return 'ЗАТО БЕЗ ДОЛГОВ';
  if (total >= -30000) return 'ГРЕЧКА СПАСЛА';
  if (total >= -60000) return 'БЕНЗИН ПОБЕДИЛ';
  if (total >= -100000) return 'МАРКЕТПЛЕЙС ПОБЕДИЛ';
  return 'ТЫ ПРОСТО ОЧЕНЬ ХОРОШО ЭКОНОМИЛ';
}

export function getFinancialResult(state: GameState): string {
  const total = state.money + state.savings - state.debt;

  if (total >= 200000) return 'Финансовый гений';
  if (total >= 100000) return 'Уверенный середняк';
  if (total >= 0) return 'Как-то прожил';
  if (total >= -50000) return 'До зарплаты ещё 8 дней';
  if (total >= -100000) return 'Банк теперь знает тебя лично';
  return 'Всё. Я увольняюсь.';
}

export async function saveGame(state: GameState): Promise<void> {
  try {
    const { AsyncStorage } = await getAsyncStorage();
    if (AsyncStorage) {
      await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    // Silent fail - save is best-effort
  }
}

export async function loadGame(): Promise<GameState | null> {
  try {
    const { AsyncStorage } = await getAsyncStorage();
    if (!AsyncStorage) return null;
    const data = await AsyncStorage.getItem(SAVE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return validateSave(parsed);
  } catch (e) {
    return null;
  }
}

export async function hasSaveGame(): Promise<boolean> {
  try {
    const { AsyncStorage } = await getAsyncStorage();
    if (!AsyncStorage) return false;
    const data = await AsyncStorage.getItem(SAVE_KEY);
    return data !== null;
  } catch (e) {
    return false;
  }
}

export async function deleteSave(): Promise<void> {
  try {
    const { AsyncStorage } = await getAsyncStorage();
    if (AsyncStorage) {
      await AsyncStorage.removeItem(SAVE_KEY);
    }
  } catch (e) {
    // Silent fail
  }
}

async function getAsyncStorage(): Promise<any> {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return { AsyncStorage: mod.default };
  } catch (e) {
    return { AsyncStorage: null };
  }
}

function validateSave(data: any): GameState | null {
  if (!data || typeof data !== 'object') return null;
  if (typeof data.month !== 'number' || isNaN(data.month)) return null;
  if (typeof data.money !== 'number' || isNaN(data.money)) return null;
  if (!data.difficulty || !['easy', 'normal', 'hardcore'].includes(data.difficulty)) return null;

  // Ensure all required fields exist with defaults
  return {
    difficulty: data.difficulty,
    month: data.month,
    day: data.day || 1,
    money: data.money,
    savings: data.savings || 0,
    debt: data.debt || 0,
    salary: data.salary || 75000,
    energy: data.energy ?? 90,
    stress: data.stress ?? 30,
    comfort: data.comfort ?? 60,
    happiness: data.happiness ?? 60,
    reputation: data.reputation ?? 50,
    hasCar: data.hasCar || false,
    carCondition: data.carCondition || 0,
    fuel: data.fuel || 0,
    fuelPrice: data.fuelPrice || FUEL_BASE_PRICE,
    carExpenses: data.carExpenses || 0,
    monthlyIncomeMultiplier: data.monthlyIncomeMultiplier || 1,
    credits: data.credits || [],
    subscriptions: data.subscriptions || [],
    stats: data.stats || {
      totalIncome: 0,
      totalExpenses: 0,
      creditsTaken: 0,
      gigsDone: 0,
      taxiRides: 0,
      ordersPlaced: 0,
      subscriptionsCancelled: 0,
      fuelLiters: 0,
      eventsResolved: 0,
      monthsSurvived: 0,
    },
    achievements: data.achievements || [],
    monthlyHistory: data.monthlyHistory || [],
    flags: data.flags || {},
    gameOver: data.gameOver || false,
    won: data.won || false,
    endTitle: data.endTitle || '',
  };
}

export function formatMoney(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  return `${sign}${abs.toLocaleString('ru-RU')} ₽`;
}
