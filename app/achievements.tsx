import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/game/GameContext';
import { ACHIEVEMENTS } from '@/game/achievements';
import { playSound } from '@/game/sound';

export default function AchievementsScreen() {
  const router = useRouter();
  const { state } = useGame();

  const unlockedIds = state?.achievements || [];
  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).length;

  const handleBack = () => {
    playSound('button');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Достижения</Text>
        <Text style={styles.headerCount}>{unlockedCount} / {ACHIEVEMENTS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ACHIEVEMENTS.map(ach => {
          const unlocked = unlockedIds.includes(ach.id);
          return (
            <View key={ach.id} style={[styles.achCard, unlocked && styles.achCardUnlocked]}>
              <Text style={[styles.achIcon, !unlocked && styles.achIconLocked]}>
                {unlocked ? ach.icon : '🔒'}
              </Text>
              <View style={styles.achInfo}>
                <Text style={[styles.achTitle, !unlocked && styles.achTitleLocked]}>
                  {unlocked ? ach.title : '???'}
                </Text>
                <Text style={[styles.achDesc, !unlocked && styles.achDescLocked]}>
                  {ach.description}
                </Text>
              </View>
              {unlocked && <Text style={styles.checkMark}>✓</Text>}
            </View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { padding: 8 },
  backText: { fontSize: 16, color: '#0ea5e9', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  headerCount: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  content: { padding: 16, paddingBottom: 20 },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  achCardUnlocked: { borderColor: '#fbbf24', backgroundColor: '#fffbeb' },
  achIcon: { fontSize: 32, marginRight: 14 },
  achIconLocked: { opacity: 0.4 },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  achTitleLocked: { color: '#94a3b8' },
  achDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  achDescLocked: { color: '#cbd5e1' },
  checkMark: { fontSize: 22, color: '#fbbf24', fontWeight: '700' },
});
