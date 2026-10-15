import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
  joinedDate: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  loginWithSocial: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const STORAGE_KEY = 'yogalife_auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  loadUser: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user: UserProfile = JSON.parse(stored);
        set({ user, isLoggedIn: true });
      }
    } catch (err) {
      console.warn('Failed to load user auth state:', err);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    // Simulate network authentication latency
    await new Promise((r) => setTimeout(r, 600));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address.';
      set({ isLoading: false, error: err });
      return { success: false, error: err };
    }

    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      set({ isLoading: false, error: err });
      return { success: false, error: err };
    }

    // Generate derived user profile
    const derivedName = cleanEmail.split('@')[0];
    const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    const user: UserProfile = {
      id: `user_${Date.now()}`,
      name: cleanEmail === 'swayam@yogalife.com' ? 'Swayam Gulhane' : capitalizedName,
      email: cleanEmail,
      isGuest: false,
      joinedDate: new Date().toISOString(),
      experienceLevel: 'beginner',
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoggedIn: true, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: 'Failed to persist session.' });
      return { success: false, error: 'Failed to persist session.' };
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 700));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      const err = 'Please enter your name.';
      set({ isLoading: false, error: err });
      return { success: false, error: err };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = 'Please enter a valid email address.';
      set({ isLoading: false, error: err });
      return { success: false, error: err };
    }

    if (!password || password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      set({ isLoading: false, error: err });
      return { success: false, error: err };
    }

    const user: UserProfile = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      isGuest: false,
      joinedDate: new Date().toISOString(),
      experienceLevel: 'beginner',
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoggedIn: true, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: 'Failed to save account.' });
      return { success: false, error: 'Failed to save account.' };
    }
  },

  loginAsGuest: async () => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: 'Guest Yogi',
      email: 'guest@yogalife.local',
      isGuest: true,
      joinedDate: new Date().toISOString(),
      experienceLevel: 'beginner',
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
      set({ user: guestUser, isLoggedIn: true, isLoading: false, error: null });
    } catch (err) {
      console.warn('Failed to save guest user session:', err);
      set({ user: guestUser, isLoggedIn: true, isLoading: false, error: null });
    }
  },

  loginWithSocial: async (provider: 'google' | 'apple') => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));

    const user: UserProfile = {
      id: `${provider}_${Date.now()}`,
      name: provider === 'google' ? 'Google Yogi' : 'Apple Yogi',
      email: `user@${provider}.com`,
      isGuest: false,
      joinedDate: new Date().toISOString(),
      experienceLevel: 'beginner',
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoggedIn: true, isLoading: false, error: null });
    } catch (err) {
      console.warn('Failed to persist social session:', err);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ user: null, isLoggedIn: false, error: null });
    } catch (err) {
      console.warn('Failed to clear user auth state:', err);
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (err) {
      console.warn('Failed to update profile:', err);
    }
  },
}));

export default useAuthStore;
