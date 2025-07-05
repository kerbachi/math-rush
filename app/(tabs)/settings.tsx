import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch, ScrollView, Alert, Modal } from 'react-native';
import { Linking } from 'react-native';
import { Settings as SettingsIcon, Volume2, VolumeX, SquareCheck as CheckSquare, Square, Trash2, TriangleAlert as AlertTriangle, Sparkles, Palette, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Operation, UserSettings, OperationSettings, NumberRange } from '@/types/math';
import { getUserSettings, saveUserSettings, clearAllHighScores } from '@/utils/storage';
import { soundManager } from '@/utils/soundManager';
import NumberRangeSelector from '@/components/NumberRangeSelector';
import TimerDurationSelector from '@/components/TimerDurationSelector';
import ThemeSelector from '../../components/ThemeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    selectedOperations: ['addition'],
    soundEnabled: true,
    operationSettings: {
      addition: { min: 0, max: 10 },
      subtraction: { min: 0, max: 10 },
      multiplication: { min: 0, max: 10 },
      division: { min: 0, max: 10 },
    },
    testDuration: 30,
  });
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding to account for tab bar
  const tabBarHeight = Platform.OS === 'android' ? 70 + insets.bottom : 70;
  const bottomPadding = tabBarHeight + 20;

  const operations: { key: Operation; label: string; emoji: string }[] = [
    { key: 'addition', label: 'Addition', emoji: '➕' },
    { key: 'subtraction', label: 'Subtraction', emoji: '➖' },
    { key: 'multiplication', label: 'Multiplication', emoji: '✖️' },
    { key: 'division', label: 'Division', emoji: '➗' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userSettings = await getUserSettings();
    setSettings(userSettings);
    // Update sound manager with loaded settings
    soundManager.setSoundEnabled(userSettings.soundEnabled);
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveUserSettings(updatedSettings);
    
    // Update sound manager if sound setting changed
    if (newSettings.soundEnabled !== undefined) {
      soundManager.setSoundEnabled(newSettings.soundEnabled);
    }
  };

  const toggleOperation = (operation: Operation) => {
    const newOperations = settings.selectedOperations.includes(operation)
      ? settings.selectedOperations.filter(op => op !== operation)
      : [...settings.selectedOperations, operation];
    
    if (newOperations.length > 0) {
      // Play button sound
      soundManager.playSound('button');
      updateSettings({ selectedOperations: newOperations });
    }
  };

  const updateOperationRange = (operation: Operation, range: NumberRange) => {
    const newOperationSettings = {
      ...settings.operationSettings,
      [operation]: range,
    };
    updateSettings({ operationSettings: newOperationSettings });
  };

  const updateTestDuration = (duration: number) => {
    updateSettings({ testDuration: duration });
  };

  const handleSoundToggle = (value: boolean) => {
    // Play sound if enabling, or if currently enabled (so user hears the last sound before disabling)
    if (value || settings.soundEnabled) {
      soundManager.playSound('button');
    }
    updateSettings({ soundEnabled: value });
  };

  const handleClearHistory = () => {
    // Play button sound
    soundManager.playSound('button');
    setShowClearConfirmation(true);
  };

  const confirmClearHistory = async () => {
    setIsClearing(true);
    try {
      // Play button sound
      soundManager.playSound('button');
      await clearAllHighScores();
      setShowClearConfirmation(false);
      // Show success feedback
      Alert.alert(
        'All Clear! 🎉',
        'Your test history has been cleared successfully!',
        [{ text: 'Awesome! 👍', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Oops! 😅',
        'Something went wrong. Let\'s try again!',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsClearing(false);
    }
  };

  const cancelClearHistory = () => {
    // Play button sound
    soundManager.playSound('button');
    setShowClearConfirmation(false);
  };

  const styles = createStyles(theme);

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SettingsIcon size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Settings ⚙️</Text>
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 App Theme</Text>
            <Text style={styles.sectionDescription}>
              Choose your favorite color adventure! 🌈
            </Text>
            
            <ThemeSelector />
          </View>

          {/* Test Duration Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Test Time</Text>
            <Text style={styles.sectionDescription}>
              How long should each math adventure last? 🚀
            </Text>
            
            <TimerDurationSelector
              duration={settings.testDuration}
              onDurationChange={updateTestDuration}
              minDuration={5}
              maxDuration={300}
            />
          </View>

          {/* Operations Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Default Math Adventures</Text>
            <Text style={styles.sectionDescription}>
              Pick your favorite math challenges! 🌟
            </Text>
            
            <View style={styles.operationsGrid}>
              {operations.map(({ key, label, emoji }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.operationButton,
                    { backgroundColor: settings.selectedOperations.includes(key) ? theme.colors[key][0] : theme.colors.surface[0] }
                  ]}
                  onPress={() => toggleOperation(key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.operationContent}>
                    {settings.selectedOperations.includes(key) ? (
                      <CheckSquare size={24} color={theme.colors.textOnPrimary} strokeWidth={3} />
                    ) : (
                      <Square size={24} color="#CCCCCC" strokeWidth={2} />
                    )}
                    <Text style={styles.operationEmoji}>{emoji}</Text>
                    <Text style={[
                      styles.operationLabel,
                      { color: settings.selectedOperations.includes(key) ? theme.colors.textOnPrimary : theme.colors.textPrimary }
                    ]}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Number Range Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔢 Number Ranges</Text>
            <Text style={styles.sectionDescription}>
              Choose how big or small your numbers should be! (0-15) 📊
            </Text>
            
            {operations.map(({ key, label, emoji }) => (
              <NumberRangeSelector
                key={key}
                label={`${emoji} ${label}`}
                range={settings.operationSettings[key]}
                onRangeChange={(range) => updateOperationRange(key, range)}
                minAllowed={0}
                maxAllowed={15}
              />
            ))}
          </View>

          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔊 Sound Effects</Text>
            <Text style={styles.sectionDescription}>
              Turn sounds on or off for your games! 🎵
            </Text>
            
            <View style={styles.soundContainer}>
              <View style={styles.soundOption}>
                <View style={styles.soundInfo}>
                  {settings.soundEnabled ? (
                    <Volume2 size={28} color={theme.colors.secondary} />
                  ) : (
                    <VolumeX size={28} color="#CCCCCC" />
                  )}
                  <Text style={styles.soundLabel}>
                    Sound Effects {settings.soundEnabled ? 'ON 🎵' : 'OFF 🔇'}
                  </Text>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={handleSoundToggle}
                  trackColor={{ false: '#E5E7EB', true: theme.colors.secondary }}
                  thumbColor={settings.soundEnabled ? theme.colors.textOnPrimary : '#F3F4F6'}
                />
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗂️ Data Management</Text>
            <Text style={styles.sectionDescription}>
              Manage your test scores and data 📋
            </Text>
            
            <TouchableOpacity 
              style={styles.clearHistoryButton} 
              onPress={handleClearHistory}
              disabled={isClearing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.error}
                style={styles.clearHistoryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Trash2 size={28} color={theme.colors.textOnPrimary} />
                <View style={styles.clearHistoryText}>
                  <Text style={styles.clearHistoryLabel}>Clear Test History 🗑️</Text>
                  <Text style={styles.clearHistoryDescription}>
                    Remove all saved scores and results
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📧 Contact</Text>
            <Text style={styles.sectionDescription}>
              Need help or have feedback? Get in touch! 💬
            </Text>
            
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={() => {
                // Play button sound
                soundManager.playSound('button');
                
                // Create a simpler mailto URL for better iOS compatibility
                const email = 'mathquiz-burst@protonmail.com';
                const subject = 'MathQuiz Burst - Support Request';
                const body = 'Hi there!\n\nPlease describe your issue or feedback:\n\n';
                
                // Properly encode the URL components
                const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                console.log('Attempting to open email URL:', emailUrl);
                
                // Try to open the email directly
                Linking.openURL(emailUrl)
                  .catch((error) => {
                    console.error('Failed to open email client:', error);
                    
                    // Fallback: Show email address in alert
                    Alert.alert(
                      'Contact Support 📧',
                      `Please send an email to:\n\n${email}\n\nSubject: ${subject}`,
                      [
                        {
                          text: 'Copy Email Address',
                          onPress: () => {
                            // On iOS, we can try to copy to clipboard if available
                            import('@react-native-clipboard/clipboard')
                              .then(({ default: Clipboard }) => {
                                Clipboard.setString(email);
                                Alert.alert('Copied! 📋', 'Email address copied to clipboard');
                              })
                              .catch(() => {
                                // If clipboard is not available, just show the email
                                Alert.alert('Email Address', email);
                              });
                          }
                        },
                        { text: 'OK', style: 'default' }
                      ]
                    );
                  });
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.secondary as [string, string]}
                style={styles.contactGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Mail size={28} color={theme.colors.textOnPrimary} />
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Contact Support 📧</Text>
                  <Text style={styles.contactDescription}>
                    Send us an email for help or feedback
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 Legal</Text>
            <Text style={styles.sectionDescription}>
              App information and legal documents 📋
            </Text>
            
            <TouchableOpacity 
              style={styles.licenseButton} 
              onPress={() => {
                // Play button sound
                soundManager.playSound('button');
                // Open external license page using Linking API
                const licenseUrl = 'https://mathquiz-burst.vercel.app/#license';
                
                Linking.canOpenURL(licenseUrl)
                  .then((supported) => {
                    if (supported) {
                      return Linking.openURL(licenseUrl);
                    } else {
                      Alert.alert(
                        'License Information 📜',
                        'Visit: https://mathquiz-burst.vercel.app/#license',
                        [{ text: 'OK', style: 'default' }]
                      );
                    }
                  })
                  .catch((error) => {
                    console.error('Error opening license URL:', error);
                    Alert.alert(
                      'License Information 📜',
                      'Visit: https://mathquiz-burst.vercel.app/#license',
                      [{ text: 'OK', style: 'default' }]
                    );
                  });
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.surface as [string, string]}
                style={styles.licenseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.licenseContent}>
                  <Text style={styles.licenseLabel}>License 📜</Text>
                  <Text style={styles.licenseDescription}>
                    View app license and terms
                  </Text>
                </View>
                <Text style={styles.externalLinkIcon}>🔗</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Clear History Confirmation Modal */}
        <Modal
          visible={showClearConfirmation}
          transparent
          animationType="fade"
          onRequestClose={cancelClearHistory}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={theme.colors.surface}
              style={styles.confirmationModal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeader}>
                <AlertTriangle size={60} color={theme.colors.primary} />
                <Text style={styles.modalTitle}>Clear All Scores? 🤔</Text>
              </View>
              
              <Text style={styles.modalMessage}>
                This will delete all your awesome test scores forever! 
                Are you sure you want to do this? 😮
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={cancelClearHistory}
                  disabled={isClearing}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Keep Scores! 📊</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.confirmButton, isClearing && styles.confirmButtonDisabled]} 
                  onPress={confirmClearHistory}
                  disabled={isClearing}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isClearing ? ['#FCA5A5', '#FCA5A5'] : theme.colors.error}
                    style={styles.confirmButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.confirmButtonText}>
                      {isClearing ? 'Clearing... ⏳' : 'Yes, Clear All! 🗑️'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
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
    color: theme.colors.primary,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: theme.fonts.titleSmall,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  operationButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  operationContent: {
    alignItems: 'center',
    gap: 8,
  },
  operationEmoji: {
    fontSize: 28,
  },
  operationLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.bodyFont,
    textAlign: 'center',
  },
  soundContainer: {
    backgroundColor: theme.colors.surface[0],
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  soundOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  soundLabel: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
  },
  clearHistoryButton: {
    borderRadius: 16,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clearHistoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  clearHistoryText: {
    flex: 1,
  },
  clearHistoryLabel: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    marginBottom: 4,
  },
  clearHistoryDescription: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    lineHeight: 18,
  },
  contactButton: {
    borderRadius: 16,
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textOnPrimary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModal: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: 400,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: theme.fonts.titleMedium,
    fontFamily: theme.fonts.headingFont,
    color: theme.colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.fonts.bodyMedium,
    fontFamily: theme.fonts.bodyFont,
  },
  licenseButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  licenseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
  },
  licenseContent: {
    flex: 1,
  },
  licenseLabel: {
    fontSize: theme.fonts.bodyLarge,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  licenseDescription: {
    fontSize: theme.fonts.bodySmall,
    fontFamily: theme.fonts.bodyFont,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  externalLinkIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
});