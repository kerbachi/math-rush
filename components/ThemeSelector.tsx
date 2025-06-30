import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Palette, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { getAvailableThemes } from '@/constants/themes';
import { soundManager } from '@/utils/soundManager';

export default function ThemeSelector() {
  const { theme: currentTheme, setTheme } = useTheme();
  const availableThemes = getAvailableThemes();

  const handleThemeSelect = async (themeId: string) => {
    // Play button sound
    soundManager.playSound('button');
    await setTheme(themeId);
  };

  return (
    <View style={styles.container}>
      {availableThemes.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={styles.themeOption}
          onPress={() => handleThemeSelect(theme.id)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.surface}
            style={[
              styles.themeCard,
              currentTheme.id === theme.id && styles.selectedThemeCard
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.themePreview}>
              <View style={styles.colorPreview}>
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]} />
                <LinearGradient
                  colors={theme.colors.addition}
                  style={styles.colorSwatch}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <LinearGradient
                  colors={theme.colors.multiplication}
                  style={styles.colorSwatch}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>
              
              <View style={styles.themeInfo}>
                <View style={styles.themeHeader}>
                  <Palette size={20} color={theme.colors.primary} />
                  <Text style={[styles.themeName, { color: theme.colors.textPrimary }]}>
                    {theme.name}
                  </Text>
                </View>
                
                {currentTheme.id === theme.id && (
                  <View style={styles.selectedIndicator}>
                    <CheckCircle size={20} color={theme.colors.secondary} fill={theme.colors.secondary} />
                    <Text style={[styles.selectedText, { color: theme.colors.secondary }]}>
                      Active
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
      
      <View style={styles.comingSoon}>
        <Text style={[styles.comingSoonText, { color: currentTheme.colors.textSecondary }]}>
          🎨 More amazing themes coming soon! 🌟
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  themeOption: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThemeCard: {
    borderColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  themeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  comingSoonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
  },
});