import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Delete, CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NumberPadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  userAnswer: string;
  disabled?: boolean;
  feedback?: 'correct' | 'incorrect' | null;
}

export default function NumberPad({ 
  onNumberPress, 
  onBackspace, 
  onSubmit, 
  userAnswer, 
  disabled = false,
  feedback = null 
}: NumberPadProps) {
  const maxNumberPress = 3;
  
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', 'backspace', 'submit']
  ];

  const handleNumberPress = (number: string) => {
    // Limit to maxNumberPress digits maximum
    if (userAnswer.length >= maxNumberPress) {
      return;
    }
    onNumberPress(number);
  };

  const renderButton = (value: string) => {
    let buttonContent;
    let buttonStyle = [styles.button];
    let gradientColors = ['#FFFFFF', '#F8F9FA'];

    if (value === 'backspace') {
      buttonContent = <Delete size={24} color="#FF6B9D" strokeWidth={2.5} />;
      gradientColors = ['#FFE5EC', '#FFF0F3'];
    } else if (value === 'submit') {
      buttonContent = (
        <View style={styles.submitContent}>
          <CheckCircle size={24} color="#FFFFFF" fill="#4ECDC4" />
          <Text style={styles.submitText}>GO!</Text>
        </View>
      );
      gradientColors = ['#4ECDC4', '#44A08D'];
      // Disable submit if no answer or answer is empty
      if (!userAnswer || userAnswer.trim() === '') {
        gradientColors = ['#E5E7EB', '#F3F4F6'];
      }
    } else {
      buttonContent = <Text style={styles.buttonText}>{value}</Text>;
      gradientColors = ['#FFFFFF', '#F8F9FA'];
      // Disable number buttons if already at maxNumberPress digit limit
      if (userAnswer.length >= maxNumberPress) {
        gradientColors = ['#F3F4F6', '#E5E7EB'];
      }
    }

    const handlePress = () => {
      if (disabled) return;
      
      if (value === 'backspace') {
        onBackspace();
      } else if (value === 'submit') {
        // Only allow submit if there's an answer
        if (userAnswer && userAnswer.trim() !== '') {
          onSubmit();
        }
      } else {
        handleNumberPress(value);
      }
    };

    const isButtonDisabled = disabled || 
      (value === 'submit' && (!userAnswer || userAnswer.trim() === '')) ||
      (value !== 'backspace' && value !== 'submit' && userAnswer.length >= maxNumberPress);

    return (
      <TouchableOpacity
        key={value}
        onPress={handlePress}
        disabled={isButtonDisabled}
        activeOpacity={0.8}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={gradientColors}
          style={[buttonStyle, isButtonDisabled && styles.buttonDisabled]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.feedbackDisplay}>
        {feedback && (
          <LinearGradient
            colors={feedback === 'correct' ? ['#4ECDC4', '#44A08D'] : ['#FF6B9D', '#C44569']}
            style={styles.feedbackBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.feedbackIcon}>
              {feedback === 'correct' ? '🎉' : '💪'}
            </Text>
            <Text style={styles.feedbackText}>
              {feedback === 'correct' ? 'Awesome!' : 'Try again!'}
            </Text>
            <Sparkles size={16} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.numberGrid}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(renderButton)}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  feedbackDisplay: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  feedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 6,
  },
  feedbackIcon: {
    fontSize: 16,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Fredoka-Bold',
    textAlign: 'center',
  },
  numberGrid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#333333',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
  },
});