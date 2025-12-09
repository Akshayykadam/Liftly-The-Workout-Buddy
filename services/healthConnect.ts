/**
 * Health Connect Service Layer
 * Android-only Health Connect integration using react-native-health-connect
 */

import { Platform } from 'react-native';
import {
    initialize,
    requestPermission,
    readRecords,
    getSdkStatus,
    openHealthConnectSettings,
    openHealthConnectDataManagement,
    SdkAvailabilityStatus,
} from 'react-native-health-connect';
import type {
    HealthConnectStatus,
    StepsData,
    DailySteps,
    ExerciseSession,
    ExerciseType,
    HeartRateData,
    RestingHeartRateData,
    CaloriesData,
    BodyMeasurements,
    SleepSession,
    SleepStage,
    SleepStageType,
    PermissionStatus,
    HealthPermission,
} from '@/types/healthTypes';

// Exercise type mapping from Health Connect numeric types
const EXERCISE_TYPE_MAP: Record<number, ExerciseType> = {
    56: 'WALKING',
    79: 'RUNNING',
    8: 'BIKING',
    80: 'STRENGTH_TRAINING',
    83: 'YOGA',
    47: 'PILATES',
    35: 'HIGH_INTENSITY_INTERVAL_TRAINING',
    37: 'HIKING',
    74: 'SWIMMING_POOL',
    75: 'SWIMMING_OPEN_WATER',
    14: 'DANCING',
    0: 'OTHER_WORKOUT',
};

// Sleep stage mapping from Health Connect numeric types
const SLEEP_STAGE_MAP: Record<number, SleepStageType> = {
    0: 'UNKNOWN',
    1: 'AWAKE',
    2: 'SLEEPING',
    3: 'OUT_OF_BED',
    4: 'LIGHT',
    5: 'DEEP',
    6: 'REM',
};

/**
 * Check if we're running on Android
 */
export const isAndroid = (): boolean => Platform.OS === 'android';

/**
 * Get the Health Connect SDK status
 */
export const getHealthConnectStatus = async (): Promise<HealthConnectStatus> => {
    if (!isAndroid()) {
        return 'not_supported';
    }

    try {
        const status = await getSdkStatus();

        switch (status) {
            case SdkAvailabilityStatus.SDK_AVAILABLE:
                return 'available';
            case SdkAvailabilityStatus.SDK_UNAVAILABLE:
                return 'not_supported';
            case SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED:
                return 'not_installed';
            default:
                return 'sdk_unavailable';
        }
    } catch (error) {
        console.error('Error checking Health Connect status:', error);
        return 'sdk_unavailable';
    }
};

/**
 * Initialize Health Connect
 */
export const initializeHealthConnect = async (): Promise<boolean> => {
    if (!isAndroid()) {
        return false;
    }

    try {
        const result = await initialize();
        return result;
    } catch (error) {
        console.error('Error initializing Health Connect:', error);
        return false;
    }
};

/**
 * Request Health Connect permissions
 */
export const requestHealthPermissions = async (): Promise<PermissionStatus[]> => {
    if (!isAndroid()) {
        return [];
    }

    try {
        const permissions = [
            { accessType: 'read' as const, recordType: 'Steps' as const },
            { accessType: 'write' as const, recordType: 'Steps' as const },
            { accessType: 'read' as const, recordType: 'HeartRate' as const },
            { accessType: 'read' as const, recordType: 'RestingHeartRate' as const },
            { accessType: 'read' as const, recordType: 'ExerciseSession' as const },
            { accessType: 'read' as const, recordType: 'ActiveCaloriesBurned' as const },
            { accessType: 'read' as const, recordType: 'BasalMetabolicRate' as const },
            { accessType: 'read' as const, recordType: 'TotalCaloriesBurned' as const },
            { accessType: 'read' as const, recordType: 'Weight' as const },
            { accessType: 'read' as const, recordType: 'Height' as const },
            { accessType: 'read' as const, recordType: 'BodyFat' as const },
            { accessType: 'read' as const, recordType: 'SleepSession' as const },
        ];

        const granted = await requestPermission(permissions);

        // Map the granted permissions to our format
        const permissionMap: Record<string, HealthPermission> = {
            'Steps': 'Steps',
            'HeartRate': 'HeartRate',
            'RestingHeartRate': 'RestingHeartRate',
            'ExerciseSession': 'ExerciseSession',
            'ActiveCaloriesBurned': 'ActiveCaloriesBurned',
            'BasalMetabolicRate': 'BasalMetabolicRate',
            'TotalCaloriesBurned': 'TotalCaloriesBurned',
            'Weight': 'Weight',
            'Height': 'Height',
            'BodyFat': 'BodyFat',
            'SleepSession': 'SleepSession',
        };

        const result: PermissionStatus[] = [];

        for (const perm of granted) {
            const mappedPerm = permissionMap[perm.recordType];
            if (mappedPerm && !result.find(r => r.permission === mappedPerm)) {
                result.push({
                    permission: mappedPerm,
                    granted: true,
                });
            }
        }

        return result;
    } catch (error) {
        console.error('Error requesting Health Connect permissions:', error);
        return [];
    }
};

