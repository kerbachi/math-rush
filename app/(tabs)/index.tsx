import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Play, SquareCheck as CheckSquare, Square, Sparkles, Zap, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Operation, MathProblem, GameSession, UserSettings } from '@/types/math';
import { generateProblemsSet } from '@/utils/mathGenerator';
import { getUserSettings, saveUserSettings, saveHighScore } from '@/utils/storage';
import { soundManager } from '@/utils/soundManager';
import Timer from '@/components/Timer';
import ProblemDisplay from '@/components/ProblemDisplay';
import NumberPad from '@/components/NumberPad';
import ResultsModal from '@/components/ResultsModal';
import StopTestModal from '../../components/StopTestModal';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function PracticeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>(['addition']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Use refs to prevent stale closures and race conditions
  const gameSessionRef = useRef<GameSession | null>(null);
  const timeLeftRef = useRef<number>(30);
  const isEndingGameRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update refs when state changes
  useEffect(() => {
    gameSessionRef.current = gameSession;
  }, [gameSession]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const insets = useSafeAreaInsets();
  
  // Platform-specific constants
  const TAB_BAR_HEIGHT = {
    android: 60,  // New Android height
    ios: 80       // New iOS height
  };

  const TAB_BAR_PADDING = {
    android: 8,   // New Android padding
    ios: 16       // New iOS padding
  };

  // Calculate bottom padding to account for tab bar
  const tabBarHeight = Platform.select({
    android: TAB_BAR_HEIGHT.android + insets.bottom,
    ios: TAB_BAR_HEIGHT.ios
  }) ?? 70; // Default value if Platform.select returns undefined

  const bottomPadding = tabBarHeight + (Platform.select({
    android: TAB_BAR_PADDING.android,
    ios: TAB_BAR_PADDING.ios
  }) ?? 12); // Default value if Platform.select returns undefined

  const operations: { key: Operation; label: string; emoji: string }[] = [
    { key: 'addition', label: 'Addition', emoji: '➕' },
    { key: 'subtraction', label: 'Subtraction', emoji: '➖' },
    { key: 'multiplication', label: 'Multiplication', emoji: '✖️' },
    { key: 'division', label: 'Division', emoji: '➗' },
  ];

  useEffect(() => {
    loadUserSettings();
  }, []);

  // Reload settings every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserSettings();
    }, [])
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Timer effect - completely rewritten for safety
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentGameSession = gameSessionRef.current;
    const currentTimeLeft = timeLeftRef.current;

    // Only set timer if game is active and time is left
    if (currentGameSession?.isActive && currentTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        const newTimeLeft = currentTimeLeft - 1;
        setTimeLeft(newTimeLeft);
        
        // Check if time is up
        if (newTimeLeft <= 0) {
          // Clear timer immediately to prevent multiple triggers
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          handleTimerEnd();
        }
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, gameSession?.isActive]);

  // Handle timer end safely with proper error handling
  const handleTimerEnd = useCallback(() => {
    console.log('handleTimerEnd called');
    
    // Check if already ending
    if (isEndingGameRef.current) {
      console.log('Already in ending process, skipping timer end');
      return;
    }

    const currentGameSession = gameSessionRef.current;
    
    if (!currentGameSession || !currentGameSession.isActive) {
      console.log('No active game session, skipping...');
      return;
    }

    // Calculate current score from answered problems
    const answeredProblems = currentGameSession.problems.filter(problem => 
      problem.userAnswer !== undefined
    );
    const correctAnswers = answeredProblems.filter(problem => problem.isCorrect);
    const currentScore = correctAnswers.length;
    
    console.log('Timer end stats:', {
      totalProblems: currentGameSession.problems.length,
      answeredProblems: answeredProblems.length,
      correctAnswers: correctAnswers.length,
      currentScore
    });

    // End the game with current state
    endGame(currentScore, currentGameSession.problems);
  }, []);

  const loadUserSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const userSettings = await getUserSettings();
      setSettings(userSettings);
      setSelectedOperations(userSettings.selectedOperations);
      
      // Update sound manager with current settings
      soundManager.setSoundEnabled(userSettings.soundEnabled);
      
      console.log('Settings loaded:', userSettings); // Debug log
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const toggleOperation = async (operation: Operation) => {
    const newOperations = selectedOperations.includes(operation)
      ? selectedOperations.filter(op => op !== operation)
      : [...selectedOperations, operation];
    
    if (newOperations.length === 0) {
      Alert.alert('Oops! 🤔', 'Please pick at least one math adventure!');
      return;
    }
    
    // Play button sound
    soundManager.playSound('button');
    
    setSelectedOperations(newOperations);
    if (settings) {
      const updatedSettings = {
        ...settings,
        selectedOperations: newOperations,
      };
      setSettings(updatedSettings);
      await saveUserSettings(updatedSettings);
    }
  };

  const startGame = async () => {
    if (selectedOperations.length === 0) {
      Alert.alert('Ready to Play? 🎮', 'Choose your math adventure first!');
      return;
    }

    // Play button sound
    soundManager.playSound('button');

    // Reset game ending flag
    isEndingGameRef.current = false;

    // Ensure we have the latest settings before starting
    const latestSettings = await getUserSettings();
    console.log('Starting game with settings:', latestSettings); // Debug log

    if (!latestSettings) {
      Alert.alert('Oops! 😅', 'Something went wrong. Let\'s try again!');
      return;
    }

    const problems = generateProblemsSet(
      selectedOperations, 
      20, 
      latestSettings.operationSettings
    );
    
    console.log('Generated problems sample:', problems.slice(0, 3)); // Debug log
    
    const newGameSession = {
      problems,
      selectedOperations,
      totalTime: latestSettings.testDuration,
      currentProblemIndex: 0,
      score: 0,
      isActive: true,
      isComplete: false,
    };
    
    setGameSession(newGameSession);
    setTimeLeft(latestSettings.testDuration);
    setUserAnswer('');
    setFeedback(null);
    setShowResults(false);
  };

  const submitAnswer = () => {
    if (!gameSession || !userAnswer) return;

    const currentProblem = gameSession.problems[gameSession.currentProblemIndex];
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    
    // Play appropriate sound
    if (isCorrect) {
      soundManager.playSound('success');
    } else {
      soundManager.playSound('error');
    }
    
    // Update problem with user answer
    const updatedProblems = [...gameSession.problems];
    updatedProblems[gameSession.currentProblemIndex] = {
      ...currentProblem,
      userAnswer: parseInt(userAnswer),
      isCorrect
    };

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Brief delay to show feedback, then move to next problem
    setTimeout(() => {
      const newScore = gameSession.score + (isCorrect ? 1 : 0);
      const nextIndex = gameSession.currentProblemIndex + 1;
      
      if (nextIndex >= gameSession.problems.length) {
        endGame(newScore, updatedProblems);
      } else {
        setGameSession({
          ...gameSession,
          problems: updatedProblems,
          currentProblemIndex: nextIndex,
          score: newScore,
        });
        setUserAnswer('');
        setFeedback(null);
      }
    }, 1000);
  };

  const endGame = async (finalScore?: number, finalProblems?: MathProblem[]) => {
    // Prevent multiple calls - must be first check!
    if (isEndingGameRef.current) {
      console.log('Game already ending, skipping...');
      return;
    }
    isEndingGameRef.current = true;
    console.log('Ending game started');

    const currentGameSession = gameSessionRef.current;
    
    if (!currentGameSession) {
      console.error('No game session available');
      setShowResults(true);
      isEndingGameRef.current = false;
      return;
    }

    try {
      console.log('Ending game...', { finalScore, finalProblems: !!finalProblems });
      
      // Use current gameSession data if no parameters provided (timer end case)
      const problems = finalProblems ?? currentGameSession.problems;
      const score = finalScore ?? currentGameSession.score;
      
      // Calculate total questions answered (problems that have userAnswer defined)
      const answeredProblems = problems.filter(problem => problem.userAnswer !== undefined);
      const totalQuestions = answeredProblems.length;

      console.log('Game stats:', { score, totalQuestions, answeredProblems: answeredProblems.length });

      // Play victory sound
      soundManager.playSound('victory');

      // Update game session state - make sure to deactivate the game
      const finalGameSession = {
        ...currentGameSession,
        score,
        problems,
        isActive: false, // This is crucial to stop the timer
        isComplete: true,
      };
      
      setGameSession(finalGameSession);

      // Save high score only if questions were answered
      if (totalQuestions > 0) {
        const highScore = {
          id: Date.now().toString(),
          score,
          totalQuestions,
          percentage: Math.round((score / totalQuestions) * 100),
          operations: selectedOperations,
          date: new Date().toISOString(),
          testDuration: currentGameSession.totalTime,
        };
        
        try {
          await saveHighScore(highScore);
          console.log('High score saved:', highScore);
        } catch (error) {
          console.error('Failed to save high score:', error);
        }
      }
      
      // Show results immediately after state updates
      setShowResults(true);
      console.log('Results modal should be visible now');
      
    } catch (error) {
      console.error('Error in endGame:', error);
      // Fallback: show results immediately
      setShowResults(true);
      console.log('Fallback results modal triggered');
    } finally {
      // Always reset the flag
      isEndingGameRef.current = false;
      console.log('Ending game completed - flag reset');
    }
  };

  const resetGame = () => {
    // Clear any running timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset all flags and state
    isEndingGameRef.current = false;
    setGameSession(null);
    setTimeLeft(settings?.testDuration || 30);
    setUserAnswer('');
    setShowResults(false);
    setFeedback(null);
  };

  const handleTryAgain = () => {
    // Play button sound
    soundManager.playSound('button');
    
    setShowResults(false); // Hide results modal first
    resetGame(); // Reset all game state
    // Start new game after a brief delay to ensure state is reset
    setTimeout(() => {
      startGame();
    }, 100);
  };

  const handleStopTest = () => {
    // Play button sound
    soundManager.playSound('button');
    setShowStopConfirmation(true);
  };

  const confirmStopTest = () => {
    // Play button sound
    soundManager.playSound('button');
    setShowStopConfirmation(false);
    
    const currentGameSession = gameSessionRef.current;
    if (!currentGameSession) return;

    // Check if any questions were answered
    const answeredProblems = currentGameSession.problems.filter(problem => 
      problem.userAnswer !== undefined
    );

    if (answeredProblems.length === 0) {
      // No questions answered, just reset the game without saving
      resetGame();
    } else {
      // Questions were answered, end the game normally
      const correctAnswers = answeredProblems.filter(problem => problem.isCorrect);
      endGame(correctAnswers.length, currentGameSession.problems);
    }
  };

  const cancelStopTest = () => {
    // Play button sound
    soundManager.playSound('button');
    setShowStopConfirmation(false);
  };

  const getCurrentProblem = () => {
    if (!gameSession || gameSession.currentProblemIndex >= gameSession.problems.length) {
      return null;
    }
    return gameSession.problems[gameSession.currentProblemIndex];
  };

  const currentProblem = getCurrentProblem();

  // Show loading state while settings are being loaded
  if (isLoadingSettings) {
    return (
      <LinearGradient colors={theme.colors.backgroundGradient as [string, string]} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Sparkles size={48} color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textOnPrimary }]}>Getting ready for fun! 🎉</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showResults && gameSession) {
    // Calculate total questions answered for the results modal
    const answeredProblems = gameSession.problems.filter(problem => problem.userAnswer !== undefined);
    const totalQuestions = answeredProblems.length;

    return (
      <ResultsModal
        visible={showResults}
        score={gameSession.score}
        totalQuestions={totalQuestions}
        onTryAgain={handleTryAgain}
        onClose={resetGame}
      />
    );
  }

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

  return (
    <LinearGradient colors={theme.colors.backgroundGradient as [string, string]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>MathQuiz Burst</Text>
            <Text style={styles.subtitle}>🚀 Number Adventure! 🌟</Text>
          </View>
          {gameSession?.isActive && (
            <View style={styles.gameInfo}>
              <Timer timeLeft={timeLeft} isActive={gameSession.isActive} />
              <TouchableOpacity 
                style={styles.stopButton} 
                onPress={handleStopTest}
                disabled={!!feedback} // Disable during transitions
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={feedback ? ['#F3F4F6', '#E5E7EB'] : theme.colors.error as [string, string]}
                  style={[styles.stopButtonGradient, feedback && styles.stopButtonDisabled]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <X size={18} color={feedback ? '#D1D5DB' : theme.colors.textOnPrimary} strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.scoreContainer}>
                <Zap size={16} color="#FFD700" />
                <Text style={styles.scoreText}>Score: {gameSession.score}</Text>
              </View>
            </View>
          )}
        </View>

        {!gameSession?.isActive ? (
          <View style={[styles.setupContainer, { paddingBottom: bottomPadding }]}>
            <Text style={styles.sectionTitle}>Choose Your Math Adventure! 🎯</Text>
            <View style={styles.operationsGrid}>
              {operations.map(({ key, label, emoji }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.operationButton,
                    { backgroundColor: selectedOperations.includes(key) ? theme.colors[key][0] : theme.colors.surface[0] }
                  ]}
                  onPress={() => toggleOperation(key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.operationContent}>
                    {selectedOperations.includes(key) ? (
                      <CheckSquare size={20} color={theme.colors.textOnPrimary} strokeWidth={3} />
                    ) : (
                      <Square size={20} color="#CCCCCC" strokeWidth={2} />
                    )}
                    <Text style={styles.operationEmoji}>{emoji}</Text>
                    <Text style={[
                      styles.operationLabel,
                      { color: selectedOperations.includes(key) ? theme.colors.textOnPrimary : theme.colors.textPrimary }
                    ]}>
                      {label}
                    </Text>
                    {settings && (
                      <Text style={[
                        styles.rangeText,
                        { color: selectedOperations.includes(key) ? theme.colors.textOnPrimary : theme.colors.textSecondary }
                      ]}>
                        {settings.operationSettings[key].min}-{settings.operationSettings[key].max}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {settings && (
              <View style={styles.durationInfo}>
                <Text style={styles.durationLabel}>
                  ⏰ Test Time: {formatDuration(settings.testDuration)}
                </Text>
                <Text style={styles.durationHint}>
                  Change in Settings ⚙️
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
              <LinearGradient
                colors={theme.colors.error as [string, string]}
                style={styles.startButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Play size={36} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />
                <Text style={styles.startButtonText}>Let's Play! 🎮</Text>
                <Sparkles size={24} color={theme.colors.textOnPrimary} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.gameContainer, { paddingBottom: bottomPadding }]}>
            {currentProblem && (
              <>
                {/* Problem Display */}
                <View style={styles.problemSection}>
                  <ProblemDisplay 
                    problem={currentProblem} 
                    userAnswer={userAnswer}
                  />
                </View>
                
                {/* Number Pad - Always in Same Position */}
                <View style={styles.numberPadSection}>
                  <NumberPad
                    onNumberPress={(num) => setUserAnswer(prev => prev + num)}
                    onBackspace={() => setUserAnswer(prev => prev.slice(0, -1))}
                    onSubmit={submitAnswer}
                    userAnswer={userAnswer}
                    disabled={!!feedback}
                    feedback={feedback}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {/* Stop Test Confirmation Modal */}
        <StopTestModal
          visible={showStopConfirmation}
          onConfirm={confirmStopTest}
          onCancel={cancelStopTest}
          currentScore={gameSession?.score || 0}
          answeredQuestions={gameSession?.problems.filter(p => p.userAnswer !== undefined).length || 0}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: theme.fonts.titleLarge,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textOnPrimary,
    textShadowColor: `${theme.colors.primaryDark}80`,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    marginTop: 4,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  stopButton: {
    borderRadius: 20,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonGradient: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  scoreText: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: theme.fonts.headlineMedium,
    fontFamily: theme.fonts.headingFont,
    textAlign: 'center',
  },
  setupContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: theme.fonts.titleSmall,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textOnPrimary,
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: `${theme.colors.primaryDark}50`,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  operationButton: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    width: '42%',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  operationContent: {
    alignItems: 'center',
    gap: 4,
  },
  operationEmoji: {
    fontSize: 28,
  },
  operationLabel: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    textAlign: 'center',
  },
  rangeText: {
    fontSize: theme.fonts.labelSmall,
    fontFamily: theme.fonts.bodyFont,
    marginTop: 2,
  },
  durationInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  durationLabel: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  durationHint: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textSecondary,
  },
  startButton: {
    borderRadius: 25,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    gap: 12,
  },
  startButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fonts.titleSmall,
    fontFamily: theme.fonts.headingFont,
  },
  gameContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  problemSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  numberPadSection: {
    flexShrink: 0,
  },
});
