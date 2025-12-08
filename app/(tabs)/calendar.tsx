import { useWorkout, useWorkoutDay } from '@/contexts/WorkoutContext';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Exercise } from '@/constants/workouts';

const COLORS = {
  black: '#000000',
  surface: '#0F0F0F',
  accent: '#CCFF00',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#1F1F1F'
} as const;

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { currentDayNumber } = useWorkout();
  const { profile } = useUser();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startDay = profile.startDayOfWeek ?? 1;
    // dayNumber 1 = start day, dayNumber 2 = start day + 1, etc.
    const dayIndex = (startDay + dayNumber - 1) % 7;
    return days[dayIndex];
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <View style={{ paddingTop: insets.top + 16 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Schedule</Text>
          <Text style={styles.headerSubtitle}>6-Day Training Cycle</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3, 4, 5, 6].map((dayNum) => (
          <DayCard
            key={dayNum}
            dayNumber={dayNum}
            dayName={getDayName(dayNum)}
            isToday={dayNum === currentDayNumber}
            onPress={() => setSelectedDay(dayNum)}
          />
        ))}
      </ScrollView>

      <DayDetailModal
        dayNumber={selectedDay}
        visible={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
      />
    </View>
  );
}

interface DayCardProps {
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  onPress: () => void;
}

function DayCard({ dayNumber, dayName, isToday, onPress }: DayCardProps) {
  const workout = useWorkoutDay(dayNumber);
  const { getWorkoutProgress } = useWorkout();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const progress = getWorkoutProgress(dayNumber);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardLeft}>
            <View style={styles.dayNumberContainer}>
              <Text style={styles.dayNumber}>Day {dayNumber} - {dayName}</Text>
              {isToday && <View style={styles.todayIndicator} />}
            </View>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <Text style={styles.exerciseCount}>
              {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'}
            </Text>

            {progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>
            )}
          </View>

          <ChevronRight size={24} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: COLORS.accent,
    letterSpacing: 0.5
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  cardTouchable: {
    width: '100%'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  cardLeft: {
    flex: 1,
    marginRight: 16
  },
  dayNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
    letterSpacing: 1
  },
  todayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginLeft: 8
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  exerciseCount: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.textSecondary
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: COLORS.accent,
    minWidth: 36,
    textAlign: 'right'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end'
  },
  modalBackdrop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    maxHeight: '85%'
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  modalDayTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
    marginBottom: 4,
    letterSpacing: 1
  },
  modalWorkoutTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  exerciseCard: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16
  },
  exerciseCardLeft: {
    flex: 1,
    marginRight: 12
  },
  exerciseCardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  exerciseCardDetail: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: COLORS.textSecondary,
    marginBottom: 2
  },
  exerciseCardMuscle: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: COLORS.accent
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  completeButtonActive: {
    backgroundColor: COLORS.accent
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.black
  }
});

interface DayDetailModalProps {
  dayNumber: number | null;
  visible: boolean;
  onClose: () => void;
}

function DayDetailModal({ dayNumber, visible, onClose }: DayDetailModalProps) {
  const insets = useSafeAreaInsets();
  const workout = useWorkoutDay(dayNumber || 1);

  if (dayNumber === null) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalDayTitle}>DAY {dayNumber}</Text>
            <Text style={styles.modalWorkoutTitle}>{workout.title}</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[styles.modalScrollContent, { paddingBottom: 20 }]}
            bounces={true}
          >
            {workout.exercises.map((exercise, index) => (
              <ExerciseListItem
                key={`${exercise.name}-${index}`}
                exercise={exercise}
                isCompleted={false}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

interface ExerciseListItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggleComplete?: () => void;
}

function ExerciseListItem({ exercise, isCompleted, onToggleComplete }: ExerciseListItemProps) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseCardContent}>
        <View style={styles.exerciseCardLeft}>
          <Text style={styles.exerciseCardName}>{exercise.name}</Text>
          <Text style={styles.exerciseCardDetail}>
            {exercise.sets} sets × {exercise.reps} reps
          </Text>
          <Text style={styles.exerciseCardMuscle}>{exercise.targetMuscle}</Text>
        </View>

        {onToggleComplete && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.completeButtonActive
            ]}
            onPress={onToggleComplete}
            activeOpacity={0.7}
          >
            {isCompleted && (
              <Check size={18} color={COLORS.black} strokeWidth={3} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
