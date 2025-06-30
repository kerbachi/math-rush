import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { soundManager } from '@/utils/soundManager';
import { useTheme } from '@/contexts/ThemeContext';
import { getUserSettings } from '@/utils/storage';

interface SoundContextType {
  playSuccess: () => void;
  playError: () => void;
  playVictory: () => void;
  playButton: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
  children: ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  useEffect(() => {
    // Load user settings and update sound manager
    const loadSoundSettings = async () => {
      try {
        const settings = await getUserSettings();
        soundManager.setSoundEnabled(settings.soundEnabled);
      } catch (error) {
        console.error('Failed to load sound settings:', error);
      }
    };

    loadSoundSettings();
  }, []);

  const playSuccess = () => soundManager.playSound('success');
  const playError = () => soundManager.playSound('error');
  const playVictory = () => soundManager.playSound('victory');
  const playButton = () => soundManager.playSound('button');

  return (
    <SoundContext.Provider value={{ playSuccess, playError, playVictory, playButton }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextType {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}