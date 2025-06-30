import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MathProblem } from '@/types/math';
import { getOperationSymbol } from '@/utils/mathGenerator';

interface ProblemDisplayProps {
  problem: MathProblem;
  showAnswer?: boolean;
  userAnswer?: string;
}

export default function ProblemDisplay({ problem, showAnswer = false, userAnswer = '' }: ProblemDisplayProps) {
  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'addition': return ['#4ECDC4', '#44A08D'];
      case 'subtraction': return ['#FF6B9D', '#C44569'];
      case 'multiplication': return ['#45B7D1', '#2980B9'];
      case 'division': return ['#96CEB4', '#6AB04C'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.problemRow}>
        <Text style={styles.number}>{problem.num1}</Text>
        
        <LinearGradient
          colors={getOperationColor(problem.operation)}
          style={styles.operatorContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.operator}>{getOperationSymbol(problem.operation)}</Text>
        </LinearGradient>
        
        <Text style={styles.number}>{problem.num2}</Text>
        <Text style={styles.equals}>=</Text>
        
        {/* Show user's typed answer or final answer */}
        {showAnswer ? (
          <LinearGradient
            colors={problem.isCorrect ? ['#4ECDC4', '#44A08D'] : ['#FF6B9D', '#C44569']}
            style={styles.answerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.answerText}>
              {problem.userAnswer}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.userInputContainer}>
            <Text style={styles.userInput}>
              {userAnswer || '?'}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
    marginHorizontal: 4,
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  number: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#333333',
  },
  operatorContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  operator: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  equals: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#333333',
  },
  answerContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  answerText: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  userInputContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#45B7D1',
    borderStyle: 'dashed',
  },
  userInput: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#45B7D1',
    minWidth: 40,
    textAlign: 'center',
  },
});