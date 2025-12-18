import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    ChevronLeft,
    Footprints,
    Target,
    TrendingUp,
    TrendingDown,
    Calendar,
    Heart,
    Flame,
    Moon,
    Activity,
    Scale,
    Settings,
    AlertCircle,
    Droplets,
    Award,
    Zap,
    Clock,
    Plus,
    Sparkles,
    ArrowUp,
    ArrowDown,
    Timer,
    Dumbbell,
    Navigation,
} from 'lucide-react-native';
import { useHealthConnect } from '@/contexts/HealthConnectContext';
import { HealthPermissionsModal } from '@/components/HealthPermissionsModal';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';
import type { ExerciseSession, SleepStage } from '@/types/healthTypes';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    surfaceLight: '#1A1A1A',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F',
    blue: '#3742FA',
    red: '#EA4C89',
    orange: '#F97316',
    purple: '#8B5CF6',
    green: '#22C55E',
    cyan: '#06B6D4',
    yellow: '#EAB308',
    pink: '#EC4899',
    teal: '#14B8A6',
} as const;

// Heart Rate Zone Colors
const ZONE_COLORS = {
    resting: '#22C55E',
    fatBurn: '#EAB308',
    cardio: '#F97316',
    peak: '#EF4444',
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = SCREEN_WIDTH * 0.45;
const STROKE_WIDTH = 12;

// Format exercise type for display
const formatExerciseType = (type: string): string => {
    return type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
};

// Format duration in minutes to a readable string
const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Format time to readable string
const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

// Calculate health score based on various metrics
const calculateHealthScore = (
    steps: number,
    stepGoal: number,
    sleepMinutes: number,
    exerciseMinutes: number,
    heartRate?: number
): { overall: number; breakdown: { steps: number; sleep: number; exercise: number; heartRate: number }; trend: 'up' | 'down' | 'stable' } => {
    // Steps score (0-100): 100 if goal reached, proportional otherwise
    const stepsScore = Math.min((steps / stepGoal) * 100, 100);

    // Sleep score (0-100): 100 for 7-9 hours, reduced otherwise
    const idealSleepMin = 420; // 7 hours
    const idealSleepMax = 540; // 9 hours
    let sleepScore = 0;
    if (sleepMinutes >= idealSleepMin && sleepMinutes <= idealSleepMax) {
        sleepScore = 100;
    } else if (sleepMinutes < idealSleepMin) {
        sleepScore = Math.max(0, (sleepMinutes / idealSleepMin) * 100);
    } else {
        sleepScore = Math.max(0, 100 - ((sleepMinutes - idealSleepMax) / 120) * 30);
    }

    // Exercise score (0-100): 100 for 30+ min, proportional otherwise
    const exerciseScore = Math.min((exerciseMinutes / 30) * 100, 100);

    // Heart rate score (0-100): 100 if in healthy range (60-80 resting)
    let heartRateScore = 75; // Default
    if (heartRate) {
        if (heartRate >= 60 && heartRate <= 80) {
            heartRateScore = 100;
        } else if (heartRate < 60) {
            heartRateScore = Math.max(50, 100 - (60 - heartRate) * 2);
        } else {
            heartRateScore = Math.max(50, 100 - (heartRate - 80) * 2);
        }
    }

    // Overall score (weighted average)
    const overall = Math.round(
        stepsScore * 0.3 + sleepScore * 0.3 + exerciseScore * 0.25 + heartRateScore * 0.15
    );

    return {
        overall,
        breakdown: {
            steps: Math.round(stepsScore),
            sleep: Math.round(sleepScore),
            exercise: Math.round(exerciseScore),
            heartRate: Math.round(heartRateScore),
        },
        trend: overall > 70 ? 'up' : overall > 50 ? 'stable' : 'down',
    };
};

// Generate health insights based on data
const getHealthInsights = (
    steps: number,
    stepGoal: number,
    sleepMinutes: number,
    exerciseMinutes: number
): { type: 'positive' | 'neutral' | 'warning'; message: string; icon: 'award' | 'footprints' | 'activity' | 'moon' | 'zap' }[] => {
    const insights: { type: 'positive' | 'neutral' | 'warning'; message: string; icon: 'award' | 'footprints' | 'activity' | 'moon' | 'zap' }[] = [];

    const stepPercent = (steps / stepGoal) * 100;
    if (stepPercent >= 100) {
        insights.push({ type: 'positive', message: 'Step goal achieved!', icon: 'award' });
    } else if (stepPercent >= 75) {
        insights.push({ type: 'neutral', message: `${Math.round(stepGoal - steps).toLocaleString()} steps to go!`, icon: 'footprints' });
    } else if (stepPercent < 50) {
        insights.push({ type: 'warning', message: 'Get moving! You\'re behind on steps.', icon: 'activity' });
    }

    if (sleepMinutes >= 420 && sleepMinutes <= 540) {
        insights.push({ type: 'positive', message: 'Great sleep last night!', icon: 'moon' });
    } else if (sleepMinutes < 360) {
        insights.push({ type: 'warning', message: 'Consider getting more sleep tonight.', icon: 'moon' });
    }

    if (exerciseMinutes >= 30) {
        insights.push({ type: 'positive', message: 'Workout complete for today!', icon: 'zap' });
    }

    return insights.slice(0, 2); // Max 2 insights
};

export default function HealthScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const {
        isAndroid,
        healthConnectStatus,
        isInitialized,
        isLoading,
        error,
        dashboardData,
        stepGoal,
        stepProgress,
        refreshData,
        permissions,
    } = useHealthConnect();

    const radius = (RING_SIZE - STROKE_WIDTH) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (stepProgress / 100) * circumference;

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshData();
        setRefreshing(false);
    };

    // Calculated values
    const stepsData = dashboardData.steps;
    const currentSteps = stepsData?.today || 0;
    const weeklyData = stepsData?.weeklyData || [];
    const weeklyAverage = stepsData?.weeklyAverage || 0;
    const maxSteps = Math.max(...weeklyData.map(d => d.steps), stepGoal);

    // Health Connect specific data
    const heartRateData = dashboardData.heartRate;
    const caloriesData = dashboardData.calories;
    const exerciseData = dashboardData.exercise;
    const sleepData = dashboardData.sleep;
    const bodyData = dashboardData.body;

    // Water intake state
    const [waterGlasses, setWaterGlasses] = useState(0);
    const WATER_GOAL = 8;

    // Calculate health score
    const healthScore = useMemo(() => {
        const sleepMinutes = sleepData?.lastSession?.durationMinutes || 0;
        const exerciseMinutes = exerciseData?.todayDurationMinutes || 0;
        const restingHR = heartRateData?.resting;
        return calculateHealthScore(currentSteps, stepGoal, sleepMinutes, exerciseMinutes, restingHR);
    }, [currentSteps, stepGoal, sleepData, exerciseData, heartRateData]);

    // Get health insights
    const insights = useMemo(() => {
        const sleepMinutes = sleepData?.lastSession?.durationMinutes || 0;
        const exerciseMinutes = exerciseData?.todayDurationMinutes || 0;
        return getHealthInsights(currentSteps, stepGoal, sleepMinutes, exerciseMinutes);
    }, [currentSteps, stepGoal, sleepData, exerciseData]);

    // Calculate BMI
    const bmiData = useMemo(() => {
        if (!bodyData?.weight?.value || !bodyData?.height?.value) return null;
        const weightKg = bodyData.weight.value;
        const heightM = bodyData.height.value / 100;
        const bmi = weightKg / (heightM * heightM);
        let category = 'Normal';
        let color: string = COLORS.green;
        if (bmi < 18.5) { category = 'Underweight'; color = COLORS.yellow; }
        else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = COLORS.orange; }
        else if (bmi >= 30) { category = 'Obese'; color = COLORS.red; }
        return { value: bmi.toFixed(1), category, color };
    }, [bodyData]);

    // Web demo mode - show all features for UI preview
    const isWeb = Platform.OS === 'web';
    const showHealthConnectFeatures = isAndroid || isWeb;

    // Check if permissions are needed (only on Android, not web demo)
    const needsPermissions = isAndroid && !isWeb && healthConnectStatus === 'available' && permissions.length === 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <ChevronLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Activity</Text>
                {showHealthConnectFeatures && (
                    <TouchableOpacity
                        onPress={() => setPermissionsModalVisible(true)}
                        style={styles.settingsButton}
                    >
                        <Settings size={22} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
                {!showHealthConnectFeatures && <View style={styles.placeholder} />}
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={COLORS.accent}
                        colors={[COLORS.accent]}
                    />
                }
            >
                {isLoading ? (
                    <View style={styles.centerState}>
                        <Text style={styles.loadingText}>Loading health data...</Text>
                    </View>
                ) : !isInitialized ? (
                    <View style={styles.unavailableState}>
                        <AlertCircle size={48} color={COLORS.textSecondary} />
                        <Text style={styles.unavailableTitle}>
                            {isAndroid ? 'Health Connect Unavailable' : 'Step Counter Unavailable'}
                        </Text>
                        <Text style={styles.unavailableDescription}>
                            {error || (isAndroid
                                ? 'Health Connect is not available on this device. Please install it from the Play Store.'
                                : 'Your device doesn\'t support step counting, or permission was denied.')}
                        </Text>
                        {isAndroid && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setPermissionsModalVisible(true)}
                            >
                                <Text style={styles.actionButtonText}>Learn More</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : needsPermissions ? (
                    <View style={styles.unavailableState}>
                        <Activity size={48} color={COLORS.accent} />
                        <Text style={styles.unavailableTitle}>Grant Permissions</Text>
                        <Text style={styles.unavailableDescription}>
                            Liftly needs permission to access your health data from Health Connect.
                        </Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setPermissionsModalVisible(true)}
                        >
                            <Text style={styles.actionButtonText}>Set Up Health Connect</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Health Score Card */}
                        <View style={styles.healthScoreCard}>
                            <View style={styles.healthScoreHeader}>
                                <Sparkles size={20} color={COLORS.accent} />
                                <Text style={styles.healthScoreTitle}>Health Score</Text>
                            </View>
                            <View style={styles.healthScoreContent}>
                                <View style={styles.healthScoreRing}>
                                    <Text style={[
                                        styles.healthScoreValue,
                                        { color: healthScore.overall >= 70 ? COLORS.green : healthScore.overall >= 50 ? COLORS.yellow : COLORS.red }
                                    ]}>
                                        {healthScore.overall}
                                    </Text>
                                    <Text style={styles.healthScoreMax}>/100</Text>
                                </View>
                                <View style={styles.healthScoreBreakdown}>
                                    <View style={styles.scoreItem}>
                                        <Footprints size={14} color={COLORS.blue} />
                                        <Text style={styles.scoreItemLabel}>Steps</Text>
                                        <Text style={styles.scoreItemValue}>{healthScore.breakdown.steps}</Text>
                                    </View>
                                    <View style={styles.scoreItem}>
                                        <Moon size={14} color={COLORS.purple} />
                                        <Text style={styles.scoreItemLabel}>Sleep</Text>
                                        <Text style={styles.scoreItemValue}>{healthScore.breakdown.sleep}</Text>
                                    </View>
                                    <View style={styles.scoreItem}>
                                        <Zap size={14} color={COLORS.orange} />
                                        <Text style={styles.scoreItemLabel}>Exercise</Text>
                                        <Text style={styles.scoreItemValue}>{healthScore.breakdown.exercise}</Text>
                                    </View>
                                    <View style={styles.scoreItem}>
                                        <Heart size={14} color={COLORS.red} />
                                        <Text style={styles.scoreItemLabel}>Heart</Text>
                                        <Text style={styles.scoreItemValue}>{healthScore.breakdown.heartRate}</Text>
                                    </View>
                                </View>
                            </View>
                            {insights.length > 0 && (
                                <View style={styles.insightsContainer}>
                                    {insights.map((insight, idx) => {
                                        const iconColor = insight.type === 'positive' ? COLORS.green : insight.type === 'warning' ? COLORS.orange : COLORS.textSecondary;
                                        const InsightIcon = insight.icon === 'award' ? Award : insight.icon === 'footprints' ? Footprints : insight.icon === 'activity' ? Activity : insight.icon === 'moon' ? Moon : Zap;
                                        return (
                                            <View key={idx} style={[
                                                styles.insightBadge,
                                                { backgroundColor: insight.type === 'positive' ? COLORS.green + '20' : insight.type === 'warning' ? COLORS.orange + '20' : COLORS.surfaceLight }
                                            ]}>
                                                <InsightIcon size={14} color={iconColor} />
                                                <Text style={styles.insightText}>{insight.message}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        {/* Today's Steps - Linear Design */}
                        <View style={styles.stepsCard}>
                            <View style={styles.stepsCardHeader}>
                                <View style={styles.stepsCardLeft}>
                                    <Footprints size={22} color={COLORS.accent} strokeWidth={2.5} />
                                    <Text style={styles.stepsCardTitle}>Daily Steps</Text>
                                </View>
                                <Text style={styles.stepsCardValue}>
                                    {currentSteps.toLocaleString()} / {stepGoal.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.stepsProgressBarContainer}>
                                <View style={[styles.stepsProgressBar, { width: `${Math.min(stepProgress, 100)}%` }]} />
                            </View>
                            <View style={styles.stepsStatsRow}>
                                <View style={styles.stepsStatItem}>
                                    <Text style={styles.stepsStatValue}>{Math.round(stepProgress)}%</Text>
                                    <Text style={styles.stepsStatLabel}>Progress</Text>
                                </View>
                                <View style={styles.stepsStatItem}>
                                    <Text style={styles.stepsStatValue}>{weeklyAverage.toLocaleString()}</Text>
                                    <Text style={styles.stepsStatLabel}>Daily Avg</Text>
                                </View>
                                <View style={styles.stepsStatItem}>
                                    <Text style={styles.stepsStatValue}>{stepGoal.toLocaleString()}</Text>
                                    <Text style={styles.stepsStatLabel}>Goal</Text>
                                </View>
                            </View>
                        </View>

                        {/* Weekly Chart */}
                        {weeklyData.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Last 7 Days</Text>
                                <View style={styles.chartContainer}>
                                    <StepsLineChart data={weeklyData} />
                                </View>
                            </View>
                        )}

                        {/* Heart Rate (Android only) */}
                        {showHealthConnectFeatures && heartRateData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Heart Rate</Text>

                                {/* Main Heart Rate Card */}
                                <View style={styles.heartRateCard}>
                                    {/* Current Heart Rate */}
                                    <View style={styles.heartRateHeader}>
                                        <View style={styles.heartRateMainRow}>
                                            <View style={styles.heartRateIconContainer}>
                                                <Heart size={28} color={COLORS.red} fill={COLORS.red} />
                                            </View>
                                            <View style={styles.heartRateMainInfo}>
                                                <Text style={styles.heartRateCurrentLabel}>Current</Text>
                                                <View style={styles.heartRateCurrentRow}>
                                                    <Text style={styles.heartRateValue}>
                                                        {heartRateData.current || heartRateData.resting || '--'}
                                                    </Text>
                                                    <Text style={styles.heartRateUnit}>bpm</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {heartRateData.resting && (
                                            <View style={styles.heartRateRestingBadge}>
                                                <Text style={styles.heartRateRestingBadgeLabel}>Resting</Text>
                                                <Text style={styles.heartRateRestingBadgeValue}>{heartRateData.resting} bpm</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Heart Rate Stats Grid */}
                                    {heartRateData.history && heartRateData.history.length > 0 && (
                                        <View style={styles.heartRateStatsGrid}>
                                            <View style={styles.heartRateStatBox}>
                                                <Text style={[styles.heartRateStatValue, { color: COLORS.blue }]}>
                                                    {Math.min(...heartRateData.history.map(h => h.min))}
                                                </Text>
                                                <Text style={styles.heartRateStatLabel}>Min</Text>
                                            </View>
                                            <View style={styles.heartRateStatBox}>
                                                <Text style={[styles.heartRateStatValue, { color: COLORS.accent }]}>
                                                    {Math.round(heartRateData.history.reduce((sum, h) => sum + h.avg, 0) / heartRateData.history.length)}
                                                </Text>
                                                <Text style={styles.heartRateStatLabel}>Avg</Text>
                                            </View>
                                            <View style={styles.heartRateStatBox}>
                                                <Text style={[styles.heartRateStatValue, { color: COLORS.red }]}>
                                                    {Math.max(...heartRateData.history.map(h => h.max))}
                                                </Text>
                                                <Text style={styles.heartRateStatLabel}>Max</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Heart Rate Zones Indicator */}
                                    {heartRateData.current && (
                                        <View style={styles.heartRateZones}>
                                            <Text style={styles.heartRateZonesLabel}>Heart Rate Zone</Text>
                                            <View style={styles.heartRateZoneBar}>
                                                <View style={[styles.heartRateZoneSegment, { backgroundColor: COLORS.blue, flex: 1 }]} />
                                                <View style={[styles.heartRateZoneSegment, { backgroundColor: COLORS.green, flex: 1 }]} />
                                                <View style={[styles.heartRateZoneSegment, { backgroundColor: COLORS.yellow, flex: 1 }]} />
                                                <View style={[styles.heartRateZoneSegment, { backgroundColor: COLORS.orange, flex: 1 }]} />
                                                <View style={[styles.heartRateZoneSegment, { backgroundColor: COLORS.red, flex: 1 }]} />
                                            </View>
                                            <View style={styles.heartRateZoneLabels}>
                                                <Text style={styles.heartRateZoneLabelText}>Rest</Text>
                                                <Text style={styles.heartRateZoneLabelText}>Fat Burn</Text>
                                                <Text style={styles.heartRateZoneLabelText}>Cardio</Text>
                                                <Text style={styles.heartRateZoneLabelText}>Peak</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Last Updated */}
                                    {heartRateData.lastUpdated && (
                                        <Text style={styles.heartRateLastUpdated}>
                                            Last updated: {new Date(heartRateData.lastUpdated).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </Text>
                                    )}
                                </View>

                                {/* Heart Rate History Chart */}
                                {heartRateData.history && heartRateData.history.length > 0 && (
                                    <View style={[styles.chartContainer, { marginTop: 12 }]}>
                                        <HeartRateLineChart data={heartRateData.history} />
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Calories (Android only) */}
                        {showHealthConnectFeatures && caloriesData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Calories</Text>
                                <View style={styles.caloriesRow}>
                                    <View style={styles.calorieCard}>
                                        <Flame size={20} color={COLORS.orange} />
                                        <Text style={styles.calorieValue}>{caloriesData.active}</Text>
                                        <Text style={styles.calorieLabel}>Active</Text>
                                    </View>
                                    <View style={styles.calorieCard}>
                                        <Flame size={20} color={COLORS.textSecondary} />
                                        <Text style={styles.calorieValue}>{caloriesData.total}</Text>
                                        <Text style={styles.calorieLabel}>Total</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Water Intake Tracker */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Hydration</Text>
                            <View style={styles.waterCard}>
                                <View style={styles.waterHeader}>
                                    <View style={styles.waterTitle}>
                                        <Droplets size={18} color={COLORS.cyan} />
                                        <Text style={styles.waterTitleText}>Water Intake</Text>
                                    </View>
                                    <Text style={styles.waterProgress}>{waterGlasses}/{WATER_GOAL} glasses</Text>
                                </View>
                                <View style={styles.waterGlasses}>
                                    {Array.from({ length: WATER_GOAL }).map((_, idx) => (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.waterGlass,
                                                idx < waterGlasses && styles.waterGlassFilled
                                            ]}
                                        >
                                            <Droplets
                                                size={16}
                                                color={idx < waterGlasses ? COLORS.cyan : COLORS.textSecondary}
                                                fill={idx < waterGlasses ? COLORS.cyan : 'transparent'}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.addWaterButton}
                                    onPress={() => setWaterGlasses(prev => Math.min(prev + 1, WATER_GOAL))}
                                    activeOpacity={0.8}
                                >
                                    <Plus size={16} color={COLORS.black} />
                                    <Text style={styles.addWaterText}>Add Glass</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {showHealthConnectFeatures && exerciseData && exerciseData.recentSessions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Workouts</Text>
                                {exerciseData.recentSessions.slice(0, 3).map((session, index) => (
                                    <ExerciseSessionCard key={session.id || index} session={session} />
                                ))}
                            </View>
                        )}

                        {/* Sleep (Android only) */}
                        {showHealthConnectFeatures && sleepData?.lastSession && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Sleep</Text>
                                <SleepCard session={sleepData.lastSession} />
                            </View>
                        )}

                        {/* Body Measurements (Android only) */}
                        {showHealthConnectFeatures && bodyData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Body</Text>
                                <View style={styles.bodyRow}>
                                    {bodyData.weight && (
                                        <View style={styles.bodyCard}>
                                            <Scale size={18} color={COLORS.green} />
                                            <Text style={styles.bodyValue}>
                                                {bodyData.weight.value.toFixed(1)}
                                            </Text>
                                            <Text style={styles.bodyUnit}>kg</Text>
                                        </View>
                                    )}
                                    {bodyData.height && (
                                        <View style={styles.bodyCard}>
                                            <Activity size={18} color={COLORS.blue} />
                                            <Text style={styles.bodyValue}>
                                                {bodyData.height.value.toFixed(0)}
                                            </Text>
                                            <Text style={styles.bodyUnit}>cm</Text>
                                        </View>
                                    )}
                                    {bodyData.bodyFatPercentage && (
                                        <View style={styles.bodyCard}>
                                            <Activity size={18} color={COLORS.purple} />
                                            <Text style={styles.bodyValue}>
                                                {bodyData.bodyFatPercentage.value.toFixed(1)}
                                            </Text>
                                            <Text style={styles.bodyUnit}>% fat</Text>
                                        </View>
                                    )}
                                    {bmiData && (
                                        <View style={styles.bodyCard}>
                                            <Scale size={18} color={bmiData.color} />
                                            <Text style={styles.bodyValue}>{bmiData.value}</Text>
                                            <Text style={[styles.bodyUnit, { color: bmiData.color }]}>
                                                BMI · {bmiData.category}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Daily Breakdown */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Daily Breakdown</Text>
                            {weeklyData.slice().reverse().map((day, index) => {
                                const isToday = index === 0;
                                const dateStr = day.date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                });
                                const goalPercent = Math.round((day.steps / stepGoal) * 100);

                                return (
                                    <View key={index} style={styles.breakdownRow}>
                                        <View style={styles.breakdownLeft}>
                                            <Text style={[
                                                styles.breakdownDay,
                                                isToday && styles.breakdownDayActive
                                            ]}>
                                                {isToday ? 'Today' : day.dayName}
                                            </Text>
                                            <Text style={styles.breakdownDate}>{dateStr}</Text>
                                        </View>
                                        <View style={styles.breakdownRight}>
                                            <Text style={[
                                                styles.breakdownSteps,
                                                isToday && styles.breakdownStepsActive
                                            ]}>
                                                {day.steps.toLocaleString()}
                                            </Text>
                                            <Text style={[
                                                styles.breakdownPercent,
                                                goalPercent >= 100 && styles.breakdownPercentComplete
                                            ]}>
                                                {goalPercent}%
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Health Permissions Modal */}
            <HealthPermissionsModal
                visible={permissionsModalVisible}
                onClose={() => setPermissionsModalVisible(false)}
            />
        </View>
    );
}

// Exercise Session Card Component
const ExerciseSessionCard: React.FC<{ session: ExerciseSession }> = ({ session }) => {
    const startDate = new Date(session.startTime);
    const endDate = new Date(session.endTime);
    const dateStr = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    const startTimeStr = startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    const endTimeStr = endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Calculate pace for cardio activities (min/km)
    const pace = session.distanceMeters && session.distanceMeters > 0
        ? (session.durationMinutes / (session.distanceMeters / 1000)).toFixed(1)
        : null;

    // Get activity icon color based on type
    const getActivityColor = (type: string) => {
        if (type.includes('RUNNING')) return COLORS.green;
        if (type.includes('WALKING')) return COLORS.cyan;
        if (type.includes('STRENGTH') || type.includes('GYM')) return COLORS.orange;
        if (type.includes('YOGA') || type.includes('PILATES')) return COLORS.purple;
        if (type.includes('SWIMMING')) return COLORS.cyan;
        if (type.includes('BIKING') || type.includes('CYCLING')) return COLORS.yellow;
        if (type.includes('HIIT') || type.includes('INTERVAL')) return COLORS.red;
        return COLORS.blue;
    };

    const activityColor = getActivityColor(session.exerciseType);
    const formattedType = session.title || session.exerciseType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    return (
        <View style={styles.workoutCard}>
            {/* Header Row */}
            <View style={styles.workoutHeaderRow}>
                <View style={styles.workoutHeaderLeft}>
                    <View style={styles.workoutIconBox}>
                        {session.exerciseType.includes('RUNNING') || session.exerciseType.includes('WALKING') ? (
                            <Footprints size={26} color="#000" />
                        ) : (
                            <Dumbbell size={26} color="#000" />
                        )}
                    </View>
                    <View style={styles.workoutHeaderText}>
                        <Text style={styles.workoutTitle}>{formattedType}</Text>
                        <Text style={styles.workoutDateTime}>{dateStr} • {startTimeStr} → {endTimeStr}</Text>
                    </View>
                </View>
            </View>

            {/* Stats with Icons */}
            <View style={styles.workoutStatsRow}>
                <View style={styles.workoutStatItem}>
                    <View style={styles.workoutStatValueRow}>
                        <Timer size={16} color={COLORS.textSecondary} />
                        <Text style={styles.workoutStatValue}>{formatDuration(session.durationMinutes)}</Text>
                    </View>
                    <Text style={styles.workoutStatLabel}>Duration</Text>
                </View>
                {session.activeCalories && (
                    <View style={styles.workoutStatItem}>
                        <View style={styles.workoutStatValueRow}>
                            <Flame size={16} color={COLORS.textSecondary} />
                            <Text style={styles.workoutStatValue}>{Math.round(session.activeCalories)}</Text>
                        </View>
                        <Text style={styles.workoutStatLabel}>Calories</Text>
                    </View>
                )}
                {session.distanceMeters && session.distanceMeters > 0 && (
                    <View style={styles.workoutStatItem}>
                        <View style={styles.workoutStatValueRow}>
                            <Navigation size={16} color={COLORS.textSecondary} />
                            <Text style={styles.workoutStatValue}>{(session.distanceMeters / 1000).toFixed(2)}</Text>
                        </View>
                        <Text style={styles.workoutStatLabel}>km</Text>
                    </View>
                )}
                {pace && (
                    <View style={styles.workoutStatItem}>
                        <View style={styles.workoutStatValueRow}>
                            <Zap size={16} color={COLORS.textSecondary} />
                            <Text style={styles.workoutStatValue}>{pace}</Text>
                        </View>
                        <Text style={styles.workoutStatLabel}>min/km</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

// Sleep Card Component
const SleepCard: React.FC<{ session: { durationMinutes: number; startTime: string; endTime: string; stages?: SleepStage[] } }> = ({ session }) => {
    const hours = Math.floor(session.durationMinutes / 60);
    const mins = session.durationMinutes % 60;

    // Process stages to fill gaps and sort
    const stages = session.stages ? [...session.stages].sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ) : [];

    const sessionStart = new Date(session.startTime).getTime();
    const sessionEnd = new Date(session.endTime).getTime();
    const totalDurationMs = sessionEnd - sessionStart;

    // Calculate aggregatedstats
    const stageDurations = stages.reduce((acc, stage) => {
        acc[stage.stage] = (acc[stage.stage] || 0) + stage.durationMinutes;
        return acc;
    }, {} as Record<string, number>);

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'DEEP': return '#3B82F6'; // Blue
            case 'LIGHT': return '#93C5FD'; // Light Blue
            case 'REM': return COLORS.purple; // Purple
            case 'AWAKE':
            case 'OUT_OF_BED': return COLORS.orange; // Orange
            default: return COLORS.surfaceLight;
        }
    };

    const getStageLabel = (stage: string) => {
        switch (stage) {
            case 'DEEP': return 'Deep';
            case 'LIGHT': return 'Light';
            case 'REM': return 'REM';
            case 'AWAKE':
            case 'OUT_OF_BED': return 'Awake';
            default: return 'Other';
        }
    };

    return (
        <View style={styles.sleepCard}>
            <View style={styles.sleepHeader}>
                <Moon size={24} color={COLORS.purple} />
                <View style={styles.sleepDuration}>
                    <Text style={styles.sleepHours}>{hours}h {mins}m</Text>
                    <Text style={styles.sleepTime}>
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </Text>
                </View>
            </View>

            {/* Timeline Visualization */}
            {stages.length > 0 && totalDurationMs > 0 && (
                <View style={{ marginTop: 24, marginBottom: 8 }}>
                    <Text style={styles.chartTitle}>Sleep Stages</Text>
                    <View style={{ height: 24, borderRadius: 12, backgroundColor: COLORS.surfaceLight, flexDirection: 'row', overflow: 'hidden', width: '100%' }}>
                        {stages.map((stage, index) => {
                            const start = new Date(stage.startTime).getTime();
                            const end = new Date(stage.endTime).getTime();
                            const duration = end - start;

                            // Calculate position and width
                            const left = ((start - sessionStart) / totalDurationMs) * 100;
                            const width = (duration / totalDurationMs) * 100;

                            return (
                                <View
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        height: '100%',
                                        backgroundColor: getStageColor(stage.stage),
                                        borderRightWidth: 1,
                                        borderColor: COLORS.surface
                                    }}
                                />
                            );
                        })}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text style={styles.axisLabel}>{formatTime(session.startTime)}</Text>
                        <Text style={styles.axisLabel}>{formatTime(session.endTime)}</Text>
                    </View>
                </View>
            )}

            {/* Detailed Stats */}
            {Object.keys(stageDurations).length > 0 && (
                <View style={styles.sleepStages}>
                    {['AWAKE', 'REM', 'LIGHT', 'DEEP'].map((stageType) => {
                        const duration = stageDurations[stageType] || 0;
                        if (duration === 0) return null;

                        const percent = Math.round((duration / session.durationMinutes) * 100);

                        return (
                            <View key={stageType} style={styles.sleepStageItem}>
                                <View style={[styles.stageIndicator, { backgroundColor: getStageColor(stageType) }]} />
                                <View>
                                    <Text style={styles.stageLabel}>{getStageLabel(stageType)}</Text>
                                    <Text style={styles.stageDuration}>{formatDuration(duration)} <Text style={{ color: COLORS.textSecondary, fontWeight: '400' }}>({percent}%)</Text></Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const StepsLineChart = ({ data }: { data: Array<{ date: Date; steps: number; dayName: string }> }) => {
    const height = 150;
    const width = SCREEN_WIDTH - 72;
    const chartPadding = { top: 20, bottom: 30, left: 35, right: 10 };

    const chartData = useMemo(() => {
        if (data.length === 0) return null;

        const maxSteps = Math.max(...data.map(d => d.steps), 100);
        // Add 20% breathing room to max
        const yMax = Math.ceil(maxSteps * 1.2);
        const yRange = yMax;

        const chartInnerWidth = width - chartPadding.left - chartPadding.right;
        const chartInnerHeight = height - chartPadding.top - chartPadding.bottom;

        const points = data.map((d, i) => {
            const x = chartPadding.left + (i / Math.max(data.length - 1, 1)) * chartInnerWidth;
            const y = chartPadding.top + (1 - d.steps / yRange) * chartInnerHeight;
            return { x, y, ...d };
        });

        // Build path
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        // Build area path for gradient fill
        const areaPath = path +
            ` L ${points[points.length - 1].x} ${height - chartPadding.bottom}` +
            ` L ${points[0].x} ${height - chartPadding.bottom} Z`;

        return { points, path, areaPath, yMax, yRange };
    }, [data, height, width, chartPadding]);

    if (!chartData) return null;

    // Y Axis Labels
    const yLabels = useMemo(() => {
        const count = 3;
        const labels = [];
        for (let i = 0; i <= count; i++) {
            const value = Math.round(chartData.yMax * (i / count));
            const y = height - chartPadding.bottom - (i / count) * (height - chartPadding.top - chartPadding.bottom);
            labels.push({ value: value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value, y });
        }
        return labels;
    }, [chartData, height, chartPadding]);

    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
                </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yLabels.map((label, i) => (
                <Line
                    key={`grid-${i}`}
                    x1={chartPadding.left}
                    y1={label.y}
                    x2={width - chartPadding.right}
                    y2={label.y}
                    stroke={COLORS.border}
                    strokeWidth={1}
                />
            ))}

            {/* Y axis labels */}
            {yLabels.map((label, i) => (
                <SvgText
                    key={`ylabel-${i}`}
                    x={chartPadding.left - 8}
                    y={label.y + 4}
                    fontSize={10}
                    fill={COLORS.textSecondary}
                    textAnchor="end"
                >
                    {label.value}
                </SvgText>
            ))}

            {/* X axis labels */}
            {chartData.points.map((point, i) => (
                <SvgText
                    key={`xlabel-${i}`}
                    x={point.x}
                    y={height - 10}
                    fontSize={10}
                    fill={i === chartData.points.length - 1 ? COLORS.textPrimary : COLORS.textSecondary}
                    textAnchor="middle"
                    fontWeight={i === chartData.points.length - 1 ? '700' : '400'}
                >
                    {point.dayName}
                </SvgText>
            ))}

            {/* Area fill */}
            <Path
                d={chartData.areaPath}
                fill="url(#stepsGradient)"
            />

            {/* Line */}
            <Path
                d={chartData.path}
                stroke={COLORS.blue}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data points */}
            {chartData.points.map((point, i) => (
                <Circle
                    key={`point-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={i === chartData.points.length - 1 ? 5 : 3}
                    fill={i === chartData.points.length - 1 ? COLORS.blue : COLORS.surface}
                    stroke={COLORS.blue}
                    strokeWidth={2}
                />
            ))}
        </Svg>
    );
};

const HeartRateLineChart = ({ data }: { data: Array<{ date: Date; min: number; max: number; avg: number }> }) => {
    const height = 150;
    const width = SCREEN_WIDTH - 72;
    const chartPadding = { top: 20, bottom: 30, left: 35, right: 10 };

    const chartData = useMemo(() => {
        if (data.length === 0) return null;

        // Calculate Y axis range based on min/max heart rate
        const allMins = data.map(d => d.min);
        const allMaxs = data.map(d => d.max);
        const minVal = Math.min(...allMins);
        const maxVal = Math.max(...allMaxs);

        // Add padding to range
        const yMin = Math.max(0, minVal - 10);
        const yMax = maxVal + 10;
        const yRange = yMax - yMin || 1; // Prevent division by zero

        const chartInnerWidth = width - chartPadding.left - chartPadding.right;
        const chartInnerHeight = height - chartPadding.top - chartPadding.bottom;

        const points = data.map((d, i) => {
            const x = chartPadding.left + (i / Math.max(data.length - 1, 1)) * chartInnerWidth;
            const y = chartPadding.top + (1 - (d.avg - yMin) / yRange) * chartInnerHeight;
            const dayName = d.date.toLocaleDateString('en-US', { weekday: 'short' });
            return { x, y, dayName, ...d };
        });

        // Build path
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        // Build area path for gradient fill
        const areaPath = path +
            ` L ${points[points.length - 1].x} ${height - chartPadding.bottom}` +
            ` L ${points[0].x} ${height - chartPadding.bottom} Z`;

        return { points, path, areaPath, yMax, yMin, yRange };
    }, [data, height, width, chartPadding]);

    if (!chartData) return null;

    // Y Axis Labels
    const yLabels = useMemo(() => {
        const count = 3;
        const labels = [];
        for (let i = 0; i <= count; i++) {
            const value = Math.round(chartData.yMin + (i / count) * chartData.yRange);
            const y = height - chartPadding.bottom - (i / count) * (height - chartPadding.top - chartPadding.bottom);
            labels.push({ value, y });
        }
        return labels;
    }, [chartData, height, chartPadding]);

    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={COLORS.red} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={COLORS.red} stopOpacity="0" />
                </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yLabels.map((label, i) => (
                <Line
                    key={`grid-${i}`}
                    x1={chartPadding.left}
                    y1={label.y}
                    x2={width - chartPadding.right}
                    y2={label.y}
                    stroke={COLORS.border}
                    strokeWidth={1}
                />
            ))}

            {/* Y axis labels */}
            {yLabels.map((label, i) => (
                <SvgText
                    key={`ylabel-${i}`}
                    x={chartPadding.left - 8}
                    y={label.y + 4}
                    fontSize={10}
                    fill={COLORS.textSecondary}
                    textAnchor="end"
                >
                    {label.value}
                </SvgText>
            ))}

            {/* X axis labels */}
            {chartData.points.map((point, i) => (
                <SvgText
                    key={`xlabel-${i}`}
                    x={point.x}
                    y={height - 10}
                    fontSize={10}
                    fill={i === chartData.points.length - 1 ? COLORS.textPrimary : COLORS.textSecondary}
                    textAnchor="middle"
                    fontWeight={i === chartData.points.length - 1 ? '700' : '400'}
                >
                    {point.dayName}
                </SvgText>
            ))}

            {/* Area fill */}
            <Path
                d={chartData.areaPath}
                fill="url(#heartRateGradient)"
            />

            {/* Line */}
            <Path
                d={chartData.path}
                stroke={COLORS.red}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data points */}
            {chartData.points.map((point, i) => (
                <Circle
                    key={`point-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={i === chartData.points.length - 1 ? 5 : 3}
                    fill={i === chartData.points.length - 1 ? COLORS.red : COLORS.surface}
                    stroke={COLORS.red}
                    strokeWidth={2}
                />
            ))}
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    settingsButton: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    unavailableState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    unavailableTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    unavailableDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 20,
    },
    actionButton: {
        marginTop: 20,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.black,
    },
    stepsCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginTop: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    stepsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    stepsCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    stepsCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    stepsCardValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.accent,
    },
    stepsProgressBarContainer: {
        height: 12,
        backgroundColor: COLORS.border,
        borderRadius: 6,
        overflow: 'hidden',
    },
    stepsProgressBar: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 6,
    },
    stepsStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    stepsStatItem: {
        alignItems: 'center',
    },
    stepsStatValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    stepsStatLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    ringContainer: {
        width: RING_SIZE,
        height: RING_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 16,
    },
    ringContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    stepsCount: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    stepsLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 6,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    section: {
        marginTop: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    chartLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        width: (SCREEN_WIDTH - 112) / 7,
        textAlign: 'center',
    },
    chartLabelActive: {
        color: COLORS.accent,
        fontWeight: '600',
    },
    // Heart Rate - Enhanced
    heartRateCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    heartRateHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heartRateMainRow: { flexDirection: 'row', alignItems: 'center' },
    heartRateIconContainer: { width: 56, height: 56, borderRadius: 14, backgroundColor: COLORS.red + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    heartRateMainInfo: { flex: 1 },
    heartRateCurrentLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
    heartRateCurrentRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    heartRateMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    heartRateValue: { fontSize: 36, fontWeight: '700', color: COLORS.textPrimary },
    heartRateUnit: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
    heartRateRestingBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
    heartRateRestingBadgeLabel: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '500' },
    heartRateRestingBadgeValue: { fontSize: 14, fontWeight: '700', color: COLORS.red, marginTop: 2 },
    heartRateResting: { alignItems: 'flex-end' },
    heartRateRestingLabel: { fontSize: 12, color: COLORS.textSecondary },
    heartRateRestingValue: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginTop: 2 },
    heartRateStatsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
    heartRateStatBox: { alignItems: 'center', flex: 1 },
    heartRateStatValue: { fontSize: 22, fontWeight: '700' },
    heartRateStatLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
    heartRateZones: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
    heartRateZonesLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
    heartRateZoneBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' },
    heartRateZoneSegment: { height: '100%' },
    heartRateZoneLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    heartRateZoneLabelText: { fontSize: 10, color: COLORS.textSecondary },
    heartRateLastUpdated: { fontSize: 11, color: COLORS.textSecondary, marginTop: 12, textAlign: 'center' },
    // Calories
    caloriesRow: {
        flexDirection: 'row',
        gap: 10,
    },
    calorieCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    calorieValue: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 8,
    },
    calorieLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    // Workout - Premium Design
    workoutCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
    workoutHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    workoutHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    workoutIconBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    workoutIconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    workoutHeaderText: { flex: 1 },
    workoutTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
    workoutDateTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
    workoutMapPlaceholder: { width: 70, height: 70, borderRadius: 12, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.accent + '40' },
    workoutIllustration: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
    workoutStatsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    workoutStatItem: { flex: 1, alignItems: 'center' },
    workoutStatValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    workoutStatsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
    workoutStatBox: { alignItems: 'center', minWidth: 60 },
    workoutStatValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
    workoutStatLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6, marginBottom: 8 },
    workoutProgressBar: { width: '100%', height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, overflow: 'hidden' },
    workoutProgressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
    workoutNotes: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
    workoutNotesText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
    exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
    exerciseIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    exerciseContent: { flex: 1 },
    exerciseType: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
    exerciseDetails: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    exerciseDate: { fontSize: 12, color: COLORS.textSecondary },
    // Sleep
    sleepCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sleepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sleepDuration: {
        flex: 1,
    },
    sleepHours: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    sleepTime: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sleepStages: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        gap: 12,
    },
    sleepStage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stageIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    stageLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    stageDuration: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    // Body
    bodyRow: {
        flexDirection: 'row',
        gap: 10,
    },
    bodyCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    bodyValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 8,
    },
    bodyUnit: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    // Daily Breakdown
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    breakdownDay: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        width: 50,
    },
    breakdownDayActive: {
        color: COLORS.accent,
    },
    breakdownDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    breakdownRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    breakdownSteps: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    breakdownStepsActive: {
        color: COLORS.accent,
    },
    breakdownPercent: {
        fontSize: 12,
        color: COLORS.textSecondary,
        width: 36,
        textAlign: 'right',
    },
    breakdownPercentComplete: {
        color: COLORS.accent,
    },
    chartTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    axisLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    sleepStageItem: {
        width: '48%', // 2 columns
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    // Health Score Card Styles
    healthScoreCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    healthScoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    healthScoreTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    healthScoreContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    healthScoreRing: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    healthScoreValue: {
        fontSize: 48,
        fontWeight: '800',
    },
    healthScoreMax: {
        fontSize: 18,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    healthScoreBreakdown: {
        flex: 1,
        gap: 8,
    },
    scoreItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreItemLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flex: 1,
    },
    scoreItemValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    insightsContainer: {
        marginTop: 16,
        gap: 8,
    },
    insightBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    insightText: {
        fontSize: 13,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    // Water Tracker Styles
    waterCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    waterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    waterTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    waterTitleText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    waterProgress: {
        fontSize: 14,
        color: COLORS.cyan,
        fontWeight: '600',
    },
    waterGlasses: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    waterGlass: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceLight,
    },
    waterGlassFilled: {
        backgroundColor: COLORS.cyan + '30',
    },
    addWaterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cyan,
        borderRadius: 10,
        paddingVertical: 10,
        gap: 6,
    },
    addWaterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
    },
    // BMI Styles
    bmiIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
    },
    bmiValue: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    bmiCategory: {
        fontSize: 11,
        fontWeight: '500',
    },
    // Weekly Comparison Styles
    comparisonCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 14,
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    comparisonLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    comparisonValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    comparisonChange: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    comparisonPercent: {
        fontSize: 12,
        fontWeight: '500',
    },
    comparisonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    // Streak Styles
    streakCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    streakIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.orange + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakContent: {
        flex: 1,
    },
    streakLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    streakValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.orange,
    },
    streakDays: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
});