/**
 * Get currently granted permissions
 */
export const getGrantedPermissions = async (): Promise<PermissionStatus[]> => {
    if (!isAndroid()) return [];

    try {
        const { getGrantedPermissions } = await import('react-native-health-connect');
        const granted = await getGrantedPermissions();

        // Map the granted permissions to our format
        const permissionMap: Record<string, HealthPermission> = {
            'Steps': 'Steps',
            'HeartRate': 'HeartRate',
            'RestingHeartRate': 'RestingHeartRate',
            'ExerciseSession': 'ExerciseSession',
            'ActiveCaloriesBurned': 'ActiveCaloriesBurned',
            'BasalMetabolicRate': 'BasalMetabolicRate',
            'TotalCaloriesBurned': 'TotalCaloriesBurned',
            'Weight': 'Weight',
            'Height': 'Height',
            'BodyFat': 'BodyFat',
            'SleepSession': 'SleepSession',
        };

        const result: PermissionStatus[] = [];

        for (const perm of granted) {
            const mappedPerm = permissionMap[perm.recordType];
            if (mappedPerm && !result.find(r => r.permission === mappedPerm)) {
                result.push({
                    permission: mappedPerm,
                    granted: true,
                });
            }
        }

        return result;
    } catch (error) {
        console.error('Error getting granted permissions:', error);
        return [];
    }
};

/**
 * Open Health Connect settings
 */
export const openSettings = async (): Promise<void> => {
    if (!isAndroid()) return;

    try {
        await openHealthConnectSettings();
    } catch (error) {
        console.error('Error opening Health Connect settings:', error);
    }
};

/**
 * Open Health Connect data management
 */
export const openDataManagement = async (): Promise<void> => {
    if (!isAndroid()) return;

    try {
        await openHealthConnectDataManagement();
    } catch (error) {
        console.error('Error opening Health Connect data management:', error);
    }
};

// ============ DATA FETCHING FUNCTIONS ============

/**
 * Get today's step count
 */
export const getTodaySteps = async (): Promise<number> => {
    if (!isAndroid()) return 0;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();

        const { records } = await readRecords('Steps', {
            timeRangeFilter: {
                operator: 'between',
                startTime: today.toISOString(),
                endTime: now.toISOString(),
            },
        });

        // Sum up all step records for today
        const totalSteps = records.reduce((sum, record: any) => sum + (record.count || 0), 0);
        return totalSteps;
    } catch (error) {
        console.error('Error fetching today steps:', error);
        return 0;
    }
};

/**
 * Get steps for a date range
 */
export const getStepsForRange = async (startDate: Date, endDate: Date): Promise<StepsData[]> => {
    if (!isAndroid()) return [];

    try {
        const { records } = await readRecords('Steps', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            },
        });

        return records.map((record: any) => ({
            count: record.count || 0,
            startTime: record.startTime,
            endTime: record.endTime,
        }));
    } catch (error) {
        console.error('Error fetching steps for range:', error);
        return [];
    }
};

/**
 * Get weekly step data (last 7 days)
 */
export const getWeeklySteps = async (): Promise<DailySteps[]> => {
    if (!isAndroid()) return [];

    const days: DailySteps[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        try {
            const { records } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: date.toISOString(),
                    endTime: endDate.toISOString(),
                },
            });

            const totalSteps = records.reduce((sum, record: any) => sum + (record.count || 0), 0);

            days.push({
                date,
                steps: totalSteps,
                dayName: dayNames[date.getDay()],
            });
        } catch {
            days.push({
                date,
                steps: 0,
                dayName: dayNames[date.getDay()],
            });
        }
    }

    return days;
};

