import React, { useState, useMemo } from 'react';
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    Footprints,
    Target,
    TrendingUp,
    Calendar,
    Heart,
    Flame,
    Moon,
    Activity,
    Scale,
    Settings,
    AlertCircle,
    Droplets,
    Zap,
    Plus,
    Sparkles,
    Award,
    Timer,
    Dumbbell,
    Navigation,
} from 'lucide-react-native';
import { useHealthConnect } from '@/contexts/HealthConnectContext';
import { HealthPermissionsModal } from '@/components/HealthPermissionsModal';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';
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
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = SCREEN_WIDTH * 0.4;
const STROKE_WIDTH = 10;

// Calculate health score
const calculateHealthScore = (
    steps: number,
    stepGoal: number,
    sleepMinutes: number,
    exerciseMinutes: number,
    heartRate?: number
) => {
    const stepsScore = Math.min((steps / stepGoal) * 100, 100);
    const sleepScore = sleepMinutes >= 420 && sleepMinutes <= 540 ? 100 : Math.max(0, (sleepMinutes / 420) * 100);
    const exerciseScore = Math.min((exerciseMinutes / 30) * 100, 100);
    let heartRateScore = 75;
    if (heartRate && heartRate >= 60 && heartRate <= 80) heartRateScore = 100;

    const overall = Math.round(stepsScore * 0.3 + sleepScore * 0.3 + exerciseScore * 0.25 + heartRateScore * 0.15);

    return {
        overall,
        breakdown: {
            steps: Math.round(stepsScore),
            sleep: Math.round(sleepScore),
            exercise: Math.round(exerciseScore),
            heartRate: Math.round(heartRateScore),
        },
    };
};

// Get health insights
const getHealthInsights = (steps: number, stepGoal: number, sleepMinutes: number, exerciseMinutes: number) => {
    const insights: { type: 'positive' | 'neutral' | 'warning'; message: string; icon: 'award' | 'footprints' | 'moon' | 'zap' }[] = [];
    const stepPercent = (steps / stepGoal) * 100;

    if (stepPercent >= 100) {
        insights.push({ type: 'positive', message: 'Step goal achieved!', icon: 'award' });
    } else if (stepPercent >= 75) {
        insights.push({ type: 'neutral', message: `${Math.round(stepGoal - steps).toLocaleString()} steps to go!`, icon: 'footprints' });
    }

    if (sleepMinutes >= 420) {
        insights.push({ type: 'positive', message: 'Great sleep last night!', icon: 'moon' });
    }

    if (exerciseMinutes >= 30) {
        insights.push({ type: 'positive', message: 'Workout complete!', icon: 'zap' });
    }

    return insights.slice(0, 2);
};

