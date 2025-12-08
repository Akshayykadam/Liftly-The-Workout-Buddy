import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Pedometer } from 'expo-sensors';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const STEP_STORAGE_KEY = 'workout_step_data';
const DEFAULT_STEP_GOAL = 10000;

interface StepData {
    date: string;
    steps: number;
    lastSensorValue: number | null;
    stepGoal: number;
}

function getTodayKey(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

export const [StepProvider, useSteps] = createContextHook(() => {
    const [currentSteps, setCurrentSteps] = useState(0);
    const [stepGoal, setStepGoalState] = useState(DEFAULT_STEP_GOAL);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const subscriptionRef = useRef<{ remove: () => void } | null>(null);
    const lastSensorValueRef = useRef<number | null>(null);
    const baseStepsRef = useRef<number>(0);

    // Initialize - restore data and check availability
    useEffect(() => {
        const init = async () => {
            try {
                // Restore saved goal/steps first
                const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);
                if (stored) {
                    const data: StepData = JSON.parse(stored);
                    if (data.date === getTodayKey()) {
                        setCurrentSteps(data.steps);
                        baseStepsRef.current = data.steps;
                        lastSensorValueRef.current = data.lastSensorValue;
                        setStepGoalState(data.stepGoal || DEFAULT_STEP_GOAL);
                    } else {
                        // Reset for new day
                        setCurrentSteps(0);
                        baseStepsRef.current = 0;
                        lastSensorValueRef.current = null;
                        setStepGoalState(data.stepGoal || DEFAULT_STEP_GOAL);
                    }
                }

                // Check Pedometer availability (works on both iOS and Android)
                const available = await Pedometer.isAvailableAsync();
                setIsAvailable(available);

                // Fetch today's steps if available
                if (available) {
                    await fetchTodaySteps();
                }
            } catch (e) {
                console.error("StepContext Init Error", e);
                setIsAvailable(false);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Fetch today's step count
    const fetchTodaySteps = async () => {
        try {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();

            const result = await Pedometer.getStepCountAsync(start, end);
            if (result && result.steps >= 0) {
                const steps = result.steps;
                setCurrentSteps(steps);
                baseStepsRef.current = steps;
                saveData(steps, null, stepGoal);
            }
        } catch (e) {
            // Silently fail - step fetch is best-effort
        }
    };

    // Save step data to storage
    const saveData = async (steps: number, sensorValue: number | null, goal: number) => {
        try {
            const data: StepData = {
                date: getTodayKey(),
                steps,
                lastSensorValue: sensorValue,
                stepGoal: goal
            };
            await AsyncStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(data));
        } catch {
            // Failed to save step data
        }
    };

    // Start watching steps (live updates)
    const startWatching = useCallback(() => {
        if (!isAvailable || subscriptionRef.current) return;

        subscriptionRef.current = Pedometer.watchStepCount(result => {
            const sensorValue = result.steps;
            if (lastSensorValueRef.current === null) {
                lastSensorValueRef.current = sensorValue;
            } else {
                const delta = sensorValue - lastSensorValueRef.current;
                if (delta > 0) {
                    const newSteps = baseStepsRef.current + delta;
                    setCurrentSteps(newSteps);
                    baseStepsRef.current = newSteps;
                    lastSensorValueRef.current = sensorValue;
                    saveData(newSteps, sensorValue, stepGoal);
                }
            }
        });
    }, [isAvailable, stepGoal]);

    // Stop watching steps
    const stopWatching = useCallback(() => {
        if (subscriptionRef.current) {
            subscriptionRef.current.remove();
            subscriptionRef.current = null;
        }
    }, []);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                // Check midnight reset
                const todayKey = getTodayKey();
                const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);
                if (stored) {
                    const data: StepData = JSON.parse(stored);
                    if (data.date !== todayKey) {
                        setCurrentSteps(0);
                        baseStepsRef.current = 0;
                        lastSensorValueRef.current = null;
                        saveData(0, null, stepGoal);
                    }
                }

                // Refresh step count and start watching
                if (isAvailable) {
                    await fetchTodaySteps();
                    startWatching();
                }
            } else if (nextAppState === 'background') {
                stopWatching();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Initial start
        if (isAvailable) {
            startWatching();
        }

        return () => {
            subscription.remove();
            stopWatching();
        };
    }, [isAvailable, startWatching, stopWatching, stepGoal]);

    // Set step goal
    const setStepGoal = useCallback(async (goal: number) => {
        setStepGoalState(goal);
        await saveData(currentSteps, lastSensorValueRef.current, goal);
    }, [currentSteps]);

    // Calculate progress percentage
    const progress = useMemo(() => {
        return Math.min((currentSteps / stepGoal) * 100, 100);
    }, [currentSteps, stepGoal]);

    return {
        currentSteps,
        stepGoal,
        setStepGoal,
        progress,
        isAvailable,
        isLoading,
        startWatching,
        stopWatching,
        refreshSteps: fetchTodaySteps
    };
});