/**
 * Get exercise sessions for a date range
 */
export const getExerciseSessions = async (
    startDate: Date,
    endDate: Date
): Promise<ExerciseSession[]> => {
    if (!isAndroid()) return [];

    try {
        const { records } = await readRecords('ExerciseSession', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            },
        });

        return records.map((record: any) => {
            const start = new Date(record.startTime);
            const end = new Date(record.endTime);
            const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

            return {
                id: record.metadata?.id || `${record.startTime}-${record.exerciseType}`,
                exerciseType: EXERCISE_TYPE_MAP[record.exerciseType] || 'OTHER_WORKOUT',
                title: record.title,
                startTime: record.startTime,
                endTime: record.endTime,
                durationMinutes,
                notes: record.notes,
            };
        });
    } catch (error) {
        console.error('Error fetching exercise sessions:', error);
        return [];
    }
};

/**
 * Get heart rate data for a date range
 */
export const getHeartRate = async (
    startDate: Date,
    endDate: Date
): Promise<HeartRateData | null> => {
    if (!isAndroid()) return null;

    try {
        const { records } = await readRecords('HeartRate', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            },
        });

        if (records.length === 0) return null;

        const samples = records.flatMap((record: any) =>
            (record.samples || []).map((sample: any) => ({
                beatsPerMinute: sample.beatsPerMinute,
                time: sample.time,
            }))
        );

        if (samples.length === 0) return null;

        const bpmValues = samples.map(s => s.beatsPerMinute);
        const averageBpm = Math.round(bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length);
        const minBpm = Math.min(...bpmValues);
        const maxBpm = Math.max(...bpmValues);

        return {
            samples,
            averageBpm,
            minBpm,
            maxBpm,
        };
    } catch (error) {
        console.error('Error fetching heart rate:', error);
        return null;
    }
};

/**
 * Get the most recent heart rate reading
 */
