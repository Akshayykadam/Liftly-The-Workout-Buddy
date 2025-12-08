import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface ReminderSettings {
    enabled: boolean;
    days: number[];  // 0=Sunday, 1=Monday...6=Saturday
    hour: number;    // 0-23
    minute: number;  // 0-59
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
    enabled: false,
    days: [1, 2, 3, 4, 5, 6], // Mon-Sat by default
    hour: 8,
    minute: 0,
};

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    // Android requires a notification channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('workout-reminders', {
            name: 'Workout Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#CCFF00',
        });
    }

    return true;
}

/**
 * Schedule workout reminders for selected days
 */
export async function scheduleWorkoutReminders(settings: ReminderSettings): Promise<void> {
    // First cancel all existing reminders
    await cancelAllReminders();

    if (!settings.enabled || settings.days.length === 0) {
        return;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        return;
    }

    // Schedule a notification for each selected day
    for (const day of settings.days) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Time to Workout! 💪",
                body: "Your workout is waiting. Let's crush it today!",
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: day === 0 ? 1 : day + 1, // Expo uses 1=Sunday, 2=Monday, etc.
                hour: settings.hour,
                minute: settings.minute,
                channelId: 'workout-reminders',
            },
        });
    }
}

/**
 * Cancel all scheduled reminders
 */
export async function cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledReminders() {
    return await Notifications.getAllScheduledNotificationsAsync();
}
