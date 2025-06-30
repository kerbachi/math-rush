import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighScore, UserSettings, Operation, OperationSettings } from '@/types/math';

const HIGH_SCORES_KEY = 'math_practice_high_scores';
const USER_SETTINGS_KEY = 'math_practice_user_settings';

const defaultOperationSettings: OperationSettings = {
  addition: { min: 0, max: 10 },
  subtraction: { min: 0, max: 10 },
  multiplication: { min: 0, max: 10 },
  division: { min: 0, max: 10 },
};

export async function saveHighScore(score: HighScore): Promise<void> {
  try {
    const existingScores = await getHighScores();
    const updatedScores = [...existingScores, score]
      .sort((a, b) => {
        // First sort by date (newest first)
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) return dateComparison;
        
        // If dates are the same, sort by percentage (highest first)
        return b.percentage - a.percentage;
      })
      .slice(0, 10); // Keep only top 10 scores
    
    await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
}

export async function getHighScores(): Promise<HighScore[]> {
  try {
    const scoresJson = await AsyncStorage.getItem(HIGH_SCORES_KEY);
    const scores = scoresJson ? JSON.parse(scoresJson) : [];
    
    // Ensure scores are sorted by date (newest first), then by percentage
    return scores.sort((a: HighScore, b: HighScore) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      return b.percentage - a.percentage;
    }).map((score: any) => ({
      ...score,
      // Provide default testDuration for legacy scores that don't have it
      testDuration: score.testDuration || 30
    }));
  } catch (error) {
    console.error('Failed to get high scores:', error);
    return [];
  }
}

export async function clearAllHighScores(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HIGH_SCORES_KEY);
  } catch (error) {
    console.error('Failed to clear high scores:', error);
    throw error;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save user settings:', error);
  }
}

export async function getUserSettings(): Promise<UserSettings> {
  try {
    const settingsJson = await AsyncStorage.getItem(USER_SETTINGS_KEY);
    if (settingsJson) {
      const parsed = JSON.parse(settingsJson);
      // Handle legacy settings that might have difficultyLevel
      return {
        selectedOperations: parsed.selectedOperations || ['addition'],
        soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
        operationSettings: parsed.operationSettings || defaultOperationSettings,
        testDuration: parsed.testDuration || 30, // Default to 30 seconds
      };
    }
    return {
      selectedOperations: ['addition'] as Operation[],
      soundEnabled: true,
      operationSettings: defaultOperationSettings,
      testDuration: 30, // Default to 30 seconds
    };
  } catch (error) {
    console.error('Failed to get user settings:', error);
    return {
      selectedOperations: ['addition'] as Operation[],
      soundEnabled: true,
      operationSettings: defaultOperationSettings,
      testDuration: 30, // Default to 30 seconds
    };
  }
}