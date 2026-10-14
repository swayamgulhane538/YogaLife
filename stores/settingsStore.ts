import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  voiceSpeed: number; // 0.5 to 2.0
  beginnerMode: boolean;
  alarmEnabled: boolean;
  alarmTime: string; // HH:MM format
  alarmDays: number[]; // 0=Sun, 1=Mon, etc.
  alarmSound: string; // sound ID
  alarmVibrate: boolean;
  setVoiceSpeed: (speed: number) => void;
  setBeginnerMode: (enabled: boolean) => void;
  setAlarmEnabled: (enabled: boolean) => void;
  setAlarmTime: (time: string) => void;
  setAlarmDays: (days: number[]) => void;
  setAlarmSound: (sound: string) => void;
  setAlarmVibrate: (vibrate: boolean) => void;
  loadSettings: () => Promise<void>;
}

const STORAGE_KEY = 'yogalife_settings';

const DEFAULT_SETTINGS = {
  voiceSpeed: 1.0,
  beginnerMode: true,
  alarmEnabled: false,
  alarmTime: '06:30',
  alarmDays: [1, 2, 3, 4, 5], // Monday through Friday
  alarmSound: 'om_chant',
  alarmVibrate: true,
};

const saveToStorage = (settings: {
  voiceSpeed: number;
  beginnerMode: boolean;
  alarmEnabled: boolean;
  alarmTime: string;
  alarmDays: number[];
  alarmSound: string;
  alarmVibrate: boolean;
}) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch((error) => {
    console.error('Failed to save settings to AsyncStorage:', error);
  });
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  setVoiceSpeed: (speed: number) => {
    // Clamp speed between 0.5 and 2.0
    const clampedSpeed = Math.min(2.0, Math.max(0.5, Number(speed.toFixed(1))));
    set({ voiceSpeed: clampedSpeed });
    saveToStorage({ ...get(), voiceSpeed: clampedSpeed });
  },

  setBeginnerMode: (enabled: boolean) => {
    set({ beginnerMode: enabled });
    saveToStorage({ ...get(), beginnerMode: enabled });
  },

  setAlarmEnabled: (enabled: boolean) => {
    set({ alarmEnabled: enabled });
    saveToStorage({ ...get(), alarmEnabled: enabled });
  },

  setAlarmTime: (time: string) => {
    set({ alarmTime: time });
    saveToStorage({ ...get(), alarmTime: time });
  },

  setAlarmDays: (days: number[]) => {
    set({ alarmDays: days });
    saveToStorage({ ...get(), alarmDays: days });
  },

  setAlarmSound: (sound: string) => {
    set({ alarmSound: sound });
    saveToStorage({ ...get(), alarmSound: sound });
  },

  setAlarmVibrate: (vibrate: boolean) => {
    set({ alarmVibrate: vibrate });
    saveToStorage({ ...get(), alarmVibrate: vibrate });
  },

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      set({
        voiceSpeed:
          typeof data.voiceSpeed === 'number' ? data.voiceSpeed : DEFAULT_SETTINGS.voiceSpeed,
        beginnerMode:
          typeof data.beginnerMode === 'boolean' ? data.beginnerMode : DEFAULT_SETTINGS.beginnerMode,
        alarmEnabled:
          typeof data.alarmEnabled === 'boolean' ? data.alarmEnabled : DEFAULT_SETTINGS.alarmEnabled,
        alarmTime:
          typeof data.alarmTime === 'string' ? data.alarmTime : DEFAULT_SETTINGS.alarmTime,
        alarmDays: Array.isArray(data.alarmDays) ? data.alarmDays : DEFAULT_SETTINGS.alarmDays,
        alarmSound:
          typeof data.alarmSound === 'string' ? data.alarmSound : DEFAULT_SETTINGS.alarmSound,
        alarmVibrate:
          typeof data.alarmVibrate === 'boolean' ? data.alarmVibrate : DEFAULT_SETTINGS.alarmVibrate,
      });
    } catch (error) {
      console.error('Failed to load settings from AsyncStorage:', error);
    }
  },
}));

export default useSettingsStore;
