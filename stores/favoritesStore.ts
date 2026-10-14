import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoritesState {
  favorites: string[]; // pose IDs
  toggleFavorite: (poseId: string) => void;
  isFavorite: (poseId: string) => boolean;
  loadFavorites: () => Promise<void>;
}

const STORAGE_KEY = 'yogalife_favorites';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  toggleFavorite: (poseId: string) => {
    if (!poseId) return;

    const current = get().favorites;
    const exists = current.includes(poseId);
    const updated = exists ? current.filter((id) => id !== poseId) : [...current, poseId];

    set({ favorites: updated });

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((error) => {
      console.error('Failed to save favorites to AsyncStorage:', error);
    });
  },

  isFavorite: (poseId: string): boolean => {
    return get().favorites.includes(poseId);
  },

  loadFavorites: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          set({ favorites: parsed });
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from AsyncStorage:', error);
    }
  },
}));

export default useFavoritesStore;
