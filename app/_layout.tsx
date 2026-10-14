import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useLanguageStore } from '@/stores/languageStore';
import { useProgressStore } from '@/stores/progressStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Colors } from '@/constants/theme';

import { Platform } from 'react-native';

// Keep the splash screen visible while loading resources on native only
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(true);

  const loadLanguage = useLanguageStore((state) => state.loadLanguage);
  const loadProgress = useProgressStore((state) => state.loadProgress);
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          loadLanguage(),
          loadProgress(),
          loadFavorites(),
          loadSettings(),
        ]);
      } catch (e) {
        console.warn('Error loading initial app state:', e);
      } finally {
        if (Platform.OS !== 'web') {
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <Stack
          initialRouteName="(tabs)"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.softGreenBg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pose/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="session/[id]"
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            name="breathing"
            options={{
              headerShown: false,
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="meditation"
            options={{
              headerShown: false,
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.softGreenBg,
  },
  splashFallback: {
    flex: 1,
    backgroundColor: Colors.softGreenBg,
  },
});
