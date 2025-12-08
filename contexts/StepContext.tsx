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

    // Check sensor availability
    useEffect(() => {
        const checkAvailability = async () => {
            const available = await Pedometer.isAvailableAsync();
            setIsAvailable(available);
        };
        checkAvailability();
    }, []);

    // Load persisted step data
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);
                if (stored) {
                    const data: StepData = JSON.parse(stored);
                    const todayKey = getTodayKey();

                    if (data.date === todayKey) {
                        // Same day - restore steps
                        setCurrentSteps(data.steps);
                        baseStepsRef.current = data.steps;
                        lastSensorValueRef.current = data.lastSensorValue;
                        setStepGoalState(data.stepGoal || DEFAULT_STEP_GOAL);
                    } else {
                        // New day - reset steps but keep goal
                        setCurrentSteps(0);
                        baseStepsRef.current = 0;
                        lastSensorValueRef.current = null;
                        setStepGoalState(data.stepGoal || DEFAULT_STEP_GOAL);
                        // Save the reset
                        await saveData(0, null, data.stepGoal || DEFAULT_STEP_GOAL);
                    }
                }
            } catch {
                // Failed to load step data
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

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

    // Start watching steps
    const startWatching = useCallback(() => {
        if (!isAvailable || subscriptionRef.current) return;

        subscriptionRef.current = Pedometer.watchStepCount(result => {
            const sensorValue = result.steps;

            if (lastSensorValueRef.current === null) {
                // First reading - just record sensor value, don't add steps
                lastSensorValueRef.current = sensorValue;
            } else {
                // Calculate delta from last sensor reading
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
                // App came to foreground - check if day changed
                const todayKey = getTodayKey();
                const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);

                if (stored) {
                    const data: StepData = JSON.parse(stored);
                    if (data.date !== todayKey) {
                        // New day - reset
                        setCurrentSteps(0);
                        baseStepsRef.current = 0;
                        lastSensorValueRef.current = null;
                        await saveData(0, null, stepGoal);
                    }
                }

                // Try to get historical steps for today
                if (isAvailable) {
                    try {
                        const start = new Date();
                        start.setHours(0, 0, 0, 0);
                        const end = new Date();
                        const result = await Pedometer.getStepCountAsync(start, end);
                        if (result && result.steps > currentSteps) {
                            setCurrentSteps(result.steps);
                            baseStepsRef.current = result.steps;
                            await saveData(result.steps, lastSensorValueRef.current, stepGoal);
                        }
                    } catch {
                        // getStepCountAsync might not be supported
                    }
                }

                startWatching();
            } else if (nextAppState === 'background') {
                stopWatching();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Start watching when component mounts
        if (isAvailable) {
            startWatching();
        }

        return () => {
            subscription.remove();
            stopWatching();
        };
    }, [isAvailable, startWatching, stopWatching, stepGoal, currentSteps]);

    // Check for midnight reset
    useEffect(() => {
        const checkMidnight = setInterval(async () => {
            const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);
            if (stored) {
                const data: StepData = JSON.parse(stored);
                const todayKey = getTodayKey();

                if (data.date !== todayKey) {
                    // Midnight passed - reset steps
                    setCurrentSteps(0);
                    baseStepsRef.current = 0;
                    lastSensorValueRef.current = null;
                    await saveData(0, null, stepGoal);
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkMidnight);
    }, [stepGoal]);

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
        stopWatching
    };
});
