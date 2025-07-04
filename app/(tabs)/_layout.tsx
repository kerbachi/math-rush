import { Tabs } from 'expo-router';
import { Calculator, Trophy, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { soundManager } from '@/utils/soundManager';
import { router } from 'expo-router';

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

  const handleTabPress = (routeName: string, defaultHandler: () => void) => {
    // Play button sound
    soundManager.playSound('button');
    
    if (routeName === 'scores') {
      Alert.alert(
        'View Your Scores? 🏆',
        'Ready to see your amazing math achievements?',
        [
          {
            text: 'Stay Here 🎮',
            style: 'cancel',
            onPress: () => {
              soundManager.playSound('button');
            }
          },
          {
            text: 'View Scores! 📊',
            onPress: () => {
              soundManager.playSound('button');
              defaultHandler();
            }
          }
        ]
      );
    } else if (routeName === 'settings') {
      Alert.alert(
        'Open Settings? ⚙️',
        'Want to customize your math adventure?',
        [
          {
            text: 'Stay Here 🎮',
            style: 'cancel',
            onPress: () => {
              soundManager.playSound('button');
            }
          },
          {
            text: 'Open Settings! 🔧',
            onPress: () => {
              soundManager.playSound('button');
              defaultHandler();
            }
          }
        ]
      );
    } else {
      // For the main "Play" tab, navigate directly
      defaultHandler();
    }
  };

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
            <Calculator size={size + 4} color={color} strokeWidth={2.5} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('index', () => router.push('/(tabs)/'));
          },
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('scores', () => router.push('/(tabs)/scores'));
          },
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('settings', () => router.push('/(tabs)/settings'));
          },
        }}
      />
    </Tabs>
  );
}
