import { useWorkout } from '@/contexts/WorkoutContext';
import { useHealthConnect } from '@/contexts/HealthConnectContext';
import * as Haptics from 'expo-haptics';
import { Check, Target, Footprints, ChevronRight, X, Trophy, PartyPopper, User, TrendingUp } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  TextInput,
  Image,
  LayoutAnimation
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import type { Exercise } from '@/constants/workouts';

const COLORS = {
  black: '#000000',
  surface: '#0F0F0F',
  accent: '#CCFF00',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#1F1F1F',
  red: '#FF4757'
} as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentDayNumber, currentWorkout, isExerciseCompleted, toggleCompletion, getTodayStats, isRestDay } = useWorkout();
  const { dashboardData, stepGoal, stepProgress, isInitialized, isLoading, setStepGoal } = useHealthConnect();

  // Get step data from HealthConnectContext
  const currentSteps = dashboardData.steps?.today || 0;
  const isAvailable = isInitialized;

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState<'workout' | 'steps' | null>(null);
  const [celebratedWorkout, setCelebratedWorkout] = useState(false);
  const [celebratedSteps, setCelebratedSteps] = useState(false);
  const todayStats = getTodayStats();

  // Check for workout completion
  useEffect(() => {
    if (todayStats.completed === todayStats.total && todayStats.total > 0 && !celebratedWorkout) {
      setCelebratedWorkout(true);
      setShowCelebration('workout');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [todayStats.completed, todayStats.total, celebratedWorkout]);

  // Check for step goal completion
  useEffect(() => {
    if (currentSteps >= stepGoal && stepGoal > 0 && !celebratedSteps && isAvailable) {
      setCelebratedSteps(true);
      setShowCelebration('steps');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [currentSteps, stepGoal, celebratedSteps, isAvailable]);

  const handleToggleComplete = (exerciseName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleCompletion(exerciseName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <View style={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Today&apos;s Workout</Text>
            <Text style={styles.headerSubtitle}>
              Day {currentDayNumber} – {currentWorkout.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/progress')}
            >
              <TrendingUp size={24} color={COLORS.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <User size={24} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 }}>
          {/* Step Progress Card - Compact */}
          <TouchableOpacity
            style={[styles.stepProgressCard, { flex: 1, marginHorizontal: 0, marginBottom: 0, padding: 16 }]}
            onPress={() => setShowGoalModal(true)}
            activeOpacity={0.8}
          >
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Footprints size={18} color={COLORS.accent} strokeWidth={2.5} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textPrimary }}>Steps</Text>
              </View>

              <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textPrimary }}>
                {currentSteps.toLocaleString()}
              </Text>

              <View style={{ gap: 4 }}>
                <View style={styles.stepProgressBarContainer}>
                  <View style={[styles.stepProgressBar, { width: `${Math.min(stepProgress, 100)}%` }]} />
                </View>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>Goal: {stepGoal.toLocaleString()}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Workout Goal Card - Compact */}
          <View style={[styles.stepProgressCard, { flex: 1, marginHorizontal: 0, marginBottom: 0, padding: 16 }]}>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Target size={18} color={COLORS.accent} strokeWidth={2.5} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textPrimary }}>Workout</Text>
              </View>

              <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textPrimary }}>
                {todayStats.completed} <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>/ {todayStats.total}</Text>
              </Text>

              <View style={{ gap: 4 }}>
                <View style={styles.stepProgressBarContainer}>
                  <View
                    style={[
                      styles.stepProgressBar,
                      { width: `${Math.min((todayStats.completed / Math.max(todayStats.total, 1)) * 100, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                  {todayStats.completed === todayStats.total && todayStats.total > 0 ? 'Done!' : `${todayStats.total - todayStats.completed} left`}
                </Text>
              </View>
            </View>
          </View>
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
        {isRestDay ? (
          <RestDayCard />
        ) : (
          currentWorkout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={`${exercise.name}-${index}`}
              exercise={exercise}
              isCompleted={isExerciseCompleted(exercise.name)}
              onToggleComplete={() => handleToggleComplete(exercise.name)}
              onPress={() => router.push({
                pathname: "/exercise-detail",
                params: { exercise: JSON.stringify(exercise) }
              })}
            />
          ))
        )}
      </ScrollView>



      <GoalEditModal
        visible={showGoalModal}
        stepGoal={stepGoal}
        setStepGoal={setStepGoal}
        onClose={() => setShowGoalModal(false)}
      />

      <CelebrationModal
        visible={showCelebration !== null}
        type={showCelebration}
        onClose={() => setShowCelebration(null)}
        stepsCompleted={currentSteps}
        stepGoal={stepGoal}
      />
    </View>
  );
}

// Rest Day Card
function RestDayCard() {
  return (
    <View style={styles.restDayCard}>
      <View style={styles.restDayIconContainer}>
        <Check size={48} color={COLORS.accent} strokeWidth={1.5} />
      </View>
      <Text style={styles.restDayTitle}>Time to Recover!</Text>
      <Text style={styles.restDayMessage}>
        Rest days are essential for muscle recovery and growth. Take it easy today – you've earned it!
      </Text>

      <View style={styles.restDayTips}>
        <Text style={styles.restDayTipsTitle}>Rest Day Tips:</Text>
        <Text style={styles.restDayTip}>• Light stretching or yoga</Text>
        <Text style={styles.restDayTip}>• Stay hydrated</Text>
        <Text style={styles.restDayTip}>• Get quality sleep</Text>
        <Text style={styles.restDayTip}>• Focus on nutrition</Text>
      </View>
    </View>
  );
}

// Goal Edit Modal
interface GoalEditModalProps {
  visible: boolean;
  stepGoal: number;
  setStepGoal: (goal: number) => void;
  onClose: () => void;
}

function GoalEditModal({ visible, stepGoal, setStepGoal, onClose }: GoalEditModalProps) {
  const insets = useSafeAreaInsets();
  const [goalInput, setGoalInput] = useState(String(stepGoal));

  useEffect(() => {
    if (visible) {
      setGoalInput(String(stepGoal));
    }
  }, [visible, stepGoal]);

  const handleSave = () => {
    const newGoal = parseInt(goalInput, 10);
    if (newGoal > 0) {
      setStepGoal(newGoal);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    }
  };

  const presetGoals = [5000, 7500, 10000, 12500, 15000];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.goalModalContent, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.modalHandle} />

          <View style={styles.goalModalHeader}>
            <Text style={styles.goalModalTitle}>Daily Step Goal</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.goalModalDescription}>
            Set a daily step goal that challenges you to stay active.
          </Text>

          <View style={styles.goalInputContainer}>
            <TextInput
              style={styles.goalInput}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="number-pad"
              selectTextOnFocus
            />
            <Text style={styles.goalInputUnit}>steps</Text>
          </View>

          <View style={styles.presetGoals}>
            {presetGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.presetGoalButton,
                  parseInt(goalInput, 10) === goal && styles.presetGoalButtonActive
                ]}
                onPress={() => setGoalInput(String(goal))}
              >
                <Text style={[
                  styles.presetGoalText,
                  parseInt(goalInput, 10) === goal && styles.presetGoalTextActive
                ]}>
                  {(goal / 1000).toFixed(goal % 1000 === 0 ? 0 : 1)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.saveGoalButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveGoalButtonText}>Save Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Celebration Modal
interface CelebrationModalProps {
  visible: boolean;
  type: 'workout' | 'steps' | null;
  onClose: () => void;
  stepsCompleted?: number;
  stepGoal?: number;
}

function CelebrationModal({ visible, type, onClose, stepsCompleted = 0, stepGoal = 10000 }: CelebrationModalProps) {
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      })
    ]).start(() => onClose());
  };

  const isWorkout = type === 'workout';
  const title = isWorkout ? 'Workout Complete!' : 'Step Goal Reached!';
  const subtitle = isWorkout
    ? `Amazing! You crushed today's workout!`
    : `You've hit ${stepsCompleted.toLocaleString()} steps!`;
  const description = isWorkout
    ? 'Workout completed! Keep pushing toward your goals!'
    : `You reached your daily goal of ${stepGoal.toLocaleString()} steps. Keep moving!`;


  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.celebrationOverlay, { opacity: opacityAnim }]}>
        <Pressable style={styles.modalBackdrop} onPress={handleClose} />
        <Animated.View style={[
          styles.celebrationContent,
          {
            transform: [{ scale: scaleAnim }],
            paddingBottom: insets.bottom + 24
          }
        ]}>
          <View style={styles.celebrationIconContainer}>
            {isWorkout ? (
              <Trophy size={64} color={COLORS.accent} strokeWidth={1.5} />
            ) : (
              <PartyPopper size={64} color={COLORS.accent} strokeWidth={1.5} />
            )}
          </View>

          <Text style={styles.celebrationTitle}>{title}</Text>
          <Text style={styles.celebrationSubtitle}>{subtitle}</Text>
          <Text style={styles.celebrationDescription}>{description}</Text>

          <TouchableOpacity
            style={styles.celebrationButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.celebrationButtonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPress: () => void;
}

function ExerciseCard({ exercise, isCompleted, onToggleComplete, onPress }: ExerciseCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardContent}>
          {exercise.image && (
            <Image
              source={exercise.image}
              style={styles.cardExerciseImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.cardLeft}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetail}>
              {exercise.sets} sets × {exercise.reps}
            </Text>
            <Text style={styles.exerciseMuscle}>{exercise.targetMuscle}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.completeButtonActive
            ]}
            onPress={onToggleComplete}
          >
            {isCompleted && (
              <Check size={24} color={COLORS.black} strokeWidth={3} />
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stepProgressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stepProgressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  stepProgressLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10
  },
  stepProgressLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.textPrimary
  },
  stepProgressValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: COLORS.accent
  },
  stepProgressBarContainer: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden' as const
  },
  stepProgressBar: {
    height: '100%' as const,
    backgroundColor: COLORS.accent,
    borderRadius: 5
  },
  stepProgressHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
    marginTop: 12
  },
  exerciseStatsContainer: {
    marginHorizontal: 20
  },
  exerciseStatCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  statsContainer: {
    flexDirection: 'row' as const,
    gap: 12,
    marginHorizontal: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.accent,
    letterSpacing: 0.5
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12
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
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  cardExerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: COLORS.border
  },
  cardLeft: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center'
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  exerciseDetail: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  exerciseMuscle: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: COLORS.accent,
    marginTop: 2
  },
  completeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  completeButtonActive: {
    backgroundColor: COLORS.accent
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
  modalScrollView: {
    flex: 1
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
    height: '92%',
    marginTop: 'auto'
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  exerciseImage: {
    width: '80%',
    height: '80%',
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 8
  },
  modalMuscle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.accent,
    marginBottom: 28
  },
  modalSection: {
    marginBottom: 28
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 16
  },
  stepContainer: {
    flexDirection: 'row' as const,
    marginBottom: 12
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: COLORS.accent,
    marginRight: 12,
    minWidth: 24
  },
  stepText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    flex: 1
  },
  bulletContainer: {
    flexDirection: 'row' as const,
    marginBottom: 10
  },
  bullet: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.accent,
    marginRight: 12,
    minWidth: 20
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    flex: 1
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.black
  },
  // Step Counter Card Styles
  stepCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stepCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
    flex: 1
  },
  stepCardLoading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
    paddingVertical: 40
  },
  stepCardUnavailable: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 8
  },
  stepCardContent: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 24
  },
  progressRingContainer: {
    position: 'relative' as const,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressRingCenter: {
    position: 'absolute' as const,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepCount: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary
  },
  stepGoalText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  stepStats: {
    flex: 1,
    gap: 16
  },
  stepStatItem: {
    alignItems: 'flex-start' as const
  },
  stepStatValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  stepStatLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: COLORS.textSecondary
  },
  stepCardHint: {
    fontSize: 12,
    color: COLORS.accent,
    textAlign: 'center' as const,
    marginTop: 16
  },
  // Goal Modal Styles
  goalModalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 24
  },
  goalModalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  goalModalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary
  },
  goalModalDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 32
  },
  goalInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24
  },
  goalInput: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    textAlign: 'center' as const,
    minWidth: 150
  },
  goalInputUnit: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.accent
  },
  presetGoals: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32
  },
  presetGoalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.black,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  presetGoalButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent
  },
  presetGoalText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.textSecondary
  },
  presetGoalTextActive: {
    color: COLORS.black
  },
  saveGoalButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  saveGoalButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.black
  },
  // Celebration Modal Styles
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  celebrationContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  celebrationIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    textAlign: 'center' as const,
    marginBottom: 12
  },
  celebrationSubtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.accent,
    textAlign: 'center' as const,
    marginBottom: 8
  },
  celebrationDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 22,
    marginBottom: 32
  },
  celebrationButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center'
  },
  celebrationButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.black
  },
  // Rest Day Card Styles
  restDayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  restDayIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  restDayTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center' as const
  },
  restDayMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 22,
    marginBottom: 20
  },
  restDayStreak: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accent + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20
  },
  restDayStreakText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.accent
  },
  restDayTips: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  restDayTipsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  restDayTip: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20
  }
});
