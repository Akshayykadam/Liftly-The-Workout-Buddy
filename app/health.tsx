import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import {
    ChevronLeft,
    Footprints,
    Target,
    TrendingUp,
    Calendar
} from 'lucide-react-native';
import { useSteps } from '@/contexts/StepContext';
import Svg, { Circle, Rect } from 'react-native-svg';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F',
    blue: '#3742FA',
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = SCREEN_WIDTH * 0.5;
const STROKE_WIDTH = 14;

interface DaySteps {
    date: Date;
    steps: number;
    dayName: string;
}

export default function HealthScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { currentSteps, stepGoal, progress, isAvailable, isLoading } = useSteps();
    const [weeklyData, setWeeklyData] = useState<DaySteps[]>([]);
    const [weeklyLoading, setWeeklyLoading] = useState(true);

    const radius = (RING_SIZE - STROKE_WIDTH) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Fetch last 7 days of step data
    useEffect(() => {
        const fetchWeeklyData = async () => {
            if (!isAvailable) {
                setWeeklyLoading(false);
                return;
            }

            const days: DaySteps[] = [];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);

                try {
                    const result = await Pedometer.getStepCountAsync(date, endDate);
                    days.push({
                        date,
                        steps: result?.steps || 0,
                        dayName: dayNames[date.getDay()]
                    });
                } catch {
                    days.push({
                        date,
                        steps: 0,
                        dayName: dayNames[date.getDay()]
                    });
                }
            }

            setWeeklyData(days);
            setWeeklyLoading(false);
        };

        if (!isLoading) {
            fetchWeeklyData();
        }
    }, [isAvailable, isLoading]);

    const maxSteps = Math.max(...weeklyData.map(d => d.steps), stepGoal);
    const weekTotal = weeklyData.reduce((sum, d) => sum + d.steps, 0);
    const weekAverage = Math.round(weekTotal / 7);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <ChevronLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Activity</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : !isAvailable ? (
                    <View style={styles.unavailableState}>
                        <Footprints size={48} color={COLORS.textSecondary} />
                        <Text style={styles.unavailableTitle}>Step Counter Unavailable</Text>
                        <Text style={styles.unavailableDescription}>
                            Your device doesn't support step counting, or the permission was denied.
                        </Text>
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
                                <Text style={styles.statValue}>{Math.round(progress)}%</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Calendar size={18} color={COLORS.textSecondary} />
                                <Text style={styles.statValue}>{weekAverage.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Avg/Day</Text>
                            </View>
                        </View>

                        {/* Weekly Chart */}
                        <View style={styles.chartSection}>
                            <Text style={styles.sectionTitle}>Last 7 Days</Text>
                            {weeklyLoading ? (
                                <Text style={styles.loadingText}>Loading history...</Text>
                            ) : (
                                <View style={styles.chartContainer}>
                                    <Svg width={SCREEN_WIDTH - 40} height={140}>
                                        {weeklyData.map((day, index) => {
                                            const barWidth = (SCREEN_WIDTH - 80) / 7 - 8;
                                            const barMaxHeight = 100;
                                            const barHeight = maxSteps > 0
                                                ? (day.steps / maxSteps) * barMaxHeight
                                                : 0;
                                            const x = index * ((SCREEN_WIDTH - 80) / 7) + 20;
                                            const isToday = index === 6;

                                            return (
                                                <React.Fragment key={index}>
                                                    <Rect
                                                        x={x}
                                                        y={120 - barHeight}
                                                        width={barWidth}
                                                        height={barHeight}
                                                        rx={6}
                                                        fill={isToday ? COLORS.accent : COLORS.surface}
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
                            )}
                        </View>

                        {/* Daily Breakdown */}
                        <View style={styles.breakdownSection}>
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
        </View>
    );
}

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
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 40,
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
        maxWidth: 260,
        lineHeight: 20,
    },
    ringContainer: {
        width: RING_SIZE,
        height: RING_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    ringContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    stepsCount: {
        fontSize: 36,
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
        gap: 12,
        marginTop: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    chartSection: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
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
        width: (SCREEN_WIDTH - 80) / 7,
        textAlign: 'center',
    },
    chartLabelActive: {
        color: COLORS.accent,
        fontWeight: '600',
    },
    breakdownSection: {
        marginTop: 32,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
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
        gap: 16,
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
        width: 40,
        textAlign: 'right',
    },
    breakdownPercentComplete: {
        color: COLORS.accent,
    },
});
