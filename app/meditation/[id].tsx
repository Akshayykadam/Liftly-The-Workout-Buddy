import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Play, Pause, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MEDITATIONS } from '@/constants/mindfulness';
import { BreathCircle } from '@/components/BreathCircle';

const COLORS = {
    black: '#000000',
    surface: '#1A1A1A',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0'
};

export default function MeditationScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const session = MEDITATIONS.find(m => m.id === id);

    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(session ? session.duration * 60 : 0);
    const [instruction, setInstruction] = useState<'Inhale' | 'Exhale' | 'Hold'>('Inhale');
    const [isCompleted, setIsCompleted] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsActive(false);
                        setIsCompleted(true);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Breathing Logic (4s Inhale, 4s Exhale)
    useEffect(() => {
        let breathInterval: NodeJS.Timeout;
        if (isActive) {
            // Initial instruction is already 'Inhale' from state default or previous
            // We need to toggle every 4 seconds
            breathInterval = setInterval(() => {
                setInstruction(prev => prev === 'Inhale' ? 'Exhale' : 'Inhale');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }, 4000);
        }
        return () => clearInterval(breathInterval);
    }, [isActive]);

    if (!session) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleClose = () => {
        router.back();
    };

    const toggleSession = () => {
        setIsActive(!isActive);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{session.title}</Text>
                <View style={{ width: 40 }} />
            </View>

            {isCompleted ? (
                <View style={styles.completedContainer}>
                    <View style={styles.checkCircle}>
                        <Check size={48} color={COLORS.black} />
                    </View>
                    <Text style={styles.completedTitle}>Namaste</Text>
                    <Text style={styles.completedText}>Session completed.</Text>
                    <TouchableOpacity style={styles.button} onPress={handleClose}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.content}>
                    <View style={styles.animationContainer}>
                        <BreathCircle isActive={isActive} instruction={instruction} />
                    </View>

                    <View style={styles.controls}>
                        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
                        <Text style={styles.instructionSub}>
                            {isActive ? (instruction === 'Inhale' ? 'Breathe in...' : 'Breathe out...') : 'Ready to start?'}
                        </Text>

                        <TouchableOpacity style={styles.playButton} onPress={toggleSession}>
                            {isActive ? (
                                <Pause size={32} color={COLORS.black} fill={COLORS.black} />
                            ) : (
                                <Play size={32} color={COLORS.black} fill={COLORS.black} style={{ marginLeft: 4 }} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
        paddingVertical: 10
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 40
    },
    animationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300
    },
    controls: {
        alignItems: 'center',
        width: '100%'
    },
    timer: {
        fontSize: 48,
        fontWeight: '700',
        color: COLORS.textPrimary,
        fontVariant: ['tabular-nums'],
        marginBottom: 8
    },
    instructionSub: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 40
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    completedContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32
    },
    checkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32
    },
    completedTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    completedText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 48
    },
    button: {
        backgroundColor: COLORS.surface,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.textSecondary
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary
    }
});
