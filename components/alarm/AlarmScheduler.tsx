import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldPresentAlert: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the OS
 */
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('yoga-reminders', {
        name: 'Yoga Practice Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2D5016',
        sound: 'bell.wav',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Failed to request notification permissions:', error);
    return false;
  }
}

/**
 * Check if notification permissions are currently granted
 */
export async function checkPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedule repeating weekly yoga reminders for selected days at a given time
 * @param time Time string in "HH:mm" (24-hour format)
 * @param days Array of day indices: 0 = Sun, 1 = Mon, ..., 6 = Sat (or 1-7: 1=Sun)
 * @param sound Sound file identifier
 */
export async function scheduleYogaReminder(
  time: string,
  days: number[],
  sound: string = 'bell'
): Promise<string[]> {
  if (Platform.OS === 'web') return [];

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('Notification permissions not granted');
    return [];
  }

  // First cancel all previous practice reminders
  await cancelAllReminders();

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10) || 7;
  const minute = parseInt(minuteStr, 10) || 0;

  const scheduledIds: string[] = [];

  for (const day of days) {
    // Convert to Expo 1-7 format (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
    let weekday: number;
    if (day >= 0 && day <= 6) {
      weekday = day + 1; // 0->1 (Sun), 1->2 (Mon), etc.
    } else if (day >= 1 && day <= 7) {
      weekday = day;
    } else {
      continue;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧘 Time for Yoga | योग का समय',
          body: 'Reconnect with your breath and body today. 10 minutes makes all the difference!',
          data: { screen: 'practice', url: '/(tabs)/practice' },
          sound: sound && sound !== 'none' ? `${sound}.wav` : true,
          channelId: 'yoga-reminders',
        } as any,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });
      scheduledIds.push(id);
    } catch (err) {
      // Fallback for triggers that prefer simple repeats format
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🧘 Time for Yoga | योग का समय',
            body: 'Reconnect with your breath and body today.',
            data: { screen: 'practice' },
            sound: true,
          },
          trigger: {
            weekday,
            hour,
            minute,
            repeats: true,
          } as any,
        });
        scheduledIds.push(id);
      } catch (fallbackError) {
        console.warn(`Failed to schedule reminder for day ${weekday}:`, fallbackError);
      }
    }
  }

  return scheduledIds;
}

/**
 * Cancel all scheduled reminders
 */
export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Failed to cancel reminders:', error);
  }
}

/**
 * Retrieve all currently scheduled notifications
 */
export async function getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  if (Platform.OS === 'web') return [];
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch {
    return [];
  }
}
