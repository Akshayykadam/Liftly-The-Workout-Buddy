import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useMemo, useCallback } from 'react';

import type { WorkoutLevel } from '@/constants';
import { type ReminderSettings, DEFAULT_REMINDER_SETTINGS } from '@/utils/notifications';

export type UserGoal = 'loss' | 'gain' | 'maintenance';
export type Gender = 'male' | 'female';

export interface WeightEntry {
    date: string; // ISO date string
    weight: number;
    unit: 'kg' | 'lbs';
}

export interface UserProfile {
    name: string;
    birthYear?: number;
    weight: number;
    height: number;
    weightUnit: 'kg' | 'lbs';
    heightUnit: 'cm' | 'ft';
    goal: UserGoal;
    level: WorkoutLevel;
    gender: Gender;
    startDayOfWeek: number; // 0=Sunday, 1=Monday...6=Saturday
    reminderSettings: ReminderSettings;
    isOnboarded: boolean;
    createdAt: string;
}

export interface UserData {
    profile: UserProfile;
    weightHistory: WeightEntry[];
}

const USER_STORAGE_KEY = 'workout_user_data';

const DEFAULT_PROFILE: UserProfile = {
    name: '',
    weight: 0,
    height: 0,
    weightUnit: 'kg',
    heightUnit: 'cm',
    goal: 'maintenance',
    level: 2,
    gender: 'male',
    startDayOfWeek: 1, // Monday by default
    reminderSettings: DEFAULT_REMINDER_SETTINGS,
    isOnboarded: false,
    createdAt: ''
};

const DEFAULT_USER_DATA: UserData = {
    profile: DEFAULT_PROFILE,
    weightHistory: []
}

function getTodayKey(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export const [UserProvider, useUser] = createContextHook(() => {
    const queryClient = useQueryClient();

    const dataQuery = useQuery({
        queryKey: ['userData'],
        queryFn: async (): Promise<UserData> => {
            const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return DEFAULT_USER_DATA;
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (data: UserData) => {
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['userData'], data);
        }
    });

    const profile = useMemo(() => {
        return dataQuery.data?.profile || DEFAULT_PROFILE;
    }, [dataQuery.data]);

    const weightHistory = useMemo(() => {
        return dataQuery.data?.weightHistory || [];
    }, [dataQuery.data]);

    const isOnboarded = useMemo(() => {
        return profile.isOnboarded;
    }, [profile]);

    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        if (!dataQuery.data) return;

        const newData: UserData = {
            ...dataQuery.data,
            profile: {
                ...dataQuery.data.profile,
                ...updates
            }
        };
        saveMutation.mutate(newData);
    }, [dataQuery.data, saveMutation]);

    const completeOnboarding = useCallback((profileData: Omit<UserProfile, 'isOnboarded' | 'createdAt'>) => {
        const newData: UserData = {
            profile: {
                ...profileData,
                isOnboarded: true,
                createdAt: new Date().toISOString()
            },
            weightHistory: [{
                date: getTodayKey(),
                weight: profileData.weight,
                unit: profileData.weightUnit
            }]
        };
        saveMutation.mutate(newData);
    }, [saveMutation]);

    const logWeight = useCallback((weight: number, unit?: 'kg' | 'lbs') => {
        if (!dataQuery.data) return;

        const today = getTodayKey();
        const weightUnit = unit || dataQuery.data.profile.weightUnit;

        // Check if there's already an entry for today
        const existingIndex = dataQuery.data.weightHistory.findIndex(
            entry => entry.date === today
        );

        let newHistory: WeightEntry[];
        if (existingIndex >= 0) {
            // Update existing entry
            newHistory = [...dataQuery.data.weightHistory];
            newHistory[existingIndex] = { date: today, weight, unit: weightUnit };
        } else {
            // Add new entry
            newHistory = [
                ...dataQuery.data.weightHistory,
                { date: today, weight, unit: weightUnit }
            ];
        }

        const newData: UserData = {
            ...dataQuery.data,
            profile: {
                ...dataQuery.data.profile,
                weight // Update current weight
            },
            weightHistory: newHistory
        };
        saveMutation.mutate(newData);
    }, [dataQuery.data, saveMutation]);

    const getTodayWeight = useCallback((): WeightEntry | null => {
        const today = getTodayKey();
        return weightHistory.find(entry => entry.date === today) || null;
    }, [weightHistory]);

    const getWeightChange = useCallback(() => {
        if (weightHistory.length < 2) return { change: 0, percentage: 0 };

        const sorted = [...weightHistory].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const change = last.weight - first.weight;
        const percentage = (change / first.weight) * 100;

        return { change, percentage, startWeight: first.weight, currentWeight: last.weight };
    }, [weightHistory]);

    const getWeeklyStats = useCallback(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weekEntries = weightHistory.filter(entry =>
            new Date(entry.date) >= weekAgo
        );

        if (weekEntries.length === 0) return null;

        const weights = weekEntries.map(e => e.weight);
        const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
        const min = Math.min(...weights);
        const max = Math.max(...weights);

        return { avg, min, max, entries: weekEntries.length };
    }, [weightHistory]);

    const getMonthlyStats = useCallback(() => {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const monthEntries = weightHistory.filter(entry =>
            new Date(entry.date) >= monthAgo
        );

        if (monthEntries.length === 0) return null;

        const weights = monthEntries.map(e => e.weight);
        const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
        const min = Math.min(...weights);
        const max = Math.max(...weights);

        // Calculate trend
        const sorted = [...monthEntries].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (sorted.length >= 2) {
            const change = sorted[sorted.length - 1].weight - sorted[0].weight;
            if (change > 0.5) trend = 'up';
            else if (change < -0.5) trend = 'down';
        }

        return { avg, min, max, entries: monthEntries.length, trend };
    }, [weightHistory]);

    const calculateBMI = useCallback(() => {
        if (!profile.weight || !profile.height) return null;

        let weightKg = profile.weight;
        let heightM = profile.height / 100;

        if (profile.weightUnit === 'lbs') {
            weightKg = profile.weight * 0.453592;
        }
        if (profile.heightUnit === 'ft') {
            heightM = profile.height * 0.3048;
        }

        const bmi = weightKg / (heightM * heightM);

        let category: string;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        return { value: Math.round(bmi * 10) / 10, category };
    }, [profile]);

    const setLevel = useCallback((level: WorkoutLevel) => {
        updateProfile({ level });
    }, [updateProfile]);

    const setStartDayOfWeek = useCallback((startDayOfWeek: number) => {
        updateProfile({ startDayOfWeek });
    }, [updateProfile]);

    return {
        profile,
        weightHistory,
        isOnboarded,
        isLoading: dataQuery.isLoading,
        updateProfile,
        completeOnboarding,
        logWeight,
        getTodayWeight,
        getWeightChange,
        getWeeklyStats,
        getMonthlyStats,
        calculateBMI,
        setLevel,
        setStartDayOfWeek
    };
});
