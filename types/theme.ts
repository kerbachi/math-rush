export interface ColorPalette {
  // Primary colors
  primary: string[];
  primaryDark: string[];
  secondary: string[];
  secondaryDark: string[];
  
  // Background gradients
  backgroundGradient: string[];
  
  // Operation colors
  addition: string[];
  subtraction: string[];
  multiplication: string[];
  division: string[];
  
  // UI element colors
  surface: string[];
  surfaceSecondary: string[];
  success: string[];
  warning: string[];
  error: string[];
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  textOnSurface: string;
  
  // Special colors
  gold: string[];
  silver: string[];
  bronze: string[];
  
  // Tab bar
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
}

export interface FontTheme {
  // Font families
  headingFont: string;
  bodyFont: string;
  
  // Font sizes
  titleLarge: number;
  titleMedium: number;
  titleSmall: number;
  headlineLarge: number;
  headlineMedium: number;
  headlineSmall: number;
  bodyLarge: number;
  bodyMedium: number;
  bodySmall: number;
  labelLarge: number;
  labelMedium: number;
  labelSmall: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: ColorPalette;
  fonts: FontTheme;
}

export type ThemeId = 'theme1' | 'theme2' | 'theme3';