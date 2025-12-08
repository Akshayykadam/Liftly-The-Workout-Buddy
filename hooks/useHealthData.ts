import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import {
    initialize,
    requestPermission,
    readRecords,
    ReadRecordsResult,
} from 'react-native-health-connect';

export interface HealthData {
    weight?: { value: number; date: string };
    steps?: number;
    calories?: number;
    distance?: number;
    fluids?: number; // ml
    sleep?: { hours: number; date: string };
    heartRate?: { min: number; max: number; avg: number; date: string };
    bodyFat?: number;
}

export function useHealthData() {
    const [data, setData] = useState<HealthData>({});
    const [loading, setLoading] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const requestPermissions = useCallback(async () => {
        if (Platform.OS !== 'android') return false;

        try {
            const isInitialized = await initialize();
            if (!isInitialized) return false;

            await requestPermission([
                { accessType: 'read', recordType: 'Weight' },
                { accessType: 'read', recordType: 'Steps' },
                { accessType: 'read', recordType: 'TotalCaloriesBurned' },
                { accessType: 'read', recordType: 'Distance' },
                { accessType: 'read', recordType: 'Hydration' },
                { accessType: 'read', recordType: 'SleepSession' },
                { accessType: 'read', recordType: 'HeartRate' },
                { accessType: 'read', recordType: 'BodyFat' },
                // Add others as needed
            ]);

            setPermissionGranted(true);
            return true;
        } catch (e) {
            console.error('Health Connect Permission Error:', e);
            return false;
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (Platform.OS !== 'android' || !permissionGranted) return;

        setLoading(true);
        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // For weight/sleep, look back a bit further (e.g., last 30 days to find latest)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const newData: HealthData = {};

        try {
            // 1. Weight (Latest)
            const weightRecords = await readRecords('Weight', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: thirtyDaysAgo.toISOString(),
                    endTime: now.toISOString(),
                },
                ascendingOrder: false,
                pageSize: 1,
            });
            if (weightRecords.records.length > 0) {
                newData.weight = {
                    value: weightRecords.records[0].weight.inKilograms,
                    date: weightRecords.records[0].time
                };
            }

            // 2. Steps (Today)
            const stepRecords = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            });
            const totalSteps = stepRecords.records.reduce((sum, r) => sum + r.count, 0);
            if (totalSteps > 0) newData.steps = totalSteps;

            // 3. Calories (Today - Total)
            const calorieRecords = await readRecords('TotalCaloriesBurned', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            });
            const totalCalories = calorieRecords.records.reduce((sum, r) => sum + r.energy.inKilocalories, 0);
            if (totalCalories > 0) newData.calories = Math.round(totalCalories);

            // 4. Distance (Today)
            const distanceRecords = await readRecords('Distance', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            });
            const totalDistance = distanceRecords.records.reduce((sum, r) => sum + r.distance.inMeters, 0);
            if (totalDistance > 0) newData.distance = Math.round(totalDistance);

            // 5. Hydration (Today)
            const hydrationRecords = await readRecords('Hydration', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            });
            const totalFluids = hydrationRecords.records.reduce((sum, r) => sum + r.volume.inMilliliters, 0);
            if (totalFluids > 0) newData.fluids = totalFluids;

            // 6. Sleep (Last Session - look back 24h)
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            const sleepRecords = await readRecords('SleepSession', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: yesterday.toISOString(),
                    endTime: now.toISOString(),
                },
                ascendingOrder: false,
                pageSize: 1,
            });
            if (sleepRecords.records.length > 0) {
                const session = sleepRecords.records[0];
                const durationHrs = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
                newData.sleep = {
                    hours: parseFloat(durationHrs.toFixed(1)),
                    date: session.endTime
                };
            }

            // 7. Heart Rate (Latest Sample)
            const hrRecords = await readRecords('HeartRate', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
                ascendingOrder: false,
                pageSize: 10, // Get last few to avg
            });

            if (hrRecords.records.length > 0) {
                // Flatten all samples from the records
                const samples = hrRecords.records.flatMap(r => r.samples);
                if (samples.length > 0) {
                    const beats = samples.map(s => s.beatsPerMinute);
                    newData.heartRate = {
                        min: Math.min(...beats),
                        max: Math.max(...beats),
                        avg: Math.round(beats.reduce((a, b) => a + b, 0) / beats.length),
                        date: hrRecords.records[0].endTime
                    };
                }
            }

        } catch (e) {
            console.warn('Error fetching health data:', e);
        } finally {
            setData(newData);
            setLoading(false);
        }
    }, [permissionGranted]);

    useEffect(() => {
        requestPermissions().then((granted) => {
            if (granted) fetchData();
        });
    }, [requestPermissions, fetchData]);

    return { data, loading, refresh: fetchData, permissionGranted };
}
