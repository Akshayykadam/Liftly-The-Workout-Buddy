/**
 * Health Connect Context
 * Provides Health Connect state management for Android
 * Note: Step tracking is only available on Android via Health Connect
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as HealthConnectService from '@/services/healthConnect';
import type {
    HealthConnectStatus,
    HealthDashboardData,
    DailySteps,
    ExerciseSession,
    SleepSession,
    BodyMeasurements,
    PermissionStatus,
} from '@/types/healthTypes';

const HEALTH_DATA_STORAGE_KEY = 'health_connect_data';
const DEFAULT_STEP_GOAL = 10000;

interface HealthConnectContextValue {
    // Status
    isAndroid: boolean;
    healthConnectStatus: HealthConnectStatus;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    permissions: PermissionStatus[];

    // Data
    dashboardData: HealthDashboardData;
    stepGoal: number;
    stepProgress: number;

    // Actions
    initialize: () => Promise<boolean>;
    requestPermissions: () => Promise<void>;
    refreshData: () => Promise<void>;
    openSettings: () => Promise<void>;
    setStepGoal: (goal: number) => Promise<void>;
}

function getTodayKey(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export const [HealthConnectProvider, useHealthConnect] = createContextHook(() => {
    const isAndroidDevice = Platform.OS === 'android';
    const isWeb = Platform.OS === 'web';

    // State
    const [healthConnectStatus, setHealthConnectStatus] = useState<HealthConnectStatus>('sdk_unavailable');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<PermissionStatus[]>([]);
    const [stepGoal, setStepGoalState] = useState(DEFAULT_STEP_GOAL);

    const [dashboardData, setDashboardData] = useState<HealthDashboardData>({
        steps: null,
        heartRate: null,
        calories: null,
        exercise: null,
        sleep: null,
        body: null,
    });



    // Calculate step progress
    const stepProgress = dashboardData.steps
        ? Math.min((dashboardData.steps.today / stepGoal) * 100, 100)
        : 0;

    // ============ MOCK DATA FOR WEB DEMO ============

    const loadWebDemoData = () => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData: DailySteps[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            weeklyData.push({
                date,
                steps: Math.floor(Math.random() * 8000) + 4000, // Random 4000-12000 steps
                dayName: dayNames[date.getDay()],
            });
        }
        // Make today's steps higher
        weeklyData[6].steps = 8432;

        const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.steps, 0);

        setDashboardData({
            steps: {
                today: 8432,
                weeklyData,
                weeklyTotal,
                weeklyAverage: Math.round(weeklyTotal / 7),
            },
            heartRate: {
                current: 72,
                resting: 58,
                lastUpdated: new Date().toISOString(),
            },
            calories: {
                active: 420,
                basal: 1680,
                total: 2100,
            },
            exercise: {
                recentSessions: [
                    {
                        id: '1',
                        exerciseType: 'RUNNING',
                        title: 'Morning Run',
                        startTime: new Date(Date.now() - 3600000).toISOString(),
                        endTime: new Date().toISOString(),
                        durationMinutes: 32,
                        distanceMeters: 5200,
                        activeCalories: 320,
                    },
                    {
                        id: '2',
                        exerciseType: 'STRENGTH_TRAINING',
                        title: 'Gym Workout',
                        startTime: new Date(Date.now() - 86400000).toISOString(),
                        endTime: new Date(Date.now() - 86400000 + 2700000).toISOString(),
                        durationMinutes: 45,
                        activeCalories: 280,
                    },
                ],
                todayDurationMinutes: 32,
            },
            sleep: {
                lastSession: {
                    id: 'sleep-1',
                    startTime: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
                    endTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    durationMinutes: 452,
                    stages: [
                        { stage: 'LIGHT', startTime: '', endTime: '', durationMinutes: 180 },
                        { stage: 'DEEP', startTime: '', endTime: '', durationMinutes: 105 },
                        { stage: 'REM', startTime: '', endTime: '', durationMinutes: 130 },
                        { stage: 'AWAKE', startTime: '', endTime: '', durationMinutes: 37 },
                    ],
                },
            },
            body: {
                weight: { value: 72.5, time: new Date().toISOString() },
                height: { value: 175, time: new Date().toISOString() },
                bodyFatPercentage: { value: 18.5, time: new Date().toISOString() },
            },
        });

        setPermissions([
            { permission: 'Steps', granted: true },
            { permission: 'HeartRate', granted: true },
            { permission: 'ExerciseSession', granted: true },
        ]);
    };

    // ============ INITIALIZATION ============

    const initialize = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            // Load saved step goal
            const stored = await AsyncStorage.getItem(HEALTH_DATA_STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.stepGoal) {
                    setStepGoalState(data.stepGoal);
                }
            }

            // Web: Load demo data for UI preview
            if (isWeb) {
                loadWebDemoData();
                setHealthConnectStatus('available');
                setIsInitialized(true);
                setIsLoading(false);
                return true;
            }

            if (isAndroidDevice) {
                // Android: Initialize Health Connect
                const status = await HealthConnectService.getHealthConnectStatus();
                setHealthConnectStatus(status);

                if (status === 'available') {
                    const initialized = await HealthConnectService.initializeHealthConnect();
                    setIsInitialized(initialized);

                    if (initialized) {
                        // Refresh data after initialization
                        await refreshData();
                    }

                    return initialized;
                } else {
                    setError(getStatusMessage(status));
                    return false;
                }
            } else {
                // iOS/Other platforms: Step tracking not available
                setError('Step tracking is only available on Android with Health Connect');
                setIsInitialized(false);
                return false;
            }
        } catch (err) {
            console.error('Health initialization error:', err);
            setError('Failed to initialize health services');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isAndroidDevice, isWeb]);

    // ============ PERMISSIONS ============

    const requestPermissions = useCallback(async () => {
        if (!isAndroidDevice) return;

        try {
            // Ensure Health Connect is initialized before requesting permissions
            const isReady = await HealthConnectService.initializeHealthConnect();
            if (!isReady) {
                setError('Failed to initialize Health Connect. Please try again.');
                return;
            }

            const granted = await HealthConnectService.requestHealthPermissions();
            setPermissions(granted);

            if (granted.length > 0) {
                // Refresh data after permissions granted
                await refreshData();
            }
        } catch (err) {
            console.error('Permission request error:', err);
            setError('Failed to request permissions');
        }
    }, [isAndroidDevice]);

    // ============ DATA REFRESH ============

    const refreshData = useCallback(async () => {
        if (isAndroidDevice) {
            await refreshAndroidData();
        }
        // Non-Android platforms don't have step data refresh
    }, [isAndroidDevice]);

    const refreshAndroidData = async () => {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        try {
            // Fetch all data in parallel
            const [
                todaySteps,
                weeklySteps,
                exerciseSessions,
                latestHeartRate,
                restingHeartRate,
                calories,
                bodyMeasurements,
                lastNightSleep,
            ] = await Promise.all([
                HealthConnectService.getTodaySteps(),
                HealthConnectService.getWeeklySteps(),
                HealthConnectService.getExerciseSessions(weekAgo, now),
                HealthConnectService.getLatestHeartRate(),
                HealthConnectService.getRestingHeartRate(),
                HealthConnectService.getTodayCalories(),
                HealthConnectService.getBodyMeasurements(),
                HealthConnectService.getLastNightSleep(),
            ]);

            // Calculate weekly totals
            const weeklyTotal = weeklySteps.reduce((sum, d) => sum + d.steps, 0);
            const weeklyAverage = Math.round(weeklyTotal / 7);

            // Calculate exercise duration for today
            const todayExerciseSessions = exerciseSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate >= today;
            });
            const todayDurationMinutes = todayExerciseSessions.reduce(
                (sum, s) => sum + s.durationMinutes,
                0
            );

            setDashboardData({
                steps: {
                    today: todaySteps,
                    weeklyData: weeklySteps,
                    weeklyTotal,
                    weeklyAverage,
                },
                heartRate: latestHeartRate || restingHeartRate
                    ? {
                        current: latestHeartRate ?? undefined,
                        resting: restingHeartRate?.beatsPerMinute,
                        lastUpdated: restingHeartRate?.time,
                    }
                    : null,
                calories: calories
                    ? {
                        active: calories.activeCalories,
                        basal: calories.basalCalories,
                        total: calories.totalCalories,
                    }
                    : null,
                exercise: {
                    recentSessions: exerciseSessions.slice(0, 5), // Last 5 sessions
                    todayDurationMinutes,
                },
                sleep: lastNightSleep
                    ? {
                        lastSession: lastNightSleep,
                    }
                    : null,
                body: Object.keys(bodyMeasurements).length > 0 ? bodyMeasurements : null,
            });
        } catch (err) {
            console.error('Error refreshing Android data:', err);
        }
    };



    // ============ SETTINGS ============

    const openSettings = useCallback(async () => {
        if (isAndroidDevice) {
            await HealthConnectService.openSettings();
        }
    }, [isAndroidDevice]);

    const setStepGoal = useCallback(async (goal: number) => {
        setStepGoalState(goal);

        try {
            const stored = await AsyncStorage.getItem(HEALTH_DATA_STORAGE_KEY);
            const data = stored ? JSON.parse(stored) : {};
            data.stepGoal = goal;
            await AsyncStorage.setItem(HEALTH_DATA_STORAGE_KEY, JSON.stringify(data));
        } catch {
            // Failed to save step goal
        }
    }, []);

    // ============ LIFECYCLE ============

    // Initialize on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isInitialized) {
                // Refresh data when app comes to foreground
                await refreshData();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [isInitialized, refreshData]);

    return {
        // Status
        isAndroid: isAndroidDevice,
        healthConnectStatus,
        isInitialized,
        isLoading,
        error,
        permissions,

        // Data
        dashboardData,
        stepGoal,
        stepProgress,

        // Actions
        initialize,
        requestPermissions,
        refreshData,
        openSettings,
        setStepGoal,
    };
});

// ============ HELPERS ============

function getStatusMessage(status: HealthConnectStatus): string {
    switch (status) {
        case 'not_installed':
            return 'Health Connect app needs to be installed from the Play Store';
        case 'not_supported':
            return 'Health Connect is not supported on this device';
        case 'sdk_unavailable':
            return 'Health Connect SDK is not available';
        default:
            return 'Unknown error';
    }
}
