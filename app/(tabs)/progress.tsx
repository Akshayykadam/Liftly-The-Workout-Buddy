import { useUser } from '@/contexts/UserContext';
import { useHealthConnect } from '@/contexts/HealthConnectContext';

import * as Haptics from 'expo-haptics';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Scale,
    Calendar,
    BarChart3,
    Plus,
    Check,
    Footprints
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, bottom: 30, left: 45, right: 10 };

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F',
    green: '#22C55E',
    red: '#EA4C89', // Use same red as other screens if possible, or keep as pinkish for weight
    blue: '#3742FA'
} as const;

export default function ProgressScreen() {
    const insets = useSafeAreaInsets();
    const {
        profile,
        weightHistory,
        logWeight,
        getTodayWeight,
        getWeightChange
    } = useUser();

    const { dashboardData } = useHealthConnect();
    const stepsHistory = dashboardData?.steps?.weeklyData || [];

    const [showLogModal, setShowLogModal] = useState(false);
    const todayWeight = getTodayWeight();
    const weightChange = getWeightChange();

    const handleLogWeight = (weight: number) => {
        logWeight(weight);
        setShowLogModal(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS.black }]}>
            <View style={{ paddingTop: insets.top + 16 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Progress</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowLogModal(true)}
                    >
                        <Plus size={24} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Today's Weight Card */}
                <TouchableOpacity
                    style={styles.logCard}
                    onPress={() => setShowLogModal(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.logCardHeader}>
                        <Scale size={24} color={COLORS.accent} />
                        <Text style={styles.logCardTitle}>Today's Weight</Text>
                    </View>
                    {todayWeight ? (
                        <View style={styles.logCardContent}>
                            <Text style={styles.logCardValue}>
                                {todayWeight.weight} {todayWeight.unit}
                            </Text>
                            <Text style={styles.logCardStatus}>✓ Logged today</Text>
                        </View>
                    ) : (
                        <View style={styles.logCardContent}>
                            <Text style={styles.logCardPrompt}>Tap to log your weight</Text>
                            <Text style={styles.logCardHint}>Track daily for best results</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Weight Change Summary */}
                {weightHistory.length >= 2 && (
                    <View style={styles.changeCard}>
                        <Text style={styles.sectionTitle}>Overall Progress</Text>
                        <View style={styles.changeStats}>
                            <View style={styles.changeStat}>
                                <Text style={styles.changeLabel}>Starting</Text>
                                <Text style={styles.changeValue}>{weightChange.startWeight} {profile.weightUnit}</Text>
                            </View>
                            <View style={styles.changeArrow}>
                                {weightChange.change > 0 ? (
                                    <TrendingUp size={24} color={profile.goal === 'gain' ? COLORS.green : COLORS.red} />
                                ) : weightChange.change < 0 ? (
                                    <TrendingDown size={24} color={profile.goal === 'loss' ? COLORS.green : COLORS.red} />
                                ) : (
                                    <Minus size={24} color={COLORS.textSecondary} />
                                )}
                            </View>
                            <View style={styles.changeStat}>
                                <Text style={styles.changeLabel}>Current</Text>
                                <Text style={styles.changeValue}>{weightChange.currentWeight} {profile.weightUnit}</Text>
                            </View>
                        </View>
                        <View style={styles.changeTotal}>
                            <Text style={[styles.changeTotalValue, {
                                color:
                                    (weightChange.change < 0 && profile.goal === 'loss') ||
                                        (weightChange.change > 0 && profile.goal === 'gain')
                                        ? COLORS.green
                                        : weightChange.change === 0
                                            ? COLORS.textSecondary
                                            : COLORS.red
                            }]}>
                                {weightChange.change > 0 ? '+' : ''}{weightChange.change.toFixed(1)} {profile.weightUnit}
                            </Text>
                            <Text style={styles.changeTotalPercent}>
                                ({weightChange.percentage > 0 ? '+' : ''}{weightChange.percentage.toFixed(1)}%)
                            </Text>
                        </View>
                    </View>
                )}

                {/* Weight Trend Chart */}
                {weightHistory.length >= 2 && (
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <BarChart3 size={20} color={COLORS.accent} />
                            <Text style={styles.chartTitle}>Weight Trend</Text>
                        </View>
                        <WeightChart data={weightHistory} unit={profile.weightUnit} />
                    </View>
                )}

                {/* Steps Trend Chart */}
                {stepsHistory.length > 0 && (
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Footprints size={20} color={COLORS.blue} />
                            <Text style={styles.chartTitle}>Steps Trend</Text>
                        </View>
                        <StepsChart data={stepsHistory} />
                    </View>
                )}

                {/* Empty State */}
                {weightHistory.length < 2 && (
                    <View style={styles.emptyState}>
                        <BarChart3 size={48} color={COLORS.textSecondary} strokeWidth={1.5} />
                        <Text style={styles.emptyTitle}>Start Tracking Your Progress</Text>
                        <Text style={styles.emptyDescription}>
                            Log your weight daily to see trends and insights.
                        </Text>
                    </View>
                )}
            </ScrollView>

            <LogWeightModal
                visible={showLogModal}
                currentWeight={todayWeight?.weight || profile.weight}
                unit={profile.weightUnit}
                onLog={handleLogWeight}
                onClose={() => setShowLogModal(false)}
            />
        </View>
    );
}

// Steps Chart Component
function StepsChart({ data }: { data: Array<{ date: Date; steps: number; dayName: string }> }) {
    const height = 150;
    const width = CHART_WIDTH;
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
}

// Weight Chart Component

interface WeightChartProps {
    data: Array<{ date: string; weight: number; unit: string }>;
    unit: string;
    height?: number;
    width?: number;
    showGrid?: boolean;
}

function WeightChart({ data, unit, height = 200, width = CHART_WIDTH, showGrid = true }: WeightChartProps) {
    const chartPadding = { top: 20, bottom: 30, left: showGrid ? 45 : 10, right: 10 };

    const chartData = useMemo(() => {
        // Sort by date
        const sorted = [...data]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (sorted.length === 0) return null;

        const weights = sorted.map(d => d.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);
        const range = maxWeight - minWeight || 1;
        const padding = range * 0.1;

        const yMin = minWeight - padding;
        const yMax = maxWeight + padding;
        const yRange = yMax - yMin;

        const chartInnerWidth = width - chartPadding.left - chartPadding.right;
        const chartInnerHeight = height - chartPadding.top - chartPadding.bottom;

        const points = sorted.map((d, i) => {
            const x = chartPadding.left + (i / Math.max(sorted.length - 1, 1)) * chartInnerWidth;
            const y = chartPadding.top + (1 - (d.weight - yMin) / yRange) * chartInnerHeight;
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

        return { points, path, areaPath, yMin, yMax, yRange };
    }, [data, height, width, chartPadding]);

    if (!chartData) return null;

    // Generate Y axis labels
    const yLabels = useMemo(() => {
        if (!showGrid) return [];
        const count = 4;
        const labels = [];
        for (let i = 0; i <= count; i++) {
            const value = chartData.yMin + (chartData.yRange * i / count);
            const y = height - chartPadding.bottom - (i / count) * (height - chartPadding.top - chartPadding.bottom);
            labels.push({ value: value.toFixed(1), y });
        }
        return labels;
    }, [chartData, height, showGrid, chartPadding]);

    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
                </LinearGradient>
            </Defs>

            {/* Grid lines */}
            {yLabels.map((label, i) => (
                <Line
                    key={i}
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
                    key={i}
                    x={chartPadding.left - 8}
                    y={label.y + 4}
                    fontSize={10}
                    fill={COLORS.textSecondary}
                    textAnchor="end"
                >
                    {label.value}
                </SvgText>
            ))}

            {/* Area fill */}
            <Path
                d={chartData.areaPath}
                fill="url(#chartGradient)"
            />

            {/* Line */}
            <Path
                d={chartData.path}
                stroke={COLORS.accent}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data points */}
            {chartData.points.map((point, i) => (
                <Circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={i === chartData.points.length - 1 ? 6 : 4}
                    fill={i === chartData.points.length - 1 ? COLORS.accent : COLORS.surface}
                    stroke={COLORS.accent}
                    strokeWidth={2}
                />
            ))}
        </Svg>
    );
}

interface LogWeightModalProps {
    visible: boolean;
    currentWeight: number;
    unit: string;
    onLog: (weight: number) => void;
    onClose: () => void;
}

function LogWeightModal({ visible, currentWeight, unit, onLog, onClose }: LogWeightModalProps) {
    const insets = useSafeAreaInsets();
    const [weight, setWeight] = useState(String(currentWeight));

    // Reset weight when modal opens
    React.useEffect(() => {
        if (visible) {
            setWeight(String(currentWeight));
        }
    }, [visible, currentWeight]);

    const handleLog = () => {
        const parsed = parseFloat(weight);
        if (parsed > 0) {
            onLog(parsed);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Log Today's Weight</Text>
                    <Text style={styles.modalDescription}>
                        Weigh yourself at the same time each day for accurate tracking.
                    </Text>

                    <View style={styles.weightInputContainer}>
                        <TextInput
                            style={styles.weightInput}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="decimal-pad"
                            autoFocus
                            selectTextOnFocus
                        />
                        <Text style={styles.weightInputUnit}>{unit}</Text>
                    </View>

                    <View style={styles.quickAdjust}>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => setWeight(String((parseFloat(weight) - 0.5).toFixed(1)))}
                        >
                            <Text style={styles.adjustButtonText}>-0.5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => setWeight(String((parseFloat(weight) - 0.1).toFixed(1)))}
                        >
                            <Text style={styles.adjustButtonText}>-0.1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => setWeight(String((parseFloat(weight) + 0.1).toFixed(1)))}
                        >
                            <Text style={styles.adjustButtonText}>+0.1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => setWeight(String((parseFloat(weight) + 0.5).toFixed(1)))}
                        >
                            <Text style={styles.adjustButtonText}>+0.5</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.logButton}
                        onPress={handleLog}
                        activeOpacity={0.8}
                    >
                        <Check size={20} color={COLORS.black} />
                        <Text style={styles.logButtonText}>Log Weight</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        letterSpacing: -0.5
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20
    },
    logCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    logCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16
    },
    logCardTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    logCardContent: {
        alignItems: 'center'
    },
    logCardValue: {
        fontSize: 48,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    logCardStatus: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.green
    },
    logCardPrompt: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: COLORS.accent,
        marginBottom: 8
    },
    logCardHint: {
        fontSize: 14,
        color: COLORS.textSecondary
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 16
    },
    changeCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    changeStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    changeStat: {
        flex: 1,
        alignItems: 'center'
    },
    changeLabel: {
        fontSize: 12,
        fontWeight: '500' as const,
        color: COLORS.textSecondary,
        marginBottom: 4
    },
    changeValue: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: COLORS.textPrimary
    },
    changeArrow: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    changeTotal: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: 8
    },
    changeTotalValue: {
        fontSize: 28,
        fontWeight: '700' as const
    },
    changeTotalPercent: {
        fontSize: 16,
        color: COLORS.textSecondary
    },
    chartCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textPrimary
    },
    reportCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    reportHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textPrimary,
        flex: 1
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600' as const
    },
    reportGrid: {
        flexDirection: 'row',
        gap: 12
    },
    reportItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.black,
        paddingVertical: 12,
        borderRadius: 12
    },
    reportValue: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    reportLabel: {
        fontSize: 11,
        fontWeight: '500' as const,
        color: COLORS.textSecondary
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginTop: 24,
        marginBottom: 12
    },
    emptyDescription: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22
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
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        paddingHorizontal: 24
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    modalDescription: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 32
    },
    weightInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24
    },
    weightInput: {
        fontSize: 56,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        textAlign: 'center',
        minWidth: 150
    },
    weightInputUnit: {
        fontSize: 24,
        fontWeight: '600' as const,
        color: COLORS.accent
    },
    quickAdjust: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32
    },
    adjustButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.black,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    adjustButtonText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 16
    },
    logButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: COLORS.black
    },

});
