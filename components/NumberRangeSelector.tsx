import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NumberRange } from '@/types/math';
import { soundManager } from '@/utils/soundManager';

interface NumberRangeSelectorProps {
  label: string;
  range: NumberRange;
  onRangeChange: (range: NumberRange) => void;
  minAllowed?: number;
  maxAllowed?: number;
}

export default function NumberRangeSelector({ 
  label, 
  range, 
  onRangeChange, 
  minAllowed = 0, 
  maxAllowed = 15 
}: NumberRangeSelectorProps) {
  
  const adjustMin = (delta: number) => {
    const newMin = Math.max(minAllowed, Math.min(range.max, range.min + delta));
    if (newMin !== range.min) {
      // Play button sound
      soundManager.playSound('button');
      onRangeChange({ ...range, min: newMin });
    }
  };

  const adjustMax = (delta: number) => {
    const newMax = Math.min(maxAllowed, Math.max(range.min, range.max + delta));
    if (newMax !== range.max) {
      // Play button sound
      soundManager.playSound('button');
      onRangeChange({ ...range, max: newMax });
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.rangeContainer}>
        <View style={styles.numberControl}>
          <Text style={styles.numberLabel}>Min 📉</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => adjustMin(-1)}
              disabled={range.min <= minAllowed}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={range.min <= minAllowed ? ['#F3F4F6', '#E5E7EB'] : ['#FF6B9D', '#C44569']}
                style={[styles.button, range.min <= minAllowed && styles.buttonDisabled]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Minus size={18} color={range.min <= minAllowed ? '#D1D5DB' : '#FFFFFF'} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.numberValueContainer}>
              <Text style={styles.numberValue}>{range.min}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => adjustMin(1)}
              disabled={range.min >= range.max}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={range.min >= range.max ? ['#F3F4F6', '#E5E7EB'] : ['#4ECDC4', '#44A08D']}
                style={[styles.button, range.min >= range.max && styles.buttonDisabled]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={18} color={range.min >= range.max ? '#D1D5DB' : '#FFFFFF'} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.numberControl}>
          <Text style={styles.numberLabel}>Max 📈</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => adjustMax(-1)}
              disabled={range.max <= range.min}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={range.max <= range.min ? ['#F3F4F6', '#E5E7EB'] : ['#FF6B9D', '#C44569']}
                style={[styles.button, range.max <= range.min && styles.buttonDisabled]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Minus size={18} color={range.max <= range.min ? '#D1D5DB' : '#FFFFFF'} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.numberValueContainer}>
              <Text style={styles.numberValue}>{range.max}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.buttonWrapper}
              onPress={() => adjustMax(1)}
              disabled={range.max >= maxAllowed}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={range.max >= maxAllowed ? ['#F3F4F6', '#E5E7EB'] : ['#4ECDC4', '#44A08D']}
                style={[styles.button, range.max >= maxAllowed && styles.buttonDisabled]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={18} color={range.max >= maxAllowed ? '#D1D5DB' : '#FFFFFF'} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  label: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 24,
  },
  numberControl: {
    alignItems: 'center',
    flex: 1,
  },
  numberLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonWrapper: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    borderRadius: 12,
    padding: 10,
  },
  buttonDisabled: {
    shadowOpacity: 0.05,
    elevation: 1,
  },
  numberValueContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#45B7D1',
  },
  numberValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#45B7D1',
    minWidth: 32,
    textAlign: 'center',
  },
});