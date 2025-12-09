import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, AlertCircle, Sparkles } from 'lucide-react-native';
import { YOGA_ROUTINES } from '@/constants/mindfulness';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    black: '#000000',
    surface: '#1A1A1A',
    card: '#222222',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#333'
};

export default function YogaScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const routine = YOGA_ROUTINES.find(r => r.id === id);

    const handleFinish = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const key = `yoga_progress_${today}`;
            const existing = await AsyncStorage.getItem(key);
            const completed = existing ? JSON.parse(existing) : [];

            if (id && !completed.includes(id)) {
                const updated = [...completed, id];
                await AsyncStorage.setItem(key, JSON.stringify(updated));
            }
        } catch (e) {
            console.error('Failed to save progress', e);
        }
        router.back();
    };

    if (!routine) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Yoga Flow</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.titleSection}>
                    <View style={[styles.difficultyBadge, { backgroundColor: routine.color + '20' }]}>
                        <Text style={[styles.difficultyText, { color: routine.color }]}>
                            {routine.difficulty}
                        </Text>
                    </View>
                    <Text style={styles.title}>{routine.title}</Text>
                    <Text style={styles.description}>{routine.description}</Text>

                    <View style={styles.metaRow}>
                        <Clock size={16} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{routine.duration} min</Text>
                    </View>
                </View>

                <Text style={styles.sectionHeader}>Poses ({routine.poses.length})</Text>

                <View style={styles.poseList}>
                    {routine.poses.map((pose, index) => (
                        <View key={index} style={styles.poseCard}>
                            <View style={styles.poseHeader}>
                                <View style={styles.poseNumber}>
                                    <Text style={styles.poseNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.poseName}>{pose.name}</Text>
                                <View style={styles.poseDuration}>
                                    <Clock size={14} color={COLORS.accent} />
                                    <Text style={styles.poseTime}>{pose.duration}</Text>
                                </View>
                            </View>

                            {pose.image && (
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={pose.image}
                                        style={styles.exerciseImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}

                            <View style={styles.instructionList}>
                                {pose.instructions.map((inst, i) => (
                                    <View key={i} style={styles.instructionRow}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.instructionText}>{inst}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.alertBox}>
                                <View style={styles.alertHeader}>
                                    <AlertCircle size={14} color="#FF6B6B" />
                                    <Text style={styles.alertTitle}>Avoid</Text>
                                </View>
                                <Text style={styles.alertText}>{pose.avoid}</Text>
                            </View>

                            <View style={styles.benefitBox}>
                                <View style={styles.alertHeader}>
                                    <Sparkles size={14} color={COLORS.accent} />
                                    <Text style={[styles.alertTitle, { color: COLORS.accent }]}>Benefit</Text>
                                </View>
                                <Text style={styles.benefitText}>{pose.benefits}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleFinish}
                >
                    <Text style={styles.completeButtonText}>Finish Routine</Text>
                </TouchableOpacity>
            </ScrollView >
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.surface
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary
    },
    content: {
        padding: 20,
        paddingBottom: 40
    },
    titleSection: {
        marginBottom: 32
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '600'
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 16,
        lineHeight: 24
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500'
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 20
    },
    poseList: {
        gap: 16,
        marginBottom: 32
    },
    poseCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    poseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20
    },
    poseNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    poseNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary
    },
    poseName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        flex: 1
    },
    poseDuration: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    poseTime: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.accent
    },
    instructionList: {
        marginBottom: 20,
        gap: 12
    },
    instructionRow: {
        flexDirection: 'row',
        gap: 12
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.textSecondary,
        marginTop: 8
    },
    instructionText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22
    },
    alertBox: {
        backgroundColor: '#FF6B6B15',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
    },
    alertTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FF6B6B'
    },
    alertText: {
        fontSize: 13,
        color: '#FF6B6B',
        opacity: 0.9
    },
    benefitBox: {
        backgroundColor: COLORS.accent + '10',
        borderRadius: 12,
        padding: 12
    },
    benefitText: {
        fontSize: 13,
        color: COLORS.accent,
        opacity: 0.9
    },
    completeButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center'
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000000',
        borderRadius: 12,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    exerciseImage: {
        width: '80%',
        height: '80%',
    }

});