const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function HealthTabScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [waterGlasses, setWaterGlasses] = useState(0);
    const WATER_GOAL = 8;

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

    const stepsData = dashboardData.steps;
    const currentSteps = stepsData?.today || 0;
    const weeklyData = stepsData?.weeklyData || [];
    const weeklyAverage = stepsData?.weeklyAverage || 0;

    const heartRateData = dashboardData.heartRate;
    const caloriesData = dashboardData.calories;
    const exerciseData = dashboardData.exercise;
    const sleepData = dashboardData.sleep;
    const bodyData = dashboardData.body;

    const isWeb = Platform.OS === 'web';
    const showHealthConnectFeatures = isAndroid || isWeb;
    const needsPermissions = isAndroid && !isWeb && healthConnectStatus === 'available' && permissions.length === 0;

    // Health calculations
    const healthScore = useMemo(() => {
        const sleepMinutes = sleepData?.lastSession?.durationMinutes || 0;
        const exerciseMinutes = exerciseData?.todayDurationMinutes || 0;
        return calculateHealthScore(currentSteps, stepGoal, sleepMinutes, exerciseMinutes, heartRateData?.resting);
    }, [currentSteps, stepGoal, sleepData, exerciseData, heartRateData]);

    const insights = useMemo(() => {
        const sleepMinutes = sleepData?.lastSession?.durationMinutes || 0;
        const exerciseMinutes = exerciseData?.todayDurationMinutes || 0;
        return getHealthInsights(currentSteps, stepGoal, sleepMinutes, exerciseMinutes);
    }, [currentSteps, stepGoal, sleepData, exerciseData]);

    const bmiData = useMemo(() => {
        if (!bodyData?.weight?.value || !bodyData?.height?.value) return null;
        const bmi = bodyData.weight.value / Math.pow(bodyData.height.value / 100, 2);
        let category = 'Normal';
        let color: string = COLORS.green;
        if (bmi < 18.5) { category = 'Underweight'; color = COLORS.yellow; }
        else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = COLORS.orange; }
        else if (bmi >= 30) { category = 'Obese'; color = COLORS.red; }
        return { value: bmi.toFixed(1), category, color };
    }, [bodyData]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Health</Text>
                {showHealthConnectFeatures && (
                    <TouchableOpacity onPress={() => setPermissionsModalVisible(true)} style={styles.settingsButton}>
                        <Settings size={22} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
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
                            {isAndroid ? 'Health Connect Unavailable' : 'Health Data Unavailable'}
                        </Text>
                        <Text style={styles.unavailableDescription}>
                            {error || 'Please set up Health Connect to view health data.'}
                        </Text>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setPermissionsModalVisible(true)}>
                            <Text style={styles.actionButtonText}>Set Up</Text>
                        </TouchableOpacity>
                    </View>
                ) : needsPermissions ? (
                    <View style={styles.unavailableState}>
                        <Activity size={48} color={COLORS.accent} />
                        <Text style={styles.unavailableTitle}>Grant Permissions</Text>
                        <Text style={styles.unavailableDescription}>
                            Allow access to your health data from Health Connect.
                        </Text>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setPermissionsModalVisible(true)}>
                            <Text style={styles.actionButtonText}>Set Up Health Connect</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Compact Stats Row */}
                        {/* Health Score Card */}
                        <View style={styles.healthScoreCard}>
                            <View style={styles.healthScoreHeader}>
                                <Sparkles size={20} color={COLORS.accent} />
                                <Text style={styles.healthScoreTitle}>Today's Health Score</Text>
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
                                        const InsightIcon = insight.icon === 'award' ? Award : insight.icon === 'footprints' ? Footprints : insight.icon === 'moon' ? Moon : Zap;
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

                        {/* Steps Card - Linear Design */}
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


                        {/* Heart Rate */}
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
                                        <HeartRateChart data={heartRateData.history} />
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Calories */}
                        {showHealthConnectFeatures && caloriesData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Calories Burned</Text>
                                <View style={styles.caloriesRow}>
                                    <View style={styles.calorieCard}>
                                        <Flame size={20} color={COLORS.orange} />
                                        <Text style={styles.calorieValue}>{caloriesData.active}</Text>
                                        <Text style={styles.calorieLabel}>Active</Text>
                                    </View>
                                    <View style={styles.calorieCard}>
                                        <Flame size={20} color={COLORS.textSecondary} />
                                        <Text style={styles.calorieValue}>{caloriesData.basal}</Text>
                                        <Text style={styles.calorieLabel}>BMR</Text>
                                    </View>
                                    <View style={styles.calorieCard}>
                                        <Flame size={20} color={COLORS.accent} />
                                        <Text style={styles.calorieValue}>{caloriesData.total}</Text>
                                        <Text style={styles.calorieLabel}>Total</Text>
                                    </View>
                                </View>
                            </View>
                        )}



                        {/* Recent Workouts */}
                        {showHealthConnectFeatures && exerciseData && exerciseData.recentSessions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Workouts</Text>
                                {exerciseData.recentSessions.slice(0, 3).map((session, index) => {
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
                                        <View key={session.id || index} style={styles.workoutCard}>
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
                                })}
                            </View>
                        )}

                        {/* Sleep */}
                        {showHealthConnectFeatures && sleepData?.recentSessions && sleepData.recentSessions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Sleep</Text>
                                {sleepData.recentSessions.map((session, index) => {
                                    // Helper function for sleep stage color
                                    const getStageColor = (stage: string) => {
                                        switch (stage) {
                                            case 'DEEP': return '#3D3B8E';
                                            case 'LIGHT': return '#6D67E4';
                                            case 'REM': return '#9F97F7';
                                            case 'AWAKE': return '#FFAB76';
                                            default: return COLORS.border;
                                        }
                                    };

                                    const isLast = index === sleepData.recentSessions!.length - 1;
                                    const dateLabel = new Date(session.endTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                                    return (
                                        <View key={session.id || index} style={[styles.sleepCard, !isLast && { marginBottom: 16 }]}>
                                            <View style={styles.sleepHeader}>
                                                <View style={styles.sleepIconContainer}>
                                                    <Moon size={24} color={COLORS.purple} />
                                                </View>
                                                <View>
                                                    <View style={styles.sleepDurationRow}>
                                                        <Text style={styles.sleepHours}>
                                                            {formatDuration(session.durationMinutes)}
                                                        </Text>
                                                        <Text style={styles.sleepLabel}>Duration • {dateLabel}</Text>
                                                    </View>
                                                    <Text style={styles.sleepTime}>
                                                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Sleep Stages Visualization */}
                                            {session.stages && session.stages.length > 0 && (
                                                <View style={{ marginTop: 16 }}>
                                                    <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', width: '100%', backgroundColor: COLORS.surfaceLight }}>
                                                        {[...session.stages].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((stage, idx) => {
                                                            const totalDuration = session.durationMinutes;
                                                            if (!totalDuration || totalDuration <= 0) return null;

                                                            const widthPercent = (stage.durationMinutes / totalDuration) * 100;
                                                            const backgroundColor = getStageColor(stage.stage);

                                                            if (widthPercent <= 0) return null;

                                                            return (
                                                                <View
                                                                    key={idx}
                                                                    style={{
                                                                        width: `${widthPercent}%`,
                                                                        backgroundColor,
                                                                        height: '100%'
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </View>

                                                    {/* Legend */}
                                                    {/* Legend */}
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 }}>
                                                        <View style={styles.sleepStageLegendItem}>
                                                            <View style={[styles.sleepLegendDot, { backgroundColor: '#3D3B8E' }]} />
                                                            <Text style={styles.sleepLegendText}>Deep</Text>
                                                        </View>
                                                        <View style={styles.sleepStageLegendItem}>
                                                            <View style={[styles.sleepLegendDot, { backgroundColor: '#6D67E4' }]} />
                                                            <Text style={styles.sleepLegendText}>Light</Text>
                                                        </View>
                                                        <View style={styles.sleepStageLegendItem}>
                                                            <View style={[styles.sleepLegendDot, { backgroundColor: '#9F97F7' }]} />
                                                            <Text style={styles.sleepLegendText}>REM</Text>
                                                        </View>
                                                        <View style={styles.sleepStageLegendItem}>
                                                            <View style={[styles.sleepLegendDot, { backgroundColor: '#FFAB76' }]} />
                                                            <Text style={styles.sleepLegendText}>Awake</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Body */}
                        {showHealthConnectFeatures && bodyData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Body Measurements</Text>
                                <View style={styles.bodyRow}>
                                    {bodyData.weight && (
                                        <View style={styles.bodyCard}>
                                            <Scale size={18} color={COLORS.green} />
                                            <Text style={styles.bodyValue}>{bodyData.weight.value.toFixed(1)}</Text>
                                            <Text style={styles.bodyUnit}>kg</Text>
                                        </View>
                                    )}
                                    {bodyData.height && (
                                        <View style={styles.bodyCard}>
                                            <Activity size={18} color={COLORS.blue} />
                                            <Text style={styles.bodyValue}>{bodyData.height.value.toFixed(0)}</Text>
                                            <Text style={styles.bodyUnit}>cm</Text>
                                        </View>
                                    )}
                                    {bmiData && (
                                        <View style={styles.bodyCard}>
                                            <Scale size={18} color={bmiData.color} />
                                            <Text style={styles.bodyValue}>{bmiData.value}</Text>
                                            <Text style={[styles.bodyUnit, { color: bmiData.color }]}>BMI</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <HealthPermissionsModal
                visible={permissionsModalVisible}
                onClose={() => setPermissionsModalVisible(false)}
            />
        </View>
    );
}

// Heart Rate Chart Component
const HeartRateChart = ({ data }: { data: Array<{ date: Date; min: number; max: number; avg: number }> }) => {
    const height = 120;
    const width = SCREEN_WIDTH - 96; // Reduced width to fit within padded container
    const padding = { top: 15, bottom: 25, left: 30, right: 15 };

    const chartData = useMemo(() => {
        if (data.length === 0) return null;

        // If only 1 data point, duplicate it to create a flat line or handle specifically
        let processData = [...data];
        if (processData.length === 1) {
            // Push a dummy point to make a line
            processData.push({ ...processData[0], date: new Date(processData[0].date.getTime() + 1000) });
        }

        const allMins = processData.map(d => d.min);
        const allMaxs = processData.map(d => d.max);

        // Add more breathing room
        const minVal = Math.min(...allMins) - 5;
        const maxVal = Math.max(...allMaxs) + 5;
        const yRange = maxVal - minVal || 10; // Ensure range is never 0

        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const points = processData.map((d, i) => {
            // Distribute points evenly
            const x = padding.left + (i / (processData.length - 1)) * chartWidth;
            const y = padding.top + (1 - (d.avg - minVal) / yRange) * chartHeight;
            return { x, y, ...d };
        });

        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        return { points, path, minVal, maxVal };
    }, [data, width, height]);

    if (!chartData) return null;

    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={COLORS.red} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={COLORS.red} stopOpacity="0" />
                </LinearGradient>
            </Defs>
            <Path d={chartData.path} stroke={COLORS.red} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            {chartData.points.map((point, i) => (
                <Circle
                    key={i}
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
    container: { flex: 1, backgroundColor: COLORS.black },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 10 },
    headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
    settingsButton: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    loadingText: { fontSize: 16, color: COLORS.textSecondary },
    unavailableState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    unavailableTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16, marginBottom: 8 },
    unavailableDescription: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', maxWidth: 280 },
    actionButton: { marginTop: 20, backgroundColor: COLORS.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    actionButtonText: { fontSize: 15, fontWeight: '700', color: COLORS.black },
    // Health Score
    healthScoreCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
    healthScoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    healthScoreTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
    healthScoreContent: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    healthScoreRing: { flexDirection: 'row', alignItems: 'baseline' },
    healthScoreValue: { fontSize: 48, fontWeight: '800' },
    healthScoreMax: { fontSize: 18, color: COLORS.textSecondary, fontWeight: '500' },
    healthScoreBreakdown: { flex: 1, gap: 8 },
    scoreItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    scoreItemLabel: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
    scoreItemValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    insightsContainer: { marginTop: 16, gap: 8 },
    insightBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
    insightText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
    // Ring (kept for reference, can be removed)
    ringContainer: { width: RING_SIZE, height: RING_SIZE, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 8 },
    ringContent: { position: 'absolute', alignItems: 'center' },
    stepsCount: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary },
    stepsLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    // New Steps Card Linear Design
    stepsCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginTop: 16, borderWidth: 1, borderColor: COLORS.border },
    stepsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    stepsCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepsCardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
    stepsCardValue: { fontSize: 14, fontWeight: '700', color: COLORS.accent },
    stepsProgressBarContainer: { height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
    stepsProgressBar: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 6 },
    stepsStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    stepsStatItem: { alignItems: 'center' },
    stepsStatValue: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    stepsStatLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4 },
    // Stats
    statsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
    statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    statValue: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginTop: 6 },
    statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
    // Section
    section: { marginTop: 28 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
    chartContainer: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: COLORS.border },
    // Heart Rate - Enhanced
    heartRateCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
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
    caloriesRow: { flexDirection: 'row', gap: 10 },
    calorieCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    calorieValue: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 },
    calorieLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    // Water
    waterCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
    waterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    waterTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    waterTitleText: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
    waterProgress: { fontSize: 14, color: COLORS.cyan, fontWeight: '600' },
    waterGlasses: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    waterGlass: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceLight },
    waterGlassFilled: { backgroundColor: COLORS.cyan + '30' },
    addWaterButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cyan, borderRadius: 10, paddingVertical: 10, gap: 6 },
    addWaterText: { fontSize: 14, fontWeight: '600', color: COLORS.black },
    // Exercise
    exerciseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
    exerciseIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    exerciseContent: { flex: 1 },
    exerciseType: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
    exerciseDetails: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    // Enhanced Workout Cards - Premium Design
    workoutCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
    workoutHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    workoutHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    workoutIconBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    workoutIconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    workoutHeaderText: { flex: 1 },
    workoutContent: { flex: 1 },
    workoutTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
    workoutDateTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
    workoutMapPlaceholder: { width: 70, height: 70, borderRadius: 12, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.accent + '40' },
    workoutIllustration: { width: 70, height: 70, alignItems: 'center', justifyContent: 'center' },
    workoutStatsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    workoutStatItem: { flex: 1, alignItems: 'center' },
    workoutStatValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    workoutStats: { flexDirection: 'row', gap: 20, marginTop: 12 },
    workoutStatsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
    workoutStatBox: { alignItems: 'center', minWidth: 60 },
    workoutStatValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
    workoutStatLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6, marginBottom: 8 },
    workoutProgressBar: { width: '100%', height: 4, backgroundColor: COLORS.surfaceLight, borderRadius: 2, overflow: 'hidden' },
    workoutProgressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
    workoutNotes: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
    workoutNotesText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
    // Sleep
    sleepCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
    sleepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sleepDuration: { flex: 1 },
    sleepHours: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
    sleepTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    // Missing Sleep Styles
    sleepIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.purple + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    sleepDurationRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
    sleepLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
    sleepStagesContainer: { marginTop: 16, height: 50 },
    sleepStageBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', width: '100%' },
    sleepStageLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
    sleepStageLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    sleepLegendDot: { width: 6, height: 6, borderRadius: 3 },
    sleepLegendText: { fontSize: 10, color: COLORS.textSecondary },
    // Body
    bodyRow: { flexDirection: 'row', gap: 10 },
    bodyCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    bodyValue: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 },
    bodyUnit: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});
