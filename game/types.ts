export type Difficulty = 'easy' | 'normal' | 'hardcore';

export type Screen = 'menu' | 'game' | 'achievements' | 'end';

export interface Effect {
  money?: number;
  savings?: number;
  debt?: number;
  energy?: number;
  stress?: number;
  comfort?: number;
  happiness?: number;
  reputation?: number;
  fuel?: number;
  carCondition?: number;
  monthlyPayment?: number;
  incomeMultiplier?: number;
}

export interface EventChoice {
  label: string;
  description?: string;
  effects: Effect;
  resultText: string;
  flag?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: EventCategory;
  rarity: 'common' | 'uncommon' | 'rare';
  conditions?: EventCondition;
  choices: EventChoice[];
  weight?: number;
}

export type EventCategory =
  | 'food'
  | 'transport'
  | 'car'
  | 'fuel'
  | 'marketplace'
  | 'delivery'
  | 'utilities'
  | 'internet'
  | 'work'
  | 'credit'
  | 'subscription'
  | 'repair'
  | 'social'
  | 'absurd'
  | 'gig'
  | 'general';

export interface EventCondition {
  minMoney?: number;
  maxMoney?: number;
  minStress?: number;
  maxStress?: number;
  minEnergy?: number;
  maxEnergy?: number;
  minMonth?: number;
  maxMonth?: number;
  hasCar?: boolean;
  hasDebt?: boolean;
  hasCredit?: boolean;
  minDebt?: number;
  minReputation?: number;
  difficulty?: Difficulty[];
}

export interface Subscription {
  id: string;
  name: string;
  icon: string;
  cost: number;
  active: boolean;
  monthsActive: number;
}

export interface Credit {
  id: string;
  principal: number;
  remaining: number;
  monthlyPayment: number;
  interestRate: number;
  monthsLeft: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface MonthlyStats {
  income: number;
  expenses: number;
}

export interface GameStats {
  totalIncome: number;
  totalExpenses: number;
  creditsTaken: number;
  gigsDone: number;
  taxiRides: number;
  ordersPlaced: number;
  subscriptionsCancelled: number;
  fuelLiters: number;
  eventsResolved: number;
  monthsSurvived: number;
}

export interface GameState {
  difficulty: Difficulty;
  month: number;
  day: number;
  money: number;
  savings: number;
  debt: number;
  salary: number;
  energy: number;
  stress: number;
  comfort: number;
  happiness: number;
  reputation: number;
  hasCar: boolean;
  carCondition: number;
  fuel: number;
  fuelPrice: number;
  carExpenses: number;
  monthlyIncomeMultiplier: number;
  credits: Credit[];
  subscriptions: Subscription[];
  stats: GameStats;
  achievements: string[];
  monthlyHistory: MonthlyStats[];
  flags: Record<string, boolean | number>;
  gameOver: boolean;
  won: boolean;
  endTitle: string;
}
