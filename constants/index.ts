// Unified workout exports for all levels
export type { Exercise, WorkoutDay } from './workouts';

import { WORKOUTS as LEVEL2_WORKOUTS } from './workouts';
import { LEVEL1_WORKOUTS } from './level1Workouts';
import { LEVEL3_WORKOUTS } from './level3Workouts';
import { WOMEN_LEVEL1_WORKOUTS } from './womenLevel1Workouts';
import { WOMEN_LEVEL2_WORKOUTS } from './womenLevel2Workouts';
import { WOMEN_LEVEL3_WORKOUTS } from './womenLevel3Workouts';

export { LEVEL1_WORKOUTS, LEVEL2_WORKOUTS, LEVEL3_WORKOUTS };
export { WOMEN_LEVEL1_WORKOUTS, WOMEN_LEVEL2_WORKOUTS, WOMEN_LEVEL3_WORKOUTS };

export type WorkoutLevel = 1 | 2 | 3;
export type Gender = 'male' | 'female';

export function getWorkoutsForLevel(level: WorkoutLevel) {
    switch (level) {
        case 1:
            return LEVEL1_WORKOUTS;
        case 2:
            return LEVEL2_WORKOUTS;
        case 3:
            return LEVEL3_WORKOUTS;
        default:
            return LEVEL2_WORKOUTS;
    }
}

export function getWorkoutsForGenderAndLevel(gender: Gender, level: WorkoutLevel) {
    if (gender === 'female') {
        switch (level) {
            case 1:
                return WOMEN_LEVEL1_WORKOUTS;
            case 2:
                return WOMEN_LEVEL2_WORKOUTS;
            case 3:
                return WOMEN_LEVEL3_WORKOUTS;
            default:
                return WOMEN_LEVEL2_WORKOUTS;
        }
    }
    // Male uses original workouts
    return getWorkoutsForLevel(level);
}

export function getLevelInfo(level: WorkoutLevel) {
    switch (level) {
        case 1:
            return {
                name: 'Beginner',
                description: 'Perfect for newcomers. Machine-focused exercises with lower volume.',
                setsRange: '2 sets',
                repsRange: '10-15 reps'
            };
        case 2:
            return {
                name: 'Intermediate',
                description: 'For those with gym experience. Mix of free weights and machines.',
                setsRange: '3 sets',
                repsRange: '15-20 reps'
            };
        case 3:
            return {
                name: 'Advanced',
                description: 'Intense training with compound movements and advanced techniques.',
                setsRange: '3-4 sets',
                repsRange: '8-15 reps'
            };
    }
}

