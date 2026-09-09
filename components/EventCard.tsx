import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ActionButton } from './ActionButton';
import { GameEvent } from '@/game/types';

interface EventCardProps {
  event: GameEvent;
  visible: boolean;
  onChoose: (choiceIndex: number) => void;
}

export function EventCard({ event, visible, onChoose }: EventCardProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>{event.icon}</Text>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <ScrollView style={styles.choicesContainer} showsVerticalScrollIndicator={false}>
            {event.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choiceButton}
                onPress={() => onChoose(index)}
                activeOpacity={0.7}
              >
                <View style={styles.choiceContent}>
                  <Text style={styles.choiceLabel}>{choice.label}</Text>
                  {choice.description && (
                    <Text style={styles.choiceDescription}>{choice.description}</Text>
                  )}
                </View>
                <View style={styles.effectsContainer}>
                  {choice.effects.money && (
                    <Text style={[styles.effect, { color: choice.effects.money > 0 ? '#059669' : '#dc2626' }]}>
                      {choice.effects.money > 0 ? '+' : ''}{choice.effects.money} ₽
                    </Text>
                  )}
                  {choice.effects.energy && (
                    <Text style={[styles.effect, { color: choice.effects.energy > 0 ? '#0ea5e9' : '#dc2626' }]}>
                      Энергия {choice.effects.energy > 0 ? '+' : ''}{choice.effects.energy}
                    </Text>
                  )}
                  {choice.effects.stress && (
                    <Text style={[styles.effect, { color: choice.effects.stress > 0 ? '#dc2626' : '#059669' }]}>
                      Стресс {choice.effects.stress > 0 ? '+' : ''}{choice.effects.stress}
                    </Text>
                  )}
                  {choice.effects.comfort && (
                    <Text style={[styles.effect, { color: choice.effects.comfort > 0 ? '#059669' : '#dc2626' }]}>
                      Комфорт {choice.effects.comfort > 0 ? '+' : ''}{choice.effects.comfort}
                    </Text>
                  )}
                  {choice.effects.happiness && (
                    <Text style={[styles.effect, { color: choice.effects.happiness > 0 ? '#059669' : '#dc2626' }]}>
                      Счастье {choice.effects.happiness > 0 ? '+' : ''}{choice.effects.happiness}
                    </Text>
                  )}
                  {choice.effects.reputation && (
                    <Text style={[styles.effect, { color: choice.effects.reputation > 0 ? '#059669' : '#dc2626' }]}>
                      Реп. {choice.effects.reputation > 0 ? '+' : ''}{choice.effects.reputation}
                    </Text>
                  )}
                  {choice.effects.fuel && (
                    <Text style={[styles.effect, { color: choice.effects.fuel > 0 ? '#059669' : '#dc2626' }]}>
                      Топливо {choice.effects.fuel > 0 ? '+' : ''}{choice.effects.fuel}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  choicesContainer: {
    width: '100%',
    maxHeight: 300,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  choiceContent: {
    flex: 1,
  flexDirection: 'column',
  marginRight: 12,
  flexWrap: 'wrap',
  flexShrink: 1,
  maxWidth: '60%',
  },
  choiceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  choiceDescription: {
    fontSize: 13,
    color: '#9ca3af',
  },
  effectsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  effect: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
