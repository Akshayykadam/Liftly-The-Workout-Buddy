import React, { useState, useEffect } from 'react';
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
    Calendar,
    Heart,
    Flame,
    Moon,
    Activity,
    Scale,
    Settings,
    AlertCircle,
} from 'lucide-react-native';
import { useHealthConnect } from '@/contexts/HealthConnectContext';
import { HealthPermissionsModal } from '@/components/HealthPermissionsModal';
import Svg, { Circle, Rect } from 'react-native-svg';
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
    red: '#EF4444',
    orange: '#F97316',
    purple: '#8B5CF6',
    green: '#22C55E',
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
                        {/* Today's Progress Ring */}
                        <View style={styles.ringContainer}>
                            <Svg width={RING_SIZE} height={RING_SIZE}>
                                <Circle
                                    cx={RING_SIZE / 2}
                                    cy={RING_SIZE / 2}
                                    r={radius}
                                    stroke={COLORS.surface}
                                    strokeWidth={STROKE_WIDTH}
                                    fill="none"
                                />
                                <Circle
                                    cx={RING_SIZE / 2}
                                    cy={RING_SIZE / 2}
                                    r={radius}
                                    stroke={COLORS.accent}
                                    strokeWidth={STROKE_WIDTH}
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    rotation="-90"
                                    origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                                />
                            </Svg>
                            <View style={styles.ringContent}>
                                <Text style={styles.stepsCount}>{currentSteps.toLocaleString()}</Text>
                                <Text style={styles.stepsLabel}>steps today</Text>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Target size={18} color={COLORS.blue} />
                                <Text style={styles.statValue}>{stepGoal.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Goal</Text>
                            </View>
                            <View style={styles.statCard}>
                                <TrendingUp size={18} color={COLORS.accent} />
                                <Text style={styles.statValue}>{Math.round(stepProgress)}%</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Calendar size={18} color={COLORS.textSecondary} />
                                <Text style={styles.statValue}>{weeklyAverage.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Avg/Day</Text>
                            </View>
                        </View>

                        {/* Weekly Chart */}
                        {weeklyData.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Last 7 Days</Text>
                                <View style={styles.chartContainer}>
                                    <Svg width={SCREEN_WIDTH - 72} height={120}>
                                        {weeklyData.map((day, index) => {
                                            const barWidth = (SCREEN_WIDTH - 112) / 7 - 6;
                                            const barMaxHeight = 90;
                                            const barHeight = maxSteps > 0
                                                ? (day.steps / maxSteps) * barMaxHeight
                                                : 0;
                                            const x = index * ((SCREEN_WIDTH - 112) / 7) + 12;
                                            const isToday = index === 6;

                                            return (
                                                <React.Fragment key={index}>
                                                    <Rect
                                                        x={x}
                                                        y={100 - barHeight}
                                                        width={barWidth}
                                                        height={Math.max(barHeight, 4)}
                                                        rx={4}
                                                        fill={isToday ? COLORS.accent : COLORS.surfaceLight}
                                                    />
                                                </React.Fragment>
                                            );
                                        })}
                                    </Svg>
                                    <View style={styles.chartLabels}>
                                        {weeklyData.map((day, index) => (
                                            <Text
                                                key={index}
                                                style={[
                                                    styles.chartLabel,
                                                    index === 6 && styles.chartLabelActive
                                                ]}
                                            >
                                                {day.dayName}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Heart Rate (Android only) */}
                        {showHealthConnectFeatures && heartRateData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Heart Rate</Text>
                                <View style={styles.heartRateCard}>
                                    <View style={styles.heartRateMain}>
                                        <Heart size={28} color={COLORS.red} fill={COLORS.red} />
                                        <Text style={styles.heartRateValue}>
                                            {heartRateData.current || heartRateData.resting || '--'}
                                        </Text>
                                        <Text style={styles.heartRateUnit}>bpm</Text>
                                    </View>
                                    {heartRateData.resting && (
                                        <View style={styles.heartRateResting}>
                                            <Text style={styles.heartRateRestingLabel}>Resting</Text>
                                            <Text style={styles.heartRateRestingValue}>
                                                {heartRateData.resting} bpm
                                            </Text>
                                        </View>
                                    )}
                                </View>
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

                        {/* Exercise Sessions (Android only) */}
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
    const dateStr = new Date(session.startTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <View style={styles.exerciseCard}>
            <View style={styles.exerciseIcon}>
                <Activity size={20} color={COLORS.blue} />
            </View>
            <View style={styles.exerciseContent}>
                <Text style={styles.exerciseType}>
                    {session.title || formatExerciseType(session.exerciseType)}
                </Text>
                <Text style={styles.exerciseDetails}>
                    {formatDuration(session.durationMinutes)}
                    {session.distanceMeters && ` • ${(session.distanceMeters / 1000).toFixed(1)}km`}
                    {session.activeCalories && ` • ${Math.round(session.activeCalories)} cal`}
                </Text>
            </View>
            <Text style={styles.exerciseDate}>{dateStr}</Text>
        </View>
    );
};

// Sleep Card Component
const SleepCard: React.FC<{ session: { durationMinutes: number; startTime: string; endTime: string; stages?: SleepStage[] } }> = ({ session }) => {
    const hours = Math.floor(session.durationMinutes / 60);
    const mins = session.durationMinutes % 60;

    // Calculate stage durations
    const stageDurations = session.stages?.reduce((acc, stage) => {
        acc[stage.stage] = (acc[stage.stage] || 0) + stage.durationMinutes;
        return acc;
    }, {} as Record<string, number>) || {};

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
            {Object.keys(stageDurations).length > 0 && (
                <View style={styles.sleepStages}>
                    {stageDurations.DEEP && (
                        <View style={styles.sleepStage}>
                            <View style={[styles.stageIndicator, { backgroundColor: '#3B82F6' }]} />
                            <Text style={styles.stageLabel}>Deep</Text>
                            <Text style={styles.stageDuration}>{formatDuration(stageDurations.DEEP)}</Text>
                        </View>
                    )}
                    {stageDurations.LIGHT && (
                        <View style={styles.sleepStage}>
                            <View style={[styles.stageIndicator, { backgroundColor: '#60A5FA' }]} />
                            <Text style={styles.stageLabel}>Light</Text>
                            <Text style={styles.stageDuration}>{formatDuration(stageDurations.LIGHT)}</Text>
                        </View>
                    )}
                    {stageDurations.REM && (
                        <View style={styles.sleepStage}>
                            <View style={[styles.stageIndicator, { backgroundColor: COLORS.purple }]} />
                            <Text style={styles.stageLabel}>REM</Text>
                            <Text style={styles.stageDuration}>{formatDuration(stageDurations.REM)}</Text>
                        </View>
                    )}
                    {stageDurations.AWAKE && (
                        <View style={styles.sleepStage}>
                            <View style={[styles.stageIndicator, { backgroundColor: COLORS.orange }]} />
                            <Text style={styles.stageLabel}>Awake</Text>
                            <Text style={styles.stageDuration}>{formatDuration(stageDurations.AWAKE)}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
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
    // Heart Rate
    heartRateCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heartRateMain: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
    },
    heartRateValue: {
        fontSize: 36,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    heartRateUnit: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    heartRateResting: {
        alignItems: 'flex-end',
    },
    heartRateRestingLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    heartRateRestingValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
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
    // Exercise
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    exerciseIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    exerciseContent: {
        flex: 1,
    },
    exerciseType: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    exerciseDetails: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    exerciseDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
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
});
