import { Theme, ColorPalette, FontTheme } from '@/types/theme';

// Base font theme (consistent across all themes)
const baseFontTheme: FontTheme = {
  // Font families
  headingFont: 'Fredoka-Bold',
  bodyFont: 'Nunito-SemiBold',
  
  // Font sizes
  titleLarge: 32,
  titleMedium: 28,
  titleSmall: 24,
  headlineLarge: 24,
  headlineMedium: 20,
  headlineSmall: 18,
  bodyLarge: 18,
  bodyMedium: 16,
  bodySmall: 14,
  labelLarge: 16,
  labelMedium: 14,
  labelSmall: 12,
};

// Theme 1 Colors (Previously Rainbow Adventure)
const theme1Colors: ColorPalette = {
  // Primary colors
  primary: ['#FF6B9D', '#C44569'],
  primaryDark: ['#C44569', '#A0395A'],
  secondary: ['#4ECDC4', '#44A08D'],
  secondaryDark: ['#44A08D', '#3A8B7A'],
  
  // Background gradients
  backgroundGradient: ['#FF9A9E', '#FECFEF', '#FECFEF'],
  
  // Operation colors
  addition: ['#4ECDC4', '#44A08D'],
  subtraction: ['#FF6B9D', '#C44569'],
  multiplication: ['#45B7D1', '#2980B9'],
  division: ['#96CEB4', '#6AB04C'],
  
  // UI element colors
  surface: ['#FFFFFF', '#F8F9FA'],
  surfaceSecondary: ['#F0F9FF', '#E0F2FE'],
  success: ['#4ECDC4', '#44A08D'],
  warning: ['#FFD93D', '#FF8C42'],
  error: ['#FF6B9D', '#C44569'],
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textOnPrimary: '#FFFFFF',
  textOnSurface: '#333333',
  
  // Special colors
  gold: ['#FFD700', '#FFA000'],
  silver: ['#E0E0E0', '#BDBDBD'],
  bronze: ['#FFAB91', '#FF8A65'],
  
  // Tab bar
  tabBarBackground: '#FF6B9D',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#FFB3D1',
};

// Theme 2 Colors (Ocean Deep)
const theme2Colors: ColorPalette = {
  // Primary colors
  primary: ['#012a67', '#001a4d'],
  primaryDark: ['#001a4d', '#001133'],
  secondary: ['#00d4ff', '#0099cc'],
  secondaryDark: ['#0099cc', '#007399'],
  
  // Background gradients
  backgroundGradient: ['#1e3c72', '#2a5298', '#3b82f6'],
  
  // Operation colors
  addition: ['#00d4ff', '#0099cc'],
  subtraction: ['#7c3aed', '#5b21b6'],
  multiplication: ['#f59e0b', '#d97706'],
  division: ['#10b981', '#059669'],
  
  // UI element colors
  surface: ['#f8fafc', '#f1f5f9'],
  surfaceSecondary: ['#e0f2fe', '#bae6fd'],
  success: ['#10b981', '#059669'],
  warning: ['#f59e0b', '#d97706'],
  error: ['#ef4444', '#dc2626'],
  
  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textOnPrimary: '#ffffff',
  textOnSurface: '#1e293b',
  
  // Special colors
  gold: ['#fbbf24', '#f59e0b'],
  silver: ['#e2e8f0', '#cbd5e1'],
  bronze: ['#fb923c', '#ea580c'],
  
  // Tab bar
  tabBarBackground: '#012a67',
  tabBarActive: '#ffffff',
  tabBarInactive: '#94a3b8',
};

// Theme 3 Colors (Azure Professional)
const theme3Colors: ColorPalette = {
  // Primary colors
  primary: ['#0b6296', '#084d75'],
  primaryDark: ['#084d75', '#063a59'],
  secondary: ['#17a2b8', '#138496'],
  secondaryDark: ['#138496', '#0f6b7d'],
  
  // Background gradients
  backgroundGradient: ['#4facfe', '#00f2fe', '#a8edea'],
  
  // Operation colors
  addition: ['#17a2b8', '#138496'],
  subtraction: ['#6f42c1', '#5a32a3'],
  multiplication: ['#fd7e14', '#e8590c'],
  division: ['#28a745', '#1e7e34'],
  
  // UI element colors
  surface: ['#ffffff', '#f8f9fa'],
  surfaceSecondary: ['#e3f2fd', '#bbdefb'],
  success: ['#28a745', '#1e7e34'],
  warning: ['#ffc107', '#e0a800'],
  error: ['#dc3545', '#c82333'],
  
  // Text colors
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textOnPrimary: '#ffffff',
  textOnSurface: '#212529',
  
  // Special colors
  gold: ['#ffc107', '#e0a800'],
  silver: ['#e9ecef', '#dee2e6'],
  bronze: ['#fd7e14', '#e8590c'],
  
  // Tab bar
  tabBarBackground: '#0b6296',
  tabBarActive: '#ffffff',
  tabBarInactive: '#adb5bd',
};

// Available themes
export const themes: Record<string, Theme> = {
  theme1: {
    id: 'theme1',
    name: 'Theme 1',
    colors: theme1Colors,
    fonts: baseFontTheme,
  },
  theme2: {
    id: 'theme2',
    name: 'Theme 2',
    colors: theme2Colors,
    fonts: baseFontTheme,
  },
  theme3: {
    id: 'theme3',
    name: 'Theme 3',
    colors: theme3Colors,
    fonts: baseFontTheme,
  },
};

// Default theme - now Theme 3
export const defaultTheme = themes.theme3;

// Theme utilities
export const getTheme = (themeId: string): Theme => {
  return themes[themeId] || defaultTheme;
};

export const getAvailableThemes = (): Theme[] => {
  return Object.values(themes);
};