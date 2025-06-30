import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Trophy, RotateCcw, Star, Sparkles, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { soundManager } from '@/utils/soundManager';

interface ResultsModalProps {
  visible: boolean;
  score: number;
  totalQuestions: number;
  onTryAgain: () => void;
  onClose: () => void;
}

export default function ResultsModal({ visible, score, totalQuestions, onTryAgain, onClose }: ResultsModalProps) {
  const handleTryAgain = () => {
    soundManager.playSound('button');
    onTryAgain();
  };

  const handleClose = () => {
    soundManager.playSound('button');
    onClose();
  };

  // Handle case when no questions were answered (timer finished before answering)
  if (totalQuestions === 0) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <LinearGradient
            colors={['#FF6B9D', '#C44569'] as [string, string]}
            style={styles.modal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <Trophy size={60} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.title}>Time's Up! ⏱️</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>You didn't answer any questions!</Text>
              <Text style={styles.encouragementText}>
                Try again to beat the clock! ⏰
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.tryAgainButton} 
                onPress={handleTryAgain}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.tryAgainGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <RotateCcw size={28} color="#FF6B9D" />
                  <Text style={styles.tryAgainText}>Try Again! 🔄</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  }
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getEncouragementMessage = (percentage: number) => {
    if (percentage >= 90) return "You're a Math Superstar! 🌟✨";
    if (percentage >= 80) return "Fantastic Job! Keep it up! 🎉🚀";
    if (percentage >= 70) return "Great Work! You're amazing! 👏💫";
    if (percentage >= 60) return "Good Job! Practice makes perfect! 💪🌈";
    return "Keep trying! You're getting better! 🚀💖";
  };

  const getStarRating = (percentage: number) => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const getModalColors = (percentage: number) => {
    if (percentage >= 90) return ['#FFD700', '#FFA000']; // Gold
    if (percentage >= 70) return ['#4ECDC4', '#44A08D']; // Teal
    if (percentage >= 50) return ['#45B7D1', '#2980B9']; // Blue
    return ['#FF6B9D', '#C44569']; // Pink
  };

  const stars = getStarRating(percentage);

  return (
      <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
          <LinearGradient
            colors={getModalColors(percentage) as [string, string]}
          style={styles.modal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Trophy size={60} color="#FFFFFF" fill="#FFFFFF" />
            <Sparkles size={32} color="#FFFFFF" style={styles.sparkle1} />
            <Sparkles size={24} color="#FFFFFF" style={styles.sparkle2} />
            <Text style={styles.title}>Test Complete! 🎉</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score} out of {totalQuestions}</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>{percentage}%</Text>
              <Zap size={32} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((starIndex) => (
                <Star
                  key={starIndex}
                  size={40}
                  color="#FFFFFF"
                  fill={starIndex <= stars ? '#FFFFFF' : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </View>
          </View>
          
          <Text style={styles.encouragementText}>
            {getEncouragementMessage(percentage)}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.tryAgainButton} 
              onPress={handleTryAgain}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8F9FA']}
                style={styles.tryAgainGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <RotateCcw size={28} color="#FF6B9D" />
                <Text style={styles.tryAgainText}>Play Again! 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeText}>Back to Menu 🏠</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    maxWidth: 400,
    width: '100%',
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -10,
    left: -15,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  percentageText: {
    fontSize: 56,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  encouragementText: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 40,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  tryAgainButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  tryAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 12,
  },
  tryAgainText: {
    color: '#FF6B9D',
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
});