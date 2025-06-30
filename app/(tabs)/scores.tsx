import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Trophy, Medal, Award, Clock, Timer, Star, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HighScore } from '@/types/math';
import { getHighScores } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ScoresScreen() {
  const { theme } = useTheme();
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding to account for tab bar
  const tabBarHeight = Platform.OS === 'android' ? 70 + insets.bottom : 70;
  const bottomPadding = tabBarHeight + 20;

  // Load scores when component mounts
  useEffect(() => {
    loadHighScores();
  }, []);

  // Reload scores every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHighScores();
    }, [])
  );

  const loadHighScores = async () => {
    try {
      setIsLoading(true);
      const scores = await getHighScores();
      setHighScores(scores);
    } catch (error) {
      console.error('Failed to load high scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    });
  };

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

  const getOperationsText = (operations: string[]) => {
    return operations.map(op => {
      switch (op) {
        case 'addition': return '➕';
        case 'subtraction': return '➖';
        case 'multiplication': return '✖️';
        case 'division': return '➗';
        default: return op;
      }
    }).join(' ');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy size={32} color="#FFD700" fill="#FFD700" />;
      case 1: return <Medal size={32} color="#C0C0C0" fill="#C0C0C0" />;
      case 2: return <Award size={32} color="#CD7F32" fill="#CD7F32" />;
      default: return (
        <View style={[styles.rankBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.rankNumber, { color: theme.colors.textOnPrimary }]}>{index + 1}</Text>
        </View>
      );
    }
  };

  const getScoreCardColor = (index: number) => {
    switch (index) {
      case 0: return theme.colors.gold; // Gold
      case 1: return theme.colors.silver; // Silver
      case 2: return theme.colors.bronze; // Bronze
      default: return theme.colors.surface; // Default
    }
  };

  const renderScoreItem = ({ item, index }: { item: HighScore; index: number }) => {
    const styles = createStyles(theme);
    
    return (
      <LinearGradient
        colors={getScoreCardColor(index)}
        style={[styles.scoreCard, index < 3 && styles.topScoreCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.rankContainer}>
          {getRankIcon(index)}
        </View>
        
        <View style={styles.scoreInfo}>
          <View style={styles.scoreHeader}>
            <View style={styles.percentageContainer}>
              <Text style={[styles.percentage, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.primary }]}>
                {item.percentage}%
              </Text>
              {index < 3 && <Sparkles size={20} color={theme.colors.textOnPrimary} />}
            </View>
            <Text style={[styles.scoreText, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.textPrimary }]}>
              {item.score}/{item.totalQuestions}
            </Text>
          </View>
          
          <View style={styles.scoreDetails}>
            <Text style={[styles.operations, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary }]}>
              Math: {getOperationsText(item.operations)}
            </Text>
            
            <View style={styles.testDurationRow}>
              <Timer size={14} color={index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary} />
              <Text style={[styles.testDurationText, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary }]}>
                Time: {formatDuration(item.testDuration || 30)}
              </Text>
            </View>
            
            <View style={styles.dateTimeRow}>
              <Text style={[styles.date, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary }]}>
                {formatDate(item.date)}
              </Text>
              <View style={styles.timeRow}>
                <Clock size={12} color={index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary} />
                <Text style={[styles.timeText, { color: index < 3 ? theme.colors.textOnPrimary : theme.colors.textSecondary }]}>
                  {formatTime(item.date)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Trophy size={40} color="#FFD700" fill="#FFD700" />
            <Text style={styles.title}>High Scores! 🏆</Text>
          </View>
          <View style={styles.loadingContainer}>
            <Sparkles size={48} color={theme.colors.textOnPrimary} />
            <Text style={styles.loadingText}>Loading your awesome scores! ✨</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Trophy size={40} color="#FFD700" fill="#FFD700" />
          <Text style={styles.title}>High Scores! 🏆</Text>
        </View>

        {highScores.length === 0 ? (
          <View style={styles.emptyState}>
            <Star size={80} color={theme.colors.textOnPrimary} />
            <Text style={styles.emptyTitle}>No Scores Yet! 🌟</Text>
            <Text style={styles.emptyText}>
              Play some math games to see your amazing scores here! 🎮
            </Text>
          </View>
        ) : (
          <FlatList
            data={highScores}
            renderItem={renderScoreItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.scoresList, { paddingBottom: bottomPadding }]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    fontSize: theme.fonts.titleLarge,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textOnPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: theme.fonts.titleMedium,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
  scoresList: {
    padding: 20,
  },
  scoreCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  topScoreCard: {
    borderWidth: 3,
    borderColor: theme.colors.textOnPrimary,
  },
  rankContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.headingFont,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentage: {
    fontSize: theme.fonts.titleMedium,
    fontFamily: theme.fonts.headingFont,
  },
  scoreText: {
    fontSize: theme.fonts.headlineMedium,
    fontFamily: theme.fonts.bodyFont,
  },
  scoreDetails: {
    gap: 6,
  },
  operations: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
  },
  testDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  testDurationText: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: theme.fonts.labelSmall,
    fontFamily: theme.fonts.bodyFont,
  },
});