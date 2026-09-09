import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/game/GameContext';
import { formatMoney, getFinancialResult } from '@/game/engine';
import { playSound } from '@/game/sound';
import { ACHIEVEMENTS } from '@/game/achievements';

export default function EndScreen() {
  const router = useRouter();
  const { state, resetGame } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start();
    setTimeout(() => {
      Animated.timing(titleAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.bounce) }).start();
    }, 300);
  }, []);

  if (!state) {
    router.replace('/');
    return <View style={styles.container} />;
  }

  const won = state.won;
  const total = state.money + state.savings - state.debt;
  const financialResult = getFinancialResult(state);
  const unlockedAchievements = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));

  const handleMenu = async () => {
    playSound('button');
    await resetGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.emoji}>{won ? '🎉' : '😭'}</Text>

          <Animated.Text style={[styles.title, { opacity: titleAnim, transform: [{ scale: titleAnim }] }]}>
            {won ? 'ТЫ ВЫЖИЛ' : 'ИГРА ОКОНЧЕНА'}
          </Animated.Text>

          <View style={[styles.resultBadge, { backgroundColor: won ? '#d1fae5' : '#fee2e2' }]}>
            <Text style={[styles.resultText, { color: won ? '#059669' : '#dc2626' }]}>
              {financialResult}
            </Text>
          </View>

          <Text style={styles.endTitle}>{state.endTitle}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>📊 Финансовый отчёт</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Итоговый баланс</Text>
            <Text style={[styles.statValue, { color: total >= 0 ? '#059669' : '#dc2626' }]}>
              {formatMoney(total)}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Доход за год</Text>
            <Text style={styles.statValue}>{formatMoney(state.stats.totalIncome)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Расходы за год</Text>
            <Text style={styles.statValue}>{formatMoney(state.stats.totalExpenses)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Долги</Text>
            <Text style={[styles.statValue, { color: state.debt > 0 ? '#dc2626' : '#059669' }]}>
              {formatMoney(state.debt)}
            </Text>
          </View>
        </Animated.View>

        {/* Game stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>📈 Статистика</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Месяцев прожито</Text>
            <Text style={styles.statValue}>{Math.min(state.stats.monthsSurvived, 12)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Кредитов взято</Text>
            <Text style={styles.statValue}>{state.stats.creditsTaken}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Подработок</Text>
            <Text style={styles.statValue}>{state.stats.gigsDone}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Поездок на такси</Text>
            <Text style={styles.statValue}>{state.stats.taxiRides}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Заказов</Text>
            <Text style={styles.statValue}>{state.stats.ordersPlaced}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Отменено подписок</Text>
            <Text style={styles.statValue}>{state.stats.subscriptionsCancelled}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Куплено бензина</Text>
            <Text style={styles.statValue}>{state.stats.fuelLiters} л</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Случайных событий</Text>
            <Text style={styles.statValue}>{state.stats.eventsResolved}</Text>
          </View>
        </View>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>🏆 Достижения ({unlockedAchievements.length})</Text>
            {unlockedAchievements.map(ach => (
              <View key={ach.id} style={styles.achRow}>
                <Text style={styles.achIcon}>{ach.icon}</Text>
                <View style={styles.achInfo}>
                  <Text style={styles.achTitle}>{ach.title}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.menuButton} onPress={handleMenu} activeOpacity={0.7}>
          <Text style={styles.menuButtonText}>В главное меню</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { padding: 20, paddingTop: 40, alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
  resultBadge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, marginTop: 12 },
  resultText: { fontSize: 18, fontWeight: '700' },
  endTitle: { fontSize: 15, color: '#64748b', marginTop: 12, textAlign: 'center', fontStyle: 'italic' },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 360,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  statLabel: { fontSize: 15, color: '#6b7280' },
  statValue: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  achRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  achIcon: { fontSize: 28, marginRight: 12 },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  achDesc: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  menuButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 24,
    minWidth: 240,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
});
