import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { TriangleAlert as AlertTriangle, Play, X, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface StopTestModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  currentScore: number;
  answeredQuestions: number;
}

export default function StopTestModal({ 
  visible, 
  onConfirm, 
  onCancel, 
  currentScore, 
  answeredQuestions 
}: StopTestModalProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const hasAnsweredQuestions = answeredQuestions > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={theme.colors.surface as [string, string]}
          style={styles.modal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <AlertTriangle size={60} color={theme.colors.error[0]} />
            <Text style={styles.title}>Stop Your Math Adventure? 🛑</Text>
          </View>
          
          {hasAnsweredQuestions ? (
            <View style={styles.progressInfo}>
              <View style={styles.progressRow}>
                <Clock size={20} color={theme.colors.secondary} />
                <Text style={styles.progressText}>
                  You've answered {answeredQuestions} question{answeredQuestions !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.scoreEmoji}>🎯</Text>
                <Text style={styles.progressText}>
                  Current score: {currentScore} correct
                </Text>
              </View>
              <Text style={styles.saveNote}>
                Your progress will be saved! 📊
              </Text>
            </View>
          ) : (
            <View style={styles.noProgressInfo}>
              <Text style={styles.noProgressText}>
                You haven't answered any questions yet! 🤔
              </Text>
              <Text style={styles.noProgressSubtext}>
                No progress will be saved if you stop now.
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.secondary as [string, string]}
                style={styles.cancelButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Play size={20} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />
                <Text style={styles.cancelButtonText}>Keep Playing! 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#F3F4F6', '#E5E7EB']}
                style={styles.confirmButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <X size={20} color={theme.colors.textSecondary} />
                <Text style={styles.confirmButtonText}>
                  {hasAnsweredQuestions ? 'Stop & Save 💾' : 'Stop Test 🛑'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: theme.fonts.titleMedium,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
  },
  scoreEmoji: {
    fontSize: 20,
  },
  saveNote: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  noProgressInfo: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  noProgressText: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  noProgressSubtext: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  cancelButton: {
    borderRadius: 16,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  cancelButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.headingFont,
  },
  confirmButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  confirmButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
  },
});