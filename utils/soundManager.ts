import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export type SoundType = 'success' | 'error' | 'victory' | 'button';

interface SoundAssets {
  [key: string]: any;
}

// Sound file mappings
const soundAssets: SoundAssets = {
  success: require('@/assets/sounds/success-1-6297.mp3'),
  error: require('@/assets/sounds/error-126627.mp3'),
  victory: require('@/assets/sounds/victory sound.mp3'),
  button: require('@/assets/sounds/new-notification-010-352755.mp3'),
};

class SoundManager {
  private sounds: { [key in SoundType]?: Audio.Sound } = {};
  private isInitialized = false;
  private soundEnabled = true;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure audio mode for better performance
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Preload all sounds
      for (const [soundType, asset] of Object.entries(soundAssets)) {
        try {
          const { sound } = await Audio.Sound.createAsync(asset, {
            shouldPlay: false,
            volume: 0.8,
          });
          this.sounds[soundType as SoundType] = sound;
        } catch (error) {
          console.warn(`Failed to load sound: ${soundType}`, error);
        }
      }

      this.isInitialized = true;
      console.log('Sound system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sound system:', error);
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  async playSound(soundType: SoundType) {
    if (!this.soundEnabled) return;
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const sound = this.sounds[soundType];
      if (sound) {
        // Stop the sound if it's already playing
        await sound.stopAsync();
        // Reset to beginning and play
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error);
    }
  }

  async cleanup() {
    try {
      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          await sound.unloadAsync();
        }
      }
      this.sounds = {};
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup sounds:', error);
    }
  }

  // Platform-specific haptic feedback as fallback
  triggerHapticFeedback(type: 'success' | 'error' | 'light' = 'light') {
    if (Platform.OS !== 'web') {
      // This would require expo-haptics, but since we're web-first, we'll skip it
      // You can uncomment this if you add expo-haptics for mobile builds
      // import * as Haptics from 'expo-haptics';
      // switch (type) {
      //   case 'success':
      //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      //     break;
      //   case 'error':
      //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      //     break;
      //   default:
      //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // }
    }
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSuccessSound = () => soundManager.playSound('success');
export const playErrorSound = () => soundManager.playSound('error');
export const playVictorySound = () => soundManager.playSound('victory');
export const playButtonSound = () => soundManager.playSound('button');

export default soundManager;