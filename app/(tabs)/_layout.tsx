import { Tabs } from 'expo-router';
import { Brain, Trophy, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  // Platform-specific tab bar constants
  const TAB_BAR_BASE_HEIGHT = {
    android: 70,
    ios: 90
  };
  
  const TAB_BAR_BASE_PADDING = {
    android: 12,
    ios: 25
  };

  // Calculate tab bar dimensions
  const tabBarHeight = Platform.select({
    android: TAB_BAR_BASE_HEIGHT.android + insets.bottom,
    ios: TAB_BAR_BASE_HEIGHT.ios + insets.bottom,
    default: 70
  });
  
  const tabBarPaddingBottom = Platform.select({
    android: TAB_BAR_BASE_PADDING.android,
    ios: TAB_BAR_BASE_PADDING.ios,
    default: 12
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: theme.colors.primaryDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 12,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.labelMedium,
          fontFamily: theme.fonts.headingFont,
          marginTop: 6,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ size, color }) => (
            <Brain size={size + 4} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: 'Scores',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size + 4} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size + 4} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}
