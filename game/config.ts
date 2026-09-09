import { Difficulty, GameState } from './types';

export interface BalanceConfig {
  salary: number;
  startingSavings: number;
  rent: number;
  utilities: number;
  phone: number;
  internet: number;
  groceriesMin: number;
  groceriesMax: number;
  transportMin: number;
  transportMax: number;
  startingEnergy: number;
  startingStress: number;
  startingComfort: number;
  startingHappiness: number;
  startingReputation: number;
  fuelTankCapacity: number;
  fuelConsumption: number;
  carStartingCondition: number;
  stressThreshold: number;
  debtThreshold: number;
  priceVariance: number;
}

export const BALANCE: Record<Difficulty, BalanceConfig> = {
  easy: {
    salary: 95000,
    startingSavings: 30000,
    rent: 22000,
    utilities: 5000,
    phone: 700,
    internet: 600,
    groceriesMin: 13000,
    groceriesMax: 17000,
    transportMin: 4000,
    transportMax: 8000,
    startingEnergy: 100,
    startingStress: 20,
    startingComfort: 70,
    startingHappiness: 70,
    startingReputation: 60,
    fuelTankCapacity: 40,
    fuelConsumption: 8,
    carStartingCondition: 80,
    stressThreshold: 80,
    debtThreshold: -100000,
    priceVariance: 0.05,
  },
  normal: {
    salary: 75000,
    startingSavings: 20000,
    rent: 25000,
    utilities: 6000,
    phone: 800,
    internet: 700,
    groceriesMin: 15000,
    groceriesMax: 20000,
    transportMin: 5000,
    transportMax: 10000,
    startingEnergy: 90,
    startingStress: 30,
    startingComfort: 60,
    startingHappiness: 60,
    startingReputation: 50,
    fuelTankCapacity: 40,
    fuelConsumption: 10,
    carStartingCondition: 70,
    stressThreshold: 70,
    debtThreshold: -80000,
    priceVariance: 0.1,
  },
  hardcore: {
    salary: 60000,
    startingSavings: 10000,
    rent: 28000,
    utilities: 7000,
    phone: 900,
    internet: 800,
    groceriesMin: 18000,
    groceriesMax: 23000,
    transportMin: 6000,
    transportMax: 12000,
    startingEnergy: 80,
    startingStress: 40,
    startingComfort: 50,
    startingHappiness: 50,
    startingReputation: 40,
    fuelTankCapacity: 40,
    fuelConsumption: 12,
    carStartingCondition: 60,
    stressThreshold: 60,
    debtThreshold: -60000,
    priceVariance: 0.15,
  },
};

export const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const FUEL_BASE_PRICE = 52;

export function createInitialState(difficulty: Difficulty): GameState {
  const cfg = BALANCE[difficulty];
  return {
    difficulty,
    month: 1,
    day: 1,
    money: cfg.startingSavings,
    savings: 0,
    debt: 0,
    salary: cfg.salary,
    energy: cfg.startingEnergy,
    stress: cfg.startingStress,
    comfort: cfg.startingComfort,
    happiness: cfg.startingHappiness,
    reputation: cfg.startingReputation,
    hasCar: false,
    carCondition: 0,
    fuel: 0,
    fuelPrice: FUEL_BASE_PRICE,
    carExpenses: 0,
    monthlyIncomeMultiplier: 1,
    credits: [],
    subscriptions: [
      { id: 'music', name: 'Музыка', icon: 'music', cost: 199, active: true, monthsActive: 0 },
      { id: 'cinema', name: 'Киносервис', icon: 'film', cost: 399, active: true, monthsActive: 0 },
      { id: 'cloud', name: 'Облако', icon: 'cloud', cost: 299, active: true, monthsActive: 0 },
    ],
    stats: {
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
    achievements: [],
    monthlyHistory: [],
    flags: {},
    gameOver: false,
    won: false,
    endTitle: '',
  };
}

export const DEFAULT_SUBSCRIPTIONS = [
  { id: 'music', name: 'Музыка', icon: 'music', cost: 199 },
  { id: 'cinema', name: 'Киносервис', icon: 'film', cost: 399 },
  { id: 'cloud', name: 'Облако', icon: 'cloud', cost: 299 },
  { id: 'vpn', name: 'VPN', icon: 'shield', cost: 350 },
  { id: 'games', name: 'Игровой сервис', icon: 'gamepad', cost: 599 },
  { id: 'fitness', name: 'Фитнес-приложение', icon: 'dumbbell', cost: 799 },
];
