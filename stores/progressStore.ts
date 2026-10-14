import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PracticeEntry {
  date: string; // ISO date
  poseId: string;
  durationSeconds: number;
  completed: boolean;
}

export interface ProgressState {
  history: PracticeEntry[];
  currentStreak: number;
  longestStreak: number;
  totalPracticeTime: number; // seconds
  posesCompleted: Set<string>;
  addPractice: (entry: Omit<PracticeEntry, 'date'>) => void;
  loadProgress: () => Promise<void>;
  getWeeklyStats: () => { day: string; minutes: number }[];
  getMonthlyStats: () => { week: string; minutes: number }[];
  getTodayPracticeTime: () => number;
}

const STORAGE_KEY = 'yogalife_progress';

/**
 * Returns YYYY-MM-DD representation in local timezone
 */
const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates current streak and longest streak from historical entries
 */
const calculateStreaks = (
  history: PracticeEntry[]
): { currentStreak: number; longestStreak: number } => {
  const practiceDaysSet = new Set<string>();

  for (const entry of history) {
    if (entry.completed || entry.durationSeconds > 0) {
      practiceDaysSet.add(getLocalDateKey(new Date(entry.date)));
    }
  }

  if (practiceDaysSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const now = new Date();
  const todayKey = getLocalDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  // Check if today or yesterday was active
  let currentStreak = 0;
  let checkDate: Date | null = null;

  if (practiceDaysSet.has(todayKey)) {
    checkDate = new Date(now);
  } else if (practiceDaysSet.has(yesterdayKey)) {
    checkDate = new Date(yesterday);
  }

  if (checkDate) {
    while (practiceDaysSet.has(getLocalDateKey(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate longest streak historically
  const sortedDays = Array.from(practiceDaysSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dayStr of sortedDays) {
    const [y, m, d] = dayStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const diffMs = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  history: [],
  currentStreak: 0,
  longestStreak: 0,
  totalPracticeTime: 0,
  posesCompleted: new Set<string>(),

  addPractice: (entry: Omit<PracticeEntry, 'date'>) => {
    const newEntry: PracticeEntry = {
      ...entry,
      date: new Date().toISOString(),
    };

    const currentHistory = get().history;
    const updatedHistory = [...currentHistory, newEntry];

    const updatedPoses = new Set(get().posesCompleted);
    if (newEntry.completed && newEntry.poseId) {
      updatedPoses.add(newEntry.poseId);
    }

    const updatedTotalTime = get().totalPracticeTime + (newEntry.durationSeconds || 0);
    const { currentStreak, longestStreak } = calculateStreaks(updatedHistory);

    set({
      history: updatedHistory,
      posesCompleted: updatedPoses,
      totalPracticeTime: updatedTotalTime,
      currentStreak,
      longestStreak,
    });

    // Auto-save to AsyncStorage
    const stateToSave = {
      history: updatedHistory,
      currentStreak,
      longestStreak,
      totalPracticeTime: updatedTotalTime,
      posesCompleted: Array.from(updatedPoses),
    };

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave)).catch((error) => {
      console.error('Failed to save progress to AsyncStorage:', error);
    });
  },

  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      const history: PracticeEntry[] = Array.isArray(data.history) ? data.history : [];
      const posesCompleted = new Set<string>(
        Array.isArray(data.posesCompleted) ? data.posesCompleted : []
      );
      const totalPracticeTime =
        typeof data.totalPracticeTime === 'number'
          ? data.totalPracticeTime
          : history.reduce((sum, h) => sum + (h.durationSeconds || 0), 0);

      const { currentStreak, longestStreak } = calculateStreaks(history);

      set({
        history,
        posesCompleted,
        totalPracticeTime,
        currentStreak,
        longestStreak: Math.max(longestStreak, data.longestStreak || 0),
      });
    } catch (error) {
      console.error('Failed to load progress from AsyncStorage:', error);
    }
  },

  getWeeklyStats: () => {
    const history = get().history;
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const stats: { day: string; minutes: number }[] = [];

    // Create 7 day buckets ending with today
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      const dateKey = getLocalDateKey(targetDate);
      const dayLabel = dayNames[targetDate.getDay()];

      let secondsOnDay = 0;
      for (const entry of history) {
        if (getLocalDateKey(new Date(entry.date)) === dateKey) {
          secondsOnDay += entry.durationSeconds || 0;
        }
      }

      stats.push({
        day: dayLabel,
        minutes: Math.round(secondsOnDay / 60),
      });
    }

    return stats;
  },

  getMonthlyStats: () => {
    const history = get().history;
    const now = new Date();
    const stats: { week: string; minutes: number }[] = [];

    // Create 4 weekly buckets, ending with this week (last 28 days)
    for (let w = 3; w >= 0; w--) {
      const weekLabel = `Week ${4 - w}`;
      const endDaysAgo = w * 7;
      const startDaysAgo = (w + 1) * 7;

      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - endDaysAgo);
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - startDaysAgo);
      startDate.setHours(0, 0, 0, 0);

      let secondsInWeek = 0;
      for (const entry of history) {
        const entryTime = new Date(entry.date).getTime();
        if (entryTime >= startDate.getTime() && entryTime <= endDate.getTime()) {
          secondsInWeek += entry.durationSeconds || 0;
        }
      }

      stats.push({
        week: weekLabel,
        minutes: Math.round(secondsInWeek / 60),
      });
    }

    return stats;
  },

  getTodayPracticeTime: () => {
    const history = get().history;
    const todayKey = getLocalDateKey(new Date());

    let todaySeconds = 0;
    for (const entry of history) {
      if (getLocalDateKey(new Date(entry.date)) === todayKey) {
        todaySeconds += entry.durationSeconds || 0;
      }
    }

    return todaySeconds;
  },
}));

export default useProgressStore;
