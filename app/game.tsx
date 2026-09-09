import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, SafeAreaView, Modal } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useGame } from '@/game/GameContext';
import { StatBar } from '@/components/StatBar';
import { EventCard } from '@/components/EventCard';
import { FloatingText } from '@/components/FloatingText';
import { ActionButton } from '@/components/ActionButton';
import { formatMoney } from '@/game/engine';
import { playSound } from '@/game/sound';
import { BALANCE, MONTHS } from '@/game/config';
import { getFinancialResult } from '@/game/engine';

export default function GameScreen() {
  const router = useRouter();
  const {
    state,
    currentEvent,
    eventVisible,
    floatingText,
    achievementPopup,
    monthTransition,
    soundEnabled,
    toggleSound,
    triggerEvent,
    chooseEventOption,
    nextMonth,
  } = useGame();

  const [showFinance, setShowFinance] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const moneyScale = useRef(new Animated.Value(1)).current;
  const prevMoney = useRef(state?.money || 0);

  useEffect(() => {
    if (!state) {
      router.replace('/');
      return;
    }
    if (state.gameOver) {
      router.replace('/end');
      return;
    }
    if (state.money !== prevMoney.current) {
      Animated.sequence([
        Animated.timing(moneyScale, { toValue: 1.1, duration: 150, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        Animated.timing(moneyScale, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
      ]).start();
      prevMoney.current = state.money;
    }
  }, [state?.money, state?.gameOver]);

  if (!state) {
    return <View style={styles.emptyContainer} />;
  }

  const cfg = BALANCE[state.difficulty];
  const monthName = MONTHS[(state.month - 1) % 12];

  const handleNextMonth = () => {
    playSound('button');
    nextMonth();
  };

  const handleEvent = () => {
    playSound('button');
    triggerEvent();
  };

  const isStressed = state.stress >= cfg.stressThreshold;
  const isBroke = state.money < 5000;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Month transition overlay */}
      {monthTransition && (
        <View style={styles.monthTransitionOverlay}>
          <Animated.Text style={styles.monthTransitionText}>
            {state.month < 12 ? MONTHS[state.month % 12] : 'Финал'}
          </Animated.Text>
        </View>
      )}

      {/* Floating text */}
      <FloatingText
        text={floatingText?.text || ''}
        visible={!!floatingText}
        color={floatingText?.color || '#059669'}
        onComplete={() => {}}
      />

      {/* Achievement popup */}
      {achievementPopup && (
        <View style={styles.achievementPopup} pointerEvents="none">
          <Text style={styles.achievementIcon}>{achievementPopup.icon}</Text>
          <Text style={styles.achievementLabel}>Достижение!</Text>
          <Text style={styles.achievementTitle}>{achievementPopup.title}</Text>
          <Text style={styles.achievementDesc}>{achievementPopup.description}</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.monthBar}>
            <Text style={styles.monthText}>МЕСЯЦ {state.month} / 12</Text>
            <Text style={styles.monthName}>{monthName}</Text>
          </View>
          <TouchableOpacity onPress={toggleSound} style={styles.soundBtn}>
            <Text style={styles.soundBtnIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <View style={[styles.balanceCard, isBroke && styles.balanceCardBroke]}>
          <Text style={styles.balanceLabel}>Баланс</Text>
          <Animated.Text style={[styles.balanceAmount, { transform: [{ scale: moneyScale }] }]}>
            {formatMoney(state.money)}
          </Animated.Text>
          <View style={styles.balanceRow}>
            {state.debt > 0 && (
              <Text style={styles.debtText}>Долг: {formatMoney(state.debt)}</Text>
            )}
            {state.savings > 0 && (
              <Text style={styles.savingsText}>Накоплено: {formatMoney(state.savings)}</Text>
            )}
            {state.credits.length > 0 && (
              <Text style={styles.creditText}>Кредитов: {state.credits.length}</Text>
            )}
          </View>
        </View>

        {/* Status messages */}
        {isStressed && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>😰 Высокий стресс! Больше ошибок и затрат</Text>
          </View>
        )}
        {isBroke && (
          <View style={[styles.statusBadge, styles.statusBadgeBroke]}>
            <Text style={styles.statusBadgeText}>💸 До зарплаты осталось продержаться</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatBar label="Энергия" value={state.energy} icon="⚡" color="#0ea5e9" />
          <StatBar label="Стресс" value={state.stress} icon="😰" color="#ef4444" />
          <StatBar label="Комфорт" value={state.comfort} icon="🛋️" color="#8b5cf6" />
          <StatBar label="Счастье" value={state.happiness} icon="😊" color="#f59e0b" />
          <StatBar label="Репутация" value={state.reputation} icon="💼" color="#10b981" />
        </View>

        {/* Car status */}
        {state.hasCar && (
          <View style={styles.carCard}>
            <Text style={styles.carTitle}>🚗 Автомобиль</Text>
            <View style={styles.carInfo}>
              <View style={styles.carStat}>
                <Text style={styles.carStatLabel}>Состояние</Text>
                <Text style={styles.carStatValue}>{Math.round(state.carCondition)}%</Text>
              </View>
              <View style={styles.carStat}>
                <Text style={styles.carStatLabel}>Топливо</Text>
                <Text style={styles.carStatValue}>{state.fuel} л</Text>
              </View>
              <View style={styles.carStat}>
                <Text style={styles.carStatLabel}>Расходы</Text>
                <Text style={styles.carStatValue}>{formatMoney(state.carExpenses)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick info */}
        <View style={styles.quickInfo}>
          <Text style={styles.quickInfoText}>Зарплата: {formatMoney(cfg.salary)} / мес</Text>
          <Text style={styles.quickInfoText}>Событий пройдено: {state.stats.eventsResolved}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsGrid}>
          <ActionButton label="Событие" icon="🎲" onPress={handleEvent} color="#f59e0b" textColor="#ffffff" style={styles.actionBtn} />
          <ActionButton label="Следующий месяц" icon="▶️" onPress={handleNextMonth} color="#0ea5e9" textColor="#ffffff" style={styles.actionBtn} />
        </View>

        <View style={styles.actionsGrid}>
          <ActionButton label="Финансы" icon="💰" onPress={() => { playSound('button'); setShowFinance(true); }} color="#f3f4f6" style={styles.actionBtn} />
          <ActionButton label="Подписки" icon="📺" onPress={() => { playSound('button'); setShowSubs(true); }} color="#f3f4f6" style={styles.actionBtn} />
        </View>

        <View style={styles.actionsGrid}>
          <ActionButton label="Достижения" icon="🏆" onPress={() => { playSound('button'); router.push('/achievements'); }} color="#f3f4f6" style={styles.actionBtn} />
          <ActionButton label="Меню" icon="🏠" onPress={() => { playSound('button'); router.push('/'); }} color="#f3f4f6" style={styles.actionBtn} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Event modal */}
      {currentEvent && (
        <EventCard event={currentEvent} visible={eventVisible} onChoose={chooseEventOption} />
      )}

      {/* Finance modal */}
      <Modal visible={showFinance} transparent animationType="slide" onRequestClose={() => setShowFinance(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>💰 Финансы</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Баланс</Text>
                <Text style={styles.financeValue}>{formatMoney(state.money)}</Text>
              </View>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Зарплата</Text>
                <Text style={styles.financeValue}>{formatMoney(cfg.salary)}</Text>
              </View>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Аренда</Text>
                <Text style={styles.financeValue}>-{formatMoney(cfg.rent)}</Text>
              </View>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Коммуналка</Text>
                <Text style={styles.financeValue}>-{formatMoney(cfg.utilities)}</Text>
              </View>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Связь</Text>
                <Text style={styles.financeValue}>-{formatMoney(cfg.phone)}</Text>
              </View>
              <View style={styles.financeRow}>
                <Text style={styles.financeLabel}>Интернет</Text>
                <Text style={styles.financeValue}>-{formatMoney(cfg.internet)}</Text>
              </View>
              {state.credits.map((credit, i) => (
                <View key={i} style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Кредит {i + 1}</Text>
                  <Text style={styles.financeValue}>-{formatMoney(credit.monthlyPayment)}/мес</Text>
                </View>
              ))}
              {state.hasCar && (
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Машина (обслуж.)</Text>
                  <Text style={styles.financeValue}>~{formatMoney(3000)}/мес</Text>
                </View>
              )}
              <View style={styles.financeTotalRow}>
                <Text style={styles.financeTotalLabel}>Итого расходов/мес:</Text>
                <Text style={styles.financeTotalValue}>
                  -{formatMoney(cfg.rent + cfg.utilities + cfg.phone + cfg.internet + state.credits.reduce((s, c) => s + c.monthlyPayment, 0) + state.subscriptions.filter(s => s.active).reduce((s, sub) => s + sub.cost, 0))}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => { playSound('button'); setShowFinance(false); }}>
              <Text style={styles.closeBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Subscriptions modal */}
      <Modal visible={showSubs} transparent animationType="slide" onRequestClose={() => setShowSubs(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📺 Подписки</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {state.subscriptions.map((sub) => (
                <View key={sub.id} style={styles.subRow}>
                  <View style={styles.subInfo}>
                    <Text style={styles.subName}>{sub.name}</Text>
                    <Text style={styles.subCost}>{sub.cost} ₽/мес · {sub.monthsActive} мес</Text>
                  </View>
                  <View style={[styles.subStatus, { backgroundColor: sub.active ? '#d1fae5' : '#f3f4f6' }]}>
                    <Text style={styles.subStatusText}>{sub.active ? 'Активна' : 'Отключена'}</Text>
                  </View>
                </View>
              ))}
              {state.subscriptions.length === 0 && (
                <Text style={styles.emptyText}>Нет подписок. Гречка и тишина.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => { playSound('button'); setShowSubs(false); }}>
              <Text style={styles.closeBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  emptyContainer: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthBar: { flex: 1 },
  monthText: { fontSize: 13, fontWeight: '700', color: '#64748b', letterSpacing: 1 },
  monthName: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  soundBtn: { padding: 8, borderRadius: 10, backgroundColor: '#e2e8f0' },
  soundBtnIcon: { fontSize: 20 },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceCardBroke: { borderWidth: 2, borderColor: '#ef4444' },
  balanceLabel: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  balanceAmount: { fontSize: 40, fontWeight: '800', color: '#1e293b', marginVertical: 4 },
  balanceRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  debtText: { fontSize: 13, color: '#dc2626', fontWeight: '600' },
  savingsText: { fontSize: 13, color: '#059669', fontWeight: '600' },
  creditText: { fontSize: 13, color: '#f59e0b', fontWeight: '600' },
  statusBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  statusBadgeBroke: { backgroundColor: '#fee2e2' },
  statusBadgeText: { fontSize: 13, color: '#92400e', fontWeight: '500' },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  carCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  carTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  carInfo: { flexDirection: 'row', justifyContent: 'space-around' },
  carStat: { alignItems: 'center' },
  carStatLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 2 },
  carStatValue: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  quickInfoText: { fontSize: 13, color: '#64748b' },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionBtn: { flex: 1 },
  bottomSpacer: { height: 40 },
  monthTransitionOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  monthTransitionText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
  },
  achievementPopup: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    zIndex: 150,
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  achievementIcon: { fontSize: 36 },
  achievementLabel: { fontSize: 12, color: '#fbbf24', fontWeight: '700', marginTop: 4 },
  achievementTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginTop: 4 },
  achievementDesc: { fontSize: 13, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
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
    padding: 24,
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  financeLabel: { fontSize: 15, color: '#6b7280' },
  financeValue: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  financeTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, marginTop: 4 },
  financeTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  financeTotalValue: { fontSize: 16, fontWeight: '800', color: '#dc2626' },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  subInfo: { flex: 1 },
  subName: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  subCost: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  subStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  subStatusText: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  emptyText: { fontSize: 15, color: '#9ca3af', textAlign: 'center', paddingVertical: 20 },
  closeBtn: { marginTop: 16, padding: 14, alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12 },
  closeBtnText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
});
