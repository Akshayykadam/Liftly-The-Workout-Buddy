/**
 * Health Connect Context
 * Provides Health Connect state management for Android
 * Note: Step tracking is only available on Android via Health Connect
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as HealthConnectService from '@/services/healthConnect';
import { useUser } from '@/contexts/UserContext';
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


    const { profile, updateProfile, logWeight } = useUser();

    // Refs to avoid stale closures in sync logic
    const profileRef = useRef(profile);
    const updateProfileRef = useRef(updateProfile);
    const logWeightRef = useRef(logWeight);

    useEffect(() => {
        profileRef.current = profile;
        updateProfileRef.current = updateProfile;
        logWeightRef.current = logWeight;
    }, [profile, updateProfile, logWeight]);

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
                history: [
                    { date: new Date(Date.now() - 6 * 86400000), min: 52, max: 145, avg: 68 },
                    { date: new Date(Date.now() - 5 * 86400000), min: 54, max: 138, avg: 71 },
                    { date: new Date(Date.now() - 4 * 86400000), min: 53, max: 152, avg: 74 },
                    { date: new Date(Date.now() - 3 * 86400000), min: 51, max: 144, avg: 69 },
                    { date: new Date(Date.now() - 2 * 86400000), min: 55, max: 156, avg: 75 },
                    { date: new Date(Date.now() - 1 * 86400000), min: 50, max: 148, avg: 72 },
                    { date: new Date(), min: 56, max: 142, avg: 70 },
                ],
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
                        // Check for existing permissions
                        const granted = await HealthConnectService.getGrantedPermissions();
                        setPermissions(granted);
                        console.log('[HealthConnect] Initialized with permissions:', granted.length);

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
                heartRateData,
                restingHeartRate,
                calories,
                bodyMeasurements,
                lastNightSleep,
            ] = await Promise.all([
                HealthConnectService.getTodaySteps(),
                HealthConnectService.getWeeklySteps(),
                HealthConnectService.getExerciseSessions(weekAgo, now),
                // Fetch heart rate (last 7 days for history)
                HealthConnectService.getHeartRate(weekAgo, now),
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

            // Sync body measurements to User Profile if available
            if (Object.keys(bodyMeasurements).length > 0) {
                console.log('[HealthConnect] Found body measurements to sync:', bodyMeasurements);

                const updates: any = {};
                let shouldUpdate = false;

                // Use Refs to access latest user data without closure staleness
                const currentProfile = profileRef.current;
                const updateProfileFn = updateProfileRef.current;
                const logWeightFn = logWeightRef.current;

                if (!currentProfile || !updateProfileFn || !logWeightFn) {
                    console.log('[HealthConnect] Profile or update functions not ready, skipping sync');
                } else {
                    console.log('[HealthConnect] Current profile weight/height:', currentProfile.weight, currentProfile.height);

                    // Sync Weight
                    if (bodyMeasurements.weight) {
                        const hcWeightKg = bodyMeasurements.weight.value;
                        const targetUnit = currentProfile.weightUnit; // 'kg' or 'lbs'
                        let finalWeight = hcWeightKg;

                        if (targetUnit === 'lbs') {
                            finalWeight = hcWeightKg * 2.20462262;
                        }

                        // Round to 1 decimal place
                        finalWeight = Math.round(finalWeight * 10) / 10;
                        console.log(`[HealthConnect] Weight sync: HC=${hcWeightKg}kg -> Final=${finalWeight}${targetUnit} (Current=${currentProfile.weight})`);

                        if (Math.abs(currentProfile.weight - finalWeight) > 0.1) {
                            // Use logWeight to ensure it updates history and charts, not just profile
                            console.log('[HealthConnect] Weight update scheduled (via logWeight)');
                            logWeightFn(finalWeight);
                        }
                    }

                    // Sync Height
                    if (bodyMeasurements.height) {
                        const hcHeightCm = bodyMeasurements.height.value;
                        const targetUnit = currentProfile.heightUnit; // 'cm' or 'ft'
                        let finalHeight = hcHeightCm;

                        if (targetUnit === 'ft') {
                            finalHeight = hcHeightCm * 0.0328084;
                        }

                        const precision = targetUnit === 'ft' ? 100 : 10;
                        finalHeight = Math.round(finalHeight * precision) / precision;
                        console.log(`[HealthConnect] Height sync: HC=${hcHeightCm}cm -> Final=${finalHeight}${targetUnit} (Current=${currentProfile.height})`);

                        if (Math.abs(currentProfile.height - finalHeight) > 0.05) {
                            updates.height = finalHeight;
                            shouldUpdate = true;
                            console.log('[HealthConnect] Height update scheduled');
                        }
                    }

                    if (shouldUpdate) {
                        console.log('[HealthConnect] Applying profile updates (Height/Other):', updates);
                        updateProfileFn(updates);
                    } else {
                        console.log('[HealthConnect] No updates required (values match)');
                    }
                }
            } else {
                console.log('[HealthConnect] No body measurements found in Health Connect');
            }

            setDashboardData({
                steps: {
                    today: todaySteps,
                    weeklyData: weeklySteps,
                    weeklyTotal,
                    weeklyAverage,
                },
                heartRate: heartRateData || restingHeartRate
                    ? {
                        current: heartRateData?.samples?.[0]?.beatsPerMinute, // Most recent sample
                        resting: restingHeartRate?.beatsPerMinute,
                        history: heartRateData?.history,
                        lastUpdated: heartRateData?.samples?.[0]?.time || restingHeartRate?.time,
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

    // Poll for updates when app is active
    useEffect(() => {
        if (!isAndroidDevice || !isInitialized) return;

        const interval = setInterval(() => {
            // Only refresh if app is active
            if (AppState.currentState === 'active') {
                refreshData();
            }
        }, 15000); // 15 seconds

        return () => clearInterval(interval);
    }, [isAndroidDevice, isInitialized, refreshData]);

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
