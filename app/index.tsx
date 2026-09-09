import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/game/GameContext';
import { MenuButton } from '@/components/MenuButton';
import { playSound } from '@/game/sound';
import { Difficulty } from '@/game/types';

export default function MainMenu() {
  const router = useRouter();
  const { startGame, continueGame, hasSave, checkHasSave, soundEnabled, toggleSound, resetGame } = useGame();
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    checkHasSave();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNewGame = () => {
    playSound('button');
    setShowDifficulty(true);
  };

  const handleContinue = async () => {
    playSound('button');
    await continueGame();
    router.push('/game');
  };

  const handleDifficulty = (diff: Difficulty) => {
    startGame(diff);
    setShowDifficulty(false);
    router.push('/game');
  };

  const handleAchievements = () => {
    playSound('button');
    router.push('/achievements');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.titleEmoji}>💼💸😭</Text>
        <Text style={styles.title}>ВЫЖИВИ НА ЗАРПЛАТУ</Text>
        <Text style={styles.subtitle}>Экономический survival</Text>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        {hasSave && (
          <MenuButton
            label="Продолжить"
            icon="▶️"
            description="Загрузить сохранение"
            color="#059669"
            textColor="#ffffff"
            onPress={handleContinue}
          />
        )}
        <MenuButton
          label="Новая игра"
          icon="🆕"
          description="Начать с чистого листа"
          color="#0ea5e9"
          textColor="#ffffff"
          onPress={handleNewGame}
        />
        <MenuButton
          label="Достижения"
          icon="🏆"
          description="Посмотреть список"
          color="#f59e0b"
          textColor="#ffffff"
          onPress={handleAchievements}
        />
        <MenuButton
          label="Об игре"
          icon="ℹ️"
          description="Как играть"
          color="#f3f4f6"
          textColor="#1f2937"
          onPress={() => { playSound('button'); setShowAbout(true); }}
        />
      </View>

      <TouchableOpacity style={styles.soundToggle} onPress={toggleSound}>
        <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
      </TouchableOpacity>

      {hasSave && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={async () => { playSound('button'); await resetGame(); }}
        >
          <Text style={styles.resetText}>Удалить сохранение</Text>
        </TouchableOpacity>
      )}

      {/* Difficulty Modal */}
      <Modal visible={showDifficulty} transparent animationType="slide" onRequestClose={() => setShowDifficulty(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Выбери сложность</Text>
            <TouchableOpacity
              style={[styles.diffButton, { backgroundColor: '#d1fae5' }]}
              onPress={() => handleDifficulty('easy')}
              activeOpacity={0.7}
            >
              <Text style={styles.diffIcon}>😎</Text>
              <View>
                <Text style={styles.diffLabel}>Лёгкий</Text>
                <Text style={styles.diffDesc}>Зарплата выше, события мягче</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.diffButton, { backgroundColor: '#fef3c7' }]}
              onPress={() => handleDifficulty('normal')}
              activeOpacity={0.7}
            >
              <Text style={styles.diffIcon}>🙂</Text>
              <View>
                <Text style={styles.diffLabel}>Нормальный</Text>
                <Text style={styles.diffDesc}>Стандартная экономика</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.diffButton, { backgroundColor: '#fecaca' }]}
              onPress={() => handleDifficulty('hardcore')}
              activeOpacity={0.7}
            >
              <Text style={styles.diffIcon}>😰</Text>
              <View>
                <Text style={styles.diffLabel}>Хардкор</Text>
                <Text style={styles.diffDesc}>Меньше денег, больше проблем</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => { playSound('button'); setShowDifficulty(false); }}
            >
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="slide" onRequestClose={() => setShowAbout(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Как играть</Text>
              <Text style={styles.aboutText}>
                Ты получаешь зарплату и пытаешься прожить 12 месяцев.{'\n\n'}
                Каждый месяц нужно оплачивать расходы: жильё, коммуналку, связь, еду.{'\n\n'}
                Случайные события будут испытать твою выдержку: поломки, цены, доставка, бензин, работа.{'\n\n'}
                Выбирай варианты в карточках событий — каждый выбор влияет на деньги, энергию, стресс, комфорт и счастье.{'\n\n'}
                Можно брать подработку, кредиты, продавать вещи.{'\n\n'}
                Цель — прожить год без финансовой катастрофы.{'\n\n'}
                Удачи. Она понадобится.
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { playSound('button'); setShowAbout(false); }}
              >
                <Text style={styles.cancelText}>Понятно</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 340,
  },
  soundToggle: {
    marginTop: 24,
    padding: 12,
  },
  soundIcon: {
    fontSize: 28,
  },
  resetButton: {
    marginTop: 8,
    padding: 10,
  },
  resetText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  diffButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  diffIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  diffLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  diffDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 16,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  aboutText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
});
