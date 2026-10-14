import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SupportedLanguage = 'en' | 'hi';

export interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  loadLanguage: () => Promise<void>;
  t: (en: string, hi: string) => string; // translation helper
}

const STORAGE_KEY = 'yogalife_language';

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',

  setLanguage: (lang: SupportedLanguage) => {
    set({ language: lang });
    // Asynchronously persist the selected language
    AsyncStorage.setItem(STORAGE_KEY, lang).catch((error) => {
      console.error('Failed to persist language preference to AsyncStorage:', error);
    });
  },

  loadLanguage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'hi') {
        set({ language: stored });
      }
    } catch (error) {
      console.error('Failed to load language preference from AsyncStorage:', error);
    }
  },

  t: (en: string, hi: string): string => {
    const currentLang = get().language;
    return currentLang === 'hi' ? (hi || en) : (en || hi);
  },
}));

export default useLanguageStore;
