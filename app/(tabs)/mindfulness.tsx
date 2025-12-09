import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MindfulnessCard } from '@/components/MindfulnessCard';
import { MEDITATIONS, YOGA_ROUTINES } from '@/constants/mindfulness';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    textPrimary: '#FFFFFF',
    accent: '#CCFF00',
    textSecondary: '#A0A0A0'
};

export default function MindfulnessScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [completedIds, setCompletedIds] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadProgress = async () => {
                try {
                    const today = new Date().toISOString().split('T')[0];
                    const key = `yoga_progress_${today}`;
                    const existing = await AsyncStorage.getItem(key);
                    const completed = existing ? JSON.parse(existing) : [];
                    setCompletedIds(completed);
                } catch (e) {
                    console.error('Failed to load yoga progress', e);
                }
            };
            loadProgress();
        }, [])
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mind & Body</Text>
                <Text style={styles.headerSubtitle}>Find your center</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meditation</Text>
                    <Text style={styles.sectionSubtitle}>Quick mental resets</Text>

                    <View style={styles.list}>
                        {MEDITATIONS.map((item) => (
                            <MindfulnessCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                duration={item.duration}
                                color={item.color}
                                type="Meditation"
                                onPress={() => router.push({
                                    pathname: "/meditation/[id]",
                                    params: { id: item.id }
                                })}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yoga for Beginners</Text>
                    <Text style={[styles.sectionSubtitle, { color: completedIds.length > 0 ? COLORS.accent : COLORS.accent }]}>
                        {completedIds.length === 0
                            ? "Start your movement for today"
                            : `${completedIds.length} routine${completedIds.length === 1 ? '' : 's'} completed today`}
                    </Text>

                    <View style={styles.list}>
                        {YOGA_ROUTINES.map((item) => (
                            <MindfulnessCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                duration={item.duration}
                                color={item.color}
                                type="Yoga"
                                isCompleted={completedIds.includes(item.id)}
                                onPress={() => router.push({
                                    pathname: "/yoga/[id]",
                                    params: { id: item.id }
                                })}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary
    },
    scrollView: {
        flex: 1
    },
    content: {
        paddingHorizontal: 20
    },
    section: {
        marginBottom: 32
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.accent,
        marginBottom: 16
    },
    list: {
        gap: 0
    }
});
