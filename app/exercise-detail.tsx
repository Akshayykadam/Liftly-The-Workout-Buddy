import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F'
} as const;

export default function ExerciseDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Parse the exercise data passed as a string
    const exercise = params.exercise ? JSON.parse(params.exercise as string) : null;

    if (!exercise) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: 40 }} />
                <Text style={styles.headerTitle}>Exercise Details</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                    <X size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {/* Top Section: Image */}
                {exercise.image && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={exercise.image}
                            style={styles.exerciseImage}
                            resizeMode="contain"
                        />
                    </View>
                )}

                {/* Middle Section: Scrollable Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>{exercise.name}</Text>
                    <Text style={styles.muscle}>{exercise.targetMuscle}</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How to Perform</Text>
                        {exercise.howToPerform && exercise.howToPerform.map((step: string, index: number) => (
                            <View key={`instruction-${index}`} style={styles.stepContainer}>
                                <Text style={styles.stepNumber}>{index + 1}.</Text>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Do's ✓</Text>
                        {exercise.dos && exercise.dos.map((item: string, index: number) => (
                            <View key={`do-${index}`} style={styles.bulletContainer}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Don'ts ✗</Text>
                        {exercise.donts && exercise.donts.map((item: string, index: number) => (
                            <View key={`dont-${index}`} style={styles.bulletContainer}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Benefits</Text>
                        {exercise.benefits && exercise.benefits.map((item: string, index: number) => (
                            <View key={`benefit-${index}`} style={styles.bulletContainer}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Section: Fixed Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.gotItButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.gotItButtonText}>Got it</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.surface
    },
    contentContainer: {
        flex: 1, // Takes up all space between Header and Footer
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000000',
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    exerciseImage: {
        width: '80%',
        height: '80%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40 // Extra padding at end of scroll
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    muscle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.accent,
        marginBottom: 28
    },
    section: {
        marginBottom: 28
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 12
    },
    stepNumber: {
        fontSize: 15,
        fontWeight: '700',
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
        flexDirection: 'row',
        marginBottom: 10
    },
    bullet: {
        fontSize: 16,
        fontWeight: '700',
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
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.black
    },
    gotItButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center'
    },
    gotItButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black
    }
});
