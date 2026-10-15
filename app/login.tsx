import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export default function LoginScreen() {
  const { t, language } = useLanguageStore();
  const { login, register, loginAsGuest, loginWithSocial, isLoading } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form submission handler
  const handleSubmit = async () => {
    setErrorMessage(null);

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage(t('Please enter your full name.', 'कृपया अपना पूरा नाम दर्ज करें।'));
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage(t('Please enter a valid email address.', 'कृपया एक मान्य ईमेल दर्ज करें।'));
        return;
      }
      if (password.length < 6) {
        setErrorMessage(t('Password must be at least 6 characters.', 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'));
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(t('Passwords do not match.', 'पासवर्ड मेल नहीं खाते हैं।'));
        return;
      }

      const res = await register(name, email, password);
      if (res.success) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setErrorMessage(res.error || t('Registration failed.', 'पंजीकरण विफल रहा।'));
      }
    } else {
      if (!email.trim()) {
        setErrorMessage(t('Please enter your email.', 'कृपया अपना ईमेल दर्ज करें।'));
        return;
      }
      if (!password) {
        setErrorMessage(t('Please enter your password.', 'कृपया अपना पासवर्ड दर्ज करें।'));
        return;
      }

      const res = await login(email, password);
      if (res.success) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setErrorMessage(res.error || t('Invalid credentials.', 'अमान्य क्रेडेंशियल।'));
      }
    }
  };

  // Quick 1-click Demo Account filler
  const handleUseDemoAccount = () => {
    setEmail('swayam@yogalife.com');
    setPassword('yoga1234');
    setIsSignUp(false);
    setErrorMessage(null);
  };

  // Guest login
  const handleGuestLogin = async () => {
    await loginAsGuest();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Social login placeholder
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    await loginWithSocial(provider);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
            accessibilityLabel={t('Close', 'बंद करें')}
          >
            <Ionicons name="close" size={24} color={Colors.deepForest} />
          </TouchableOpacity>
          <LanguageSelector variant="compact" />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Branding */}
          <View style={styles.heroSection}>
            <View style={styles.lotusIconContainer}>
              <MaterialCommunityIcons name="flower-tulip-outline" size={42} color={Colors.deepForest} />
            </View>
            <Text style={styles.appTitle}>YogaLife</Text>
            <Text style={styles.sanskritSubtitle}>योग: कर्मसु कौशलम्</Text>
            <Text style={styles.welcomeSubtitle}>
              {isSignUp
                ? t('Create your mindful wellness account', 'अपना नया योग और कल्याण खाता बनाएं')
                : t('Welcome back to your mindful journey', 'अपनी दैनिक योग यात्रा में पुनः स्वागत है')}
            </Text>
          </View>

          {/* Mode Switcher Tabs (Login vs Sign Up) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, !isSignUp && styles.activeTabButton]}
              onPress={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, !isSignUp && styles.activeTabText]}>
                {t('Login', 'लॉगिन')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, isSignUp && styles.activeTabButton]}
              onPress={() => {
                setIsSignUp(true);
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isSignUp && styles.activeTabText]}>
                {t('Sign Up', 'साइन अप')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Message Box */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#D32F2F" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Name Input (Sign Up Only) */}
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('Full Name', 'पूरा नाम')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                    placeholderTextColor="#A0AFA0"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Email Address', 'ईमेल पता')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor="#A0AFA0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Password', 'पासवर्ड')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t('Enter your password', 'पासवर्ड दर्ज करें')}
                  placeholderTextColor="#A0AFA0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('Confirm Password', 'पासवर्ड की पुष्टि करें')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('Re-enter password', 'पासवर्ड दोबारा दर्ज करें')}
                    placeholderTextColor="#A0AFA0"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {/* Submit CTA Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? t('Create Account 🌿', 'खाता बनाएं 🌿') : t('Sign In 🧘', 'साइन इन करें 🧘')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Credentials Pill */}
            {!isSignUp && (
              <TouchableOpacity
                style={styles.demoFillBtn}
                onPress={handleUseDemoAccount}
                activeOpacity={0.7}
              >
                <Ionicons name="flash-outline" size={16} color={Colors.deepForest} />
                <Text style={styles.demoFillText}>
                  {t('Use Demo Account (swayam@yogalife.com)', 'डेमो खाता भरें (swayam@yogalife.com)')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Social / Alternative Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('OR', 'या')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign-In Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.socialButtonText}>
                {t('Continue with Google', 'Google से जारी रखें')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={22} color="#1A1A1A" />
              <Text style={styles.socialButtonText}>
                {t('Continue with Apple', 'Apple से जारी रखें')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Login Option */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="compass-outline" size={20} color={Colors.deepForest} />
            <Text style={styles.guestButtonText}>
              {t('Continue as Guest', 'अतिथि के रूप में जारी रखें')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.guestHint}>
            {t('You can explore poses, 3D animations, and voice guidance without an account.', 'आप बिना खाते के सभी आसन, 3D एनिमेशन और ध्वनि मार्गदर्शन का अनुभव ले सकते हैं।')}
          </Text>

          {/* Switch Prompt at Bottom */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerPromptText}>
              {isSignUp
                ? t('Already have an account?', 'पहले से खाता है?')
                : t("Don't have an account?", 'क्या खाता नहीं है?')}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.footerPromptAction}>
                {isSignUp ? t(' Sign In', ' साइन इन करें') : t(' Sign Up', ' साइन अप करें')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.softGreenBg,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  lotusIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    ...Shadows.md,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.deepForest,
    letterSpacing: 0.5,
  },
  sanskritSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.mutedGold,
    marginTop: 2,
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 290,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2EFE2',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.deepForest,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F2E8',
    ...Shadows.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FAF5',
    borderWidth: 1,
    borderColor: '#D4E8D4',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: Colors.deepForest,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...Shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    backgroundColor: '#F0F8F0',
    borderRadius: 10,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8E8D8',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E8D8',
    height: 48,
    borderRadius: 12,
    ...Shadows.sm,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.sageGreen,
    backgroundColor: '#FAFDF9',
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  guestHint: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  footerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerPromptText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerPromptAction: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepForest,
  },
});
