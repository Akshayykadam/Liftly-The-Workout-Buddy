/**
 * Health Connect Type Definitions
 * Android-only health data types for integration with Health Connect
 */

// Steps
export interface StepsData {
    count: number;
    startTime: string;
    endTime: string;
}

export interface DailySteps {
    date: Date;
    steps: number;
    dayName: string;
}

// Exercise Sessions
export type ExerciseType =
    | 'WALKING'
    | 'RUNNING'
    | 'BIKING'
    | 'STRENGTH_TRAINING'
    | 'YOGA'
    | 'PILATES'
    | 'HIGH_INTENSITY_INTERVAL_TRAINING'
    | 'HIKING'
    | 'SWIMMING_POOL'
    | 'SWIMMING_OPEN_WATER'
    | 'DANCING'
    | 'OTHER_WORKOUT'
    | 'UNKNOWN';

export interface ExerciseSession {
    id: string;
    exerciseType: ExerciseType;
    title?: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    activeCalories?: number;
    distanceMeters?: number;
    notes?: string;
}

// Heart Rate
export interface HeartRateSample {
    beatsPerMinute: number;
    time: string;
}

export interface HeartRateData {
    samples: HeartRateSample[];
    averageBpm?: number;
    minBpm?: number;
    maxBpm?: number;
}

export interface RestingHeartRateData {
    beatsPerMinute: number;
    time: string;
}

// Calories
export interface CaloriesData {
    activeCalories: number;
    basalCalories: number;
    totalCalories: number;
    startTime: string;
    endTime: string;
}

// Body Measurements
export interface BodyMeasurements {
    weight?: {
        value: number; // in kg
        time: string;
    };
    height?: {
        value: number; // in cm
        time: string;
    };
    bodyFatPercentage?: {
        value: number;
        time: string;
    };
}

// Sleep
export type SleepStageType = 'AWAKE' | 'LIGHT' | 'DEEP' | 'REM' | 'OUT_OF_BED' | 'SLEEPING' | 'UNKNOWN';

export interface SleepStage {
    stage: SleepStageType;
    startTime: string;
    endTime: string;
    durationMinutes: number;
}

export interface SleepSession {
    id: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    stages?: SleepStage[];
    title?: string;
}

// Permissions
export type HealthPermission =
    | 'Steps'
    | 'HeartRate'
    | 'RestingHeartRate'
    | 'ExerciseSession'
    | 'ActiveCaloriesBurned'
    | 'BasalMetabolicRate'
    | 'TotalCaloriesBurned'
    | 'Weight'
    | 'Height'
    | 'BodyFat'
    | 'SleepSession';

export interface PermissionStatus {
    permission: HealthPermission;
    granted: boolean;
}

// Health Connect Status
export type HealthConnectStatus =
    | 'available' // Health Connect is available and ready
    | 'not_installed' // Health Connect needs to be installed (Android 13 and below)
    | 'not_supported' // Device doesn't support Health Connect
    | 'sdk_unavailable'; // Health Connect SDK not available

export interface HealthConnectState {
    status: HealthConnectStatus;
    isInitialized: boolean;
    permissions: PermissionStatus[];
    error?: string;
}

// Aggregated Health Data for the dashboard
export interface HealthDashboardData {
    steps: {
        today: number;
        weeklyData: DailySteps[];
        weeklyTotal: number;
        weeklyAverage: number;
    } | null;
    heartRate: {
        current?: number;
        resting?: number;
        lastUpdated?: string;
    } | null;
    calories: {
        active: number;
        basal: number;
        total: number;
    } | null;
    exercise: {
        recentSessions: ExerciseSession[];
        todayDurationMinutes: number;
    } | null;
    sleep: {
        lastSession?: SleepSession;
        averageDurationMinutes?: number;
    } | null;
    body: BodyMeasurements | null;
}