export const getLatestHeartRate = async (): Promise<number | null> => {
    if (!isAndroid()) return null;

    try {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const { records } = await readRecords('HeartRate', {
            timeRangeFilter: {
                operator: 'between',
                startTime: dayAgo.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (records.length === 0) return null;

        // Get the most recent sample
        const allSamples = records.flatMap((record: any) => record.samples || []);
        if (allSamples.length === 0) return null;

        // Sort by time descending and get the most recent
        allSamples.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
        return allSamples[0]?.beatsPerMinute || null;
    } catch (error) {
        console.error('Error fetching latest heart rate:', error);
        return null;
    }
};

/**
 * Get resting heart rate
 */
export const getRestingHeartRate = async (): Promise<RestingHeartRateData | null> => {
    if (!isAndroid()) return null;

    try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const { records } = await readRecords('RestingHeartRate', {
            timeRangeFilter: {
                operator: 'between',
                startTime: weekAgo.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (records.length === 0) return null;

        // Get the most recent resting heart rate
        const sorted = [...records].sort(
            (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        return {
            beatsPerMinute: sorted[0].beatsPerMinute,
            time: sorted[0].time,
        };
    } catch (error) {
        console.error('Error fetching resting heart rate:', error);
        return null;
    }
};

/**
 * Get calories data for today
 */
export const getTodayCalories = async (): Promise<CaloriesData | null> => {
    if (!isAndroid()) return null;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();

        // Fetch active calories
        const { records: activeRecords } = await readRecords('ActiveCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: today.toISOString(),
                endTime: now.toISOString(),
            },
        });

        const activeCalories = activeRecords.reduce((sum, record: any) => {
            return sum + (record.energy?.inKilocalories || 0);
        }, 0);

        // Fetch basal metabolic rate (will estimate if not available)
        const { records: basalRecords } = await readRecords('BasalMetabolicRate', {
            timeRangeFilter: {
                operator: 'between',
                startTime: today.toISOString(),
                endTime: now.toISOString(),
            },
        });

        let basalCalories = 0;
        if (basalRecords.length > 0) {
            // Get the latest BMR and calculate based on time of day
            const latestBMR = basalRecords[basalRecords.length - 1] as any;
            const bmrPerDay = latestBMR.basalMetabolicRate?.inKilocaloriesPerDay || 0;
            const hoursElapsed = (now.getTime() - today.getTime()) / (1000 * 60 * 60);
            basalCalories = Math.round((bmrPerDay / 24) * hoursElapsed);
        }

        // Fetch total calories if available
        const { records: totalRecords } = await readRecords('TotalCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: today.toISOString(),
                endTime: now.toISOString(),
            },
        });

        let totalCalories = activeCalories + basalCalories;
        if (totalRecords.length > 0) {
            totalCalories = totalRecords.reduce((sum, record: any) => {
                return sum + (record.energy?.inKilocalories || 0);
            }, 0);
        }

        return {
            activeCalories: Math.round(activeCalories),
            basalCalories: Math.round(basalCalories),
            totalCalories: Math.round(totalCalories),
            startTime: today.toISOString(),
            endTime: now.toISOString(),
        };
    } catch (error) {
        console.error('Error fetching calories:', error);
        return null;
    }
};

/**
 * Get body measurements (weight, height, body fat)
 */
export const getBodyMeasurements = async (): Promise<BodyMeasurements> => {
    if (!isAndroid()) return {};

    const measurements: BodyMeasurements = {};
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
        // Weight
        const { records: weightRecords } = await readRecords('Weight', {
            timeRangeFilter: {
                operator: 'between',
                startTime: monthAgo.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (weightRecords.length > 0) {
            const sorted = [...weightRecords].sort(
                (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
            );
            measurements.weight = {
                value: sorted[0].weight?.inKilograms || 0,
                time: sorted[0].time,
            };
        }

        // Height
        const { records: heightRecords } = await readRecords('Height', {
            timeRangeFilter: {
                operator: 'between',
                startTime: monthAgo.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (heightRecords.length > 0) {
            const sorted = [...heightRecords].sort(
                (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
            );
            measurements.height = {
                value: (sorted[0].height?.inMeters || 0) * 100, // Convert to cm
                time: sorted[0].time,
            };
        }

        // Body Fat
        const { records: bodyFatRecords } = await readRecords('BodyFat', {
            timeRangeFilter: {
                operator: 'between',
                startTime: monthAgo.toISOString(),
                endTime: now.toISOString(),
            },
        });

        if (bodyFatRecords.length > 0) {
            const sorted = [...bodyFatRecords].sort(
                (a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()
            );
            measurements.bodyFatPercentage = {
                value: sorted[0].percentage || 0,
                time: sorted[0].time,
            };
        }
    } catch (error) {
        console.error('Error fetching body measurements:', error);
    }

    return measurements;
};

/**
 * Get sleep sessions
 */
export const getSleepSessions = async (
    startDate: Date,
    endDate: Date
): Promise<SleepSession[]> => {
    if (!isAndroid()) return [];

    try {
        const { records } = await readRecords('SleepSession', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            },
        });

        return records.map((record: any) => {
            const start = new Date(record.startTime);
            const end = new Date(record.endTime);
            const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

            const stages: SleepStage[] = (record.stages || []).map((stage: any) => {
                const stageStart = new Date(stage.startTime);
                const stageEnd = new Date(stage.endTime);
                return {
                    stage: SLEEP_STAGE_MAP[stage.stage] || 'UNKNOWN',
                    startTime: stage.startTime,
                    endTime: stage.endTime,
                    durationMinutes: Math.round((stageEnd.getTime() - stageStart.getTime()) / 60000),
                };
            });

            return {
                id: record.metadata?.id || record.startTime,
                startTime: record.startTime,
                endTime: record.endTime,
                durationMinutes,
                stages,
                title: record.title,
            };
        });
    } catch (error) {
        console.error('Error fetching sleep sessions:', error);
        return [];
    }
};

/**
 * Get last night's sleep
 */
export const getLastNightSleep = async (): Promise<SleepSession | null> => {
    if (!isAndroid()) return null;

    try {
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

        const sessions = await getSleepSessions(twoDaysAgo, now);

        if (sessions.length === 0) return null;

        // Get the most recent session
        const sorted = [...sessions].sort(
            (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
        );

        return sorted[0];
    } catch (error) {
        console.error('Error fetching last night sleep:', error);
        return null;
    }
};
