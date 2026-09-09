import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, GameEvent } from './types';
import { createInitialState } from './config';
import { applyChoice, advanceMonth, saveGame, loadGame, hasSaveGame, deleteSave } from './engine';
import { pickRandomEvent } from './events';
import { checkAchievements, getAchievementById } from './achievements';
import { playSound, setSoundEnabled, isSoundEnabled } from './sound';

interface GameContextType {
  state: GameState | null;
  currentEvent: GameEvent | null;
  eventVisible: boolean;
  floatingText: { text: string; color: string } | null;
  achievementPopup: { title: string; icon: string; description: string } | null;
  monthTransition: boolean;
  soundEnabled: boolean;
  hasSave: boolean;
  startGame: (difficulty: Difficulty) => void;
  continueGame: () => Promise<void>;
  triggerEvent: () => void;
  chooseEventOption: (index: number) => void;
  closeEvent: () => void;
  nextMonth: () => void;
  toggleSound: () => void;
  resetGame: () => void;
  checkHasSave: () => Promise<void>;
  spendMoney: (amount: number, reason?: string) => boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventVisible, setEventVisible] = useState(false);
  const [floatingText, setFloatingText] = useState<{ text: string; color: string } | null>(null);
  const [achievementPopup, setAchievementPopup] = useState<{ title: string; icon: string; description: string } | null>(null);
  const [monthTransition, setMonthTransition] = useState(false);
  const [soundEnabled, setSoundState] = useState(isSoundEnabled());
  const [hasSave, setHasSave] = useState(false);

  const checkHasSave = useCallback(async () => {
    const exists = await hasSaveGame();
    setHasSave(exists);
  }, []);

  useEffect(() => {
    checkHasSave();
  }, []);

  // Auto-save when state changes
  useEffect(() => {
    if (state) {
      saveGame(state);
    }
  }, [state]);

  const showFloatingText = useCallback((text: string, color: string) => {
    setFloatingText({ text, color });
    setTimeout(() => setFloatingText(null), 1200);
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    const newState = createInitialState(difficulty);
    setState(newState);
    setCurrentEvent(null);
    setEventVisible(false);
    playSound('success');
  }, []);

  const continueGame = useCallback(async () => {
    const loaded = await loadGame();
    if (loaded) {
      setState(loaded);
      setCurrentEvent(null);
      setEventVisible(false);
    }
  }, []);

  const triggerEvent = useCallback(() => {
    if (!state || state.gameOver) return;
    const event = pickRandomEvent(state);
    if (event) {
      setCurrentEvent(event);
      setEventVisible(true);
      playSound('event');
    }
  }, [state]);

  const chooseEventOption = useCallback((index: number) => {
    if (!state || !currentEvent) return;
    const choice = currentEvent.choices[index];
    if (!choice) return;

    const newState = applyChoice(state, choice);
    setState(newState);

    // Show floating text for money changes
    if (choice.effects.money) {
      const isPositive = choice.effects.money > 0;
      showFloatingText(
        `${isPositive ? '+' : ''}${choice.effects.money} ₽`,
        isPositive ? '#059669' : '#dc2626'
      );
      playSound(isPositive ? 'money' : 'moneyDown');
    }

    // Check for new achievements
    const newAchievements = checkAchievements(newState);
    if (newAchievements.length > 0) {
      const first = newAchievements[0];
      const ach = getAchievementById(first);
      if (ach) {
        setTimeout(() => {
          setAchievementPopup({ title: ach.title, icon: ach.icon, description: ach.description });
          playSound('achievement');
          setTimeout(() => setAchievementPopup(null), 3000);
        }, 800);
      }
    }

    setEventVisible(false);
    setCurrentEvent(null);
  }, [state, currentEvent, showFloatingText]);

  const closeEvent = useCallback(() => {
    setEventVisible(false);
    setCurrentEvent(null);
  }, []);

  const nextMonth = useCallback(() => {
    if (!state || state.gameOver) return;
    setMonthTransition(true);
    playSound('month');

    setTimeout(() => {
      setState(prevState => {
        if (!prevState) return prevState;
        const newState = advanceMonth(prevState);

        // Check for game over achievements
        const newAchievements = checkAchievements(newState);
        if (newAchievements.length > 0) {
          const first = newAchievements[0];
          const ach = getAchievementById(first);
          if (ach) {
            setTimeout(() => {
              setAchievementPopup({ title: ach.title, icon: ach.icon, description: ach.description });
              playSound('achievement');
              setTimeout(() => setAchievementPopup(null), 3000);
            }, 1000);
          }
        }

        if (newState.gameOver) {
          if (newState.won) {
            playSound('win');
          } else {
            playSound('lose');
          }
        }

        return newState;
      });
      setMonthTransition(false);
    }, 800);
  }, [state]);

  const toggleSound = useCallback(() => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    setSoundState(newVal);
    if (newVal) playSound('button');
  }, [soundEnabled]);

  const resetGame = useCallback(async () => {
    await deleteSave();
    setState(null);
    setCurrentEvent(null);
    setEventVisible(false);
    setHasSave(false);
  }, []);

  const spendMoney = useCallback((amount: number, reason?: string): boolean => {
    if (!state) return false;
    if (state.money < amount) {
      playSound('error');
      showFloatingText('Недостаточно денег!', '#dc2626');
      return false;
    }
    setState(prev => {
      if (!prev) return prev;
      const newState = { ...prev, money: prev.money - amount };
      return newState;
    });
    showFloatingText(`-${amount} ₽`, '#dc2626');
    playSound('moneyDown');
    return true;
  }, [state, showFloatingText]);

  return (
    <GameContext.Provider
      value={{
        state,
        currentEvent,
        eventVisible,
        floatingText,
        achievementPopup,
        monthTransition,
        soundEnabled,
        hasSave,
        startGame,
        continueGame,
        triggerEvent,
        chooseEventOption,
        closeEvent,
        nextMonth,
        toggleSound,
        resetGame,
        checkHasSave,
        spendMoney,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
