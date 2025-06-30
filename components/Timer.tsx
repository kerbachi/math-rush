import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

export default function Timer({ timeLeft, isActive }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const getTimerColors = () => {
    if (timeLeft <= 10) return ['#FF6B9D', '#C44569']; // Pink/Red - Urgent
    if (timeLeft <= 20) return ['#FFD93D', '#FF8C42']; // Yellow/Orange - Warning
    return ['#4ECDC4', '#44A08D']; // Teal/Green - Good
  };

  const getTimerIcon = () => {
    if (timeLeft <= 10) return <Zap size={18} color="#FFFFFF" fill="#FFFFFF" />;
    return <Clock size={18} color="#FFFFFF" />;
  };
  
  return (
    <LinearGradient
      colors={getTimerColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {getTimerIcon()}
      <Text style={styles.timeText}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 6,
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
});