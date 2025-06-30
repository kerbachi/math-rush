import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '@/utils/soundManager';

interface TimerDurationSelectorProps {
  duration: number; // Duration in seconds
  onDurationChange: (duration: number) => void;
  minDuration?: number; // Minimum duration in seconds
  maxDuration?: number; // Maximum duration in seconds
}

export default function TimerDurationSelector({ 
  duration, 
  onDurationChange, 
  minDuration = 5, 
  maxDuration = 300 
}: TimerDurationSelectorProps) {
  
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    }
  };

  const getStepSize = (currentDuration: number): number => {
    // Use smaller steps for shorter durations, larger steps for longer durations
    if (currentDuration < 30) return 5;
    if (currentDuration < 60) return 10;
    if (currentDuration < 120) return 15;
    return 30;
  };

  const adjustDuration = (delta: number) => {
    const stepSize = getStepSize(duration);
    const newDuration = Math.max(minDuration, Math.min(maxDuration, duration + (delta * stepSize)));
    if (newDuration !== duration) {
      // Play button sound
      soundManager.playSound('button');
      onDurationChange(newDuration);
    }
  };

  const getDurationHint = (seconds: number): string => {
    if (seconds < 30) return 'Quick & Fun! ⚡';
    if (seconds < 60) return 'Perfect Practice! 🎯';
    if (seconds < 120) return 'Challenge Mode! 💪';
    return 'Expert Level! 🏆';
  };

  const canDecrease = duration > minDuration;
  const canIncrease = duration < maxDuration;

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Clock size={24} color="#45B7D1" />
        <Text style={styles.label}>Test Duration ⏰</Text>
      </View>
      
      <View style={styles.controlRow}>
        <TouchableOpacity 
          style={styles.buttonWrapper}
          onPress={() => adjustDuration(-1)}
          disabled={!canDecrease}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canDecrease ? ['#FF6B9D', '#C44569'] : ['#F3F4F6', '#E5E7EB']}
            style={[styles.button, !canDecrease && styles.buttonDisabled]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Minus size={20} color={canDecrease ? '#FFFFFF' : '#D1D5DB'} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{formatDuration(duration)}</Text>
          <Text style={styles.durationHint}>
            {getDurationHint(duration)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.buttonWrapper}
          onPress={() => adjustDuration(1)}
          disabled={!canIncrease}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canIncrease ? ['#4ECDC4', '#44A08D'] : ['#F3F4F6', '#E5E7EB']}
            style={[styles.button, !canIncrease && styles.buttonDisabled]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Plus size={20} color={canIncrease ? '#FFFFFF' : '#D1D5DB'} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rangeInfo}>
        <Text style={styles.rangeText}>
          Range: {formatDuration(minDuration)} - {formatDuration(maxDuration)} 📊
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#333333',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  buttonWrapper: {
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    borderRadius: 14,
    padding: 14,
  },
  buttonDisabled: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  durationDisplay: {
    alignItems: 'center',
    minWidth: 120,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#45B7D1',
  },
  durationValue: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#45B7D1',
    marginBottom: 4,
  },
  durationHint: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    textAlign: 'center',
  },
  rangeInfo: {
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#999999',
  },
});