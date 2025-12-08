import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useMemo, useCallback } from 'react';

import { getWorkoutsForGenderAndLevel, type WorkoutDay, type WorkoutLevel, type Gender } from '@/constants';

interface CompletionState {
  [exerciseName: string]: boolean;
}

interface StoredData {
  startDate: string;
  completions: {
    [date: string]: CompletionState;
  };
  streak: number;
  lastCompletedDate: string;
  level?: WorkoutLevel;
}

const STORAGE_KEY = 'workout_tracker_data';
const USER_STORAGE_KEY = 'workout_user_data';

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function getDaysSinceStart(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getCurrentDayNumber(startDate: string): number {
  const daysSinceStart = getDaysSinceStart(startDate);
  return (daysSinceStart % 6) + 1;
}

export const [WorkoutProvider, useWorkout] = createContextHook(() => {
  const [completions, setCompletions] = useState<CompletionState>({});
  const [startDate, setStartDate] = useState<string>('');
  const [level, setLevelState] = useState<WorkoutLevel>(2);
  const [gender, setGender] = useState<Gender>('male');
  const [startDayOfWeek, setStartDayOfWeek] = useState<number>(1); // 1=Monday default
  const queryClient = useQueryClient();

  // Fetch user data to get the level
  const userDataQuery = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    }
  });

  // Update level, gender, and startDayOfWeek when user data changes
  useEffect(() => {
    if (userDataQuery.data?.profile?.level) {
      setLevelState(userDataQuery.data.profile.level);
    }
    if (userDataQuery.data?.profile?.gender) {
      setGender(userDataQuery.data.profile.gender);
    }
    if (userDataQuery.data?.profile?.startDayOfWeek !== undefined) {
      setStartDayOfWeek(userDataQuery.data.profile.startDayOfWeek);
    }
  }, [userDataQuery.data]);

  // Get workouts based on gender and level
  const workouts = useMemo(() => {
    return getWorkoutsForGenderAndLevel(gender, level);
  }, [gender, level]);

  const dataQuery = useQuery({
    queryKey: ['workoutData'],
    queryFn: async (): Promise<StoredData> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      const todayKey = getTodayKey();
      const newData: StoredData = {
        startDate: todayKey,
        completions: {},
        streak: 0,
        lastCompletedDate: '',
        level: 2
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: StoredData) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: (data) => {
      // Update the query cache with the new data so it persists across renders
      queryClient.setQueryData(['workoutData'], data);
    }
  });

  const { mutate: saveData } = saveMutation;

  useEffect(() => {
    if (dataQuery.data) {
      const todayKey = getTodayKey();
      setStartDate(dataQuery.data.startDate);
      setCompletions(dataQuery.data.completions[todayKey] || {});
    }
  }, [dataQuery.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setCompletions({});
        if (dataQuery.data) {
          const todayKey = getTodayKey();
          const updatedData: StoredData = {
            ...dataQuery.data,
            completions: {
              ...dataQuery.data.completions,
              [todayKey]: {}
            }
          };
          saveData(updatedData);
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [dataQuery.data, saveData]);

  // Calculate current workout day based on user's preferred start day of week
  const currentDayNumber = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0=Sunday, 1=Monday...6=Saturday

    // Calculate days since user's start day (cycling within the week)
    let daysFromStart = currentDayOfWeek - startDayOfWeek;
    if (daysFromStart < 0) {
      daysFromStart += 7;
    }

    // 6-day workout cycle: days 0-5 map to workout days 1-6, day 6 is rest (returns 0)
    if (daysFromStart >= 6) {
      return 0; // Rest day
    }
    return daysFromStart + 1; // Workout days 1-6
  }, [startDayOfWeek]);

  const isRestDay = currentDayNumber === 0;

  const currentWorkout = useMemo(() => {
    if (isRestDay) {
      // Return a "rest day" workout
      return {
        day: 0,
        title: 'Rest Day',
        exercises: []
      };
    }
    return workouts[currentDayNumber - 1];
  }, [currentDayNumber, workouts, isRestDay]);

  const toggleCompletion = (exerciseName: string, dayNumber?: number) => {
    // Use day-specific key to prevent exercises with same name on different days from sharing state
    const targetDay = dayNumber ?? currentDayNumber;
    const completionKey = `day${targetDay}_${exerciseName}`;
    const newCompletions = {
      ...completions,
      [completionKey]: !completions[completionKey]
    };
    setCompletions(newCompletions);

    if (dataQuery.data) {
      const todayKey = getTodayKey();
      const updatedData: StoredData = {
        ...dataQuery.data,
        completions: {
          ...dataQuery.data.completions,
          [todayKey]: newCompletions
        }
      };
      saveData(updatedData);
    }
  };

  const isExerciseCompleted = (exerciseName: string, dayNumber?: number): boolean => {
    // Use day-specific key to check completion
    const targetDay = dayNumber ?? currentDayNumber;
    const completionKey = `day${targetDay}_${exerciseName}`;
    return completions[completionKey] || false;
  };

  const getWorkoutProgress = (dayNumber: number): number => {
    const workout = workouts[dayNumber - 1];
    if (!workout || workout.exercises.length === 0) return 0;

    // Use local completions state for real-time updates
    const completed = workout.exercises.filter(ex => {
      const completionKey = `day${dayNumber}_${ex.name}`;
      return completions[completionKey];
    }).length;
    return (completed / workout.exercises.length) * 100;
  };

  const getTodayStats = () => {
    const completed = currentWorkout.exercises.filter(ex => isExerciseCompleted(ex.name)).length;
    const total = currentWorkout.exercises.length;
    return { completed, total };
  };

  const streak = useMemo(() => {
    if (!dataQuery.data) return 0;

    const todayKey = getTodayKey();

    // Merge stored completions with current session's local completions for today
    const mergedCompletions = {
      ...dataQuery.data.completions,
      [todayKey]: {
        ...dataQuery.data.completions[todayKey],
        ...completions
      }
    };

    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const dayCompletions = mergedCompletions[dateKey];

      if (!dayCompletions) break;

      const daysSince = Math.floor((new Date().getTime() - new Date(dataQuery.data.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceCheck = Math.floor((new Date().getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      const dayNumber = ((daysSince - daysSinceCheck) % 6) + 1;
      const workout = workouts[dayNumber - 1];
      if (!workout) break;

      // Count how many exercises were completed for this day
      const completedCount = workout.exercises.filter(ex => {
        const completionKey = `day${dayNumber}_${ex.name}`;
        return dayCompletions[completionKey];
      }).length;

      // Count the day if at least 1 exercise was completed
      if (completedCount > 0) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streakCount;
  }, [dataQuery.data, completions, workouts]);

  // Refresh workouts when user data changes (level change)
  const refreshWorkouts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['userData'] });
  }, [queryClient]);

  return {
    currentDayNumber,
    currentWorkout,
    workouts,
    level,
    completions,
    toggleCompletion,
    isExerciseCompleted,
    getWorkoutProgress,
    getTodayStats,
    streak,
    isLoading: dataQuery.isLoading,
    refreshWorkouts,
    isRestDay
  };
});

export function useWorkoutDay(dayNumber: number): WorkoutDay {
  const { workouts } = useWorkout();
  return useMemo(() => workouts[dayNumber - 1], [dayNumber, workouts]);
}
