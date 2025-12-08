import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    ChevronLeft,
    Activity,
    Moon,
    Heart,
    Droplets,
    Footprints,
    MapPin
} from 'lucide-react-native';
import { useHealthData } from '@/hooks/useHealthData';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F',
    red: '#FF4757',
    green: '#2ED573',
    blue: '#3742FA'
} as const;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HealthScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data: healthData, loading } = useHealthData();
    const hasData = healthData && Object.keys(healthData).length > 0;

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
                <Text style={styles.headerTitle}>Life Profile</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <View style={styles.emptyState}>
                        <Activity size={48} color={COLORS.accent} />
                        <Text style={styles.emptyTitle}>Syncing Health Data...</Text>
                    </View>
                ) : hasData ? (
                    <View style={styles.healthGrid}>
                        {/* Calories */}
                        {healthData.calories && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.red + '20' }]}>
                                    <Activity size={20} color={COLORS.red} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{healthData.calories}</Text>
                                    <Text style={styles.healthLabel}>Kcal Burned</Text>
                                </View>
                            </View>
                        )}

                        {/* Steps */}
                        {healthData.steps && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.blue + '20' }]}>
                                    <Footprints size={20} color={COLORS.blue} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{healthData.steps.toLocaleString()}</Text>
                                    <Text style={styles.healthLabel}>Steps Today</Text>
                                </View>
                            </View>
                        )}

                        {/* Sleep */}
                        {healthData.sleep && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.blue + '20' }]}>
                                    <Moon size={20} color={COLORS.blue} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{healthData.sleep.hours}h</Text>
                                    <Text style={styles.healthLabel}>Sleep</Text>
                                </View>
                            </View>
                        )}

                        {/* Heart Rate */}
                        {healthData.heartRate && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.red + '20' }]}>
                                    <Heart size={20} color={COLORS.red} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{healthData.heartRate.avg} <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>bpm</Text></Text>
                                    <Text style={styles.healthLabel}>Avg Heart Rate</Text>
                                </View>
                            </View>
                        )}

                        {/* Distance */}
                        {healthData.distance && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.green + '20' }]}>
                                    <MapPin size={20} color={COLORS.green} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{(healthData.distance / 1000).toFixed(2)}</Text>
                                    <Text style={styles.healthLabel}>Km Moved</Text>
                                </View>
                            </View>
                        )}

                        {/* Hydration */}
                        {healthData.fluids && (
                            <View style={styles.healthCard}>
                                <View style={[styles.healthIcon, { backgroundColor: COLORS.blue + '20' }]}>
                                    <Droplets size={20} color={COLORS.blue} />
                                </View>
                                <View>
                                    <Text style={styles.healthValue}>{healthData.fluids}</Text>
                                    <Text style={styles.healthLabel}>ml Water</Text>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Activity size={48} color={COLORS.textSecondary} />
                        <Text style={styles.emptyTitle}>Data not available</Text>
                        <Text style={styles.emptyDescription}>
                            We couldn't find any health data. Make sure you have granted permissions and have data in Health Connect.
                        </Text>
                    </View>
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
        paddingBottom: 20,
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
    content: {
        padding: 20,
    },
    healthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    healthCard: {
        width: (SCREEN_WIDTH - 40 - 12) / 2,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    healthIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    healthValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 2
    },
    healthLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500'
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        maxWidth: 250,
        lineHeight: 20,
    }
});
