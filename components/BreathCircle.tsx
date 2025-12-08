import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions } from 'react-native';

interface BreathCircleProps {
    isActive: boolean;
    instruction: string; // 'Inhale' | 'Exhale' | 'Hold'
}

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

export function BreathCircle({ isActive, instruction }: BreathCircleProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        if (!isActive) {
            scaleAnim.setValue(1);
            fadeAnim.setValue(0.4);
            return;
        }

        const animate = () => {
            if (instruction === 'Inhale') {
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1.3,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.8,
                        duration: 4000,
                        useNativeDriver: true,
                    })
                ]).start();
            } else if (instruction === 'Exhale') {
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.4,
                        duration: 4000,
                        useNativeDriver: true,
                    })
                ]).start();
            } else if (instruction === 'Hold') {
                // Keep current state
            }
        };

        animate();
    }, [instruction, isActive]);

    return (
        <View style={styles.container}>
            {/* Outer Static Circle */}
            <View style={styles.outerCircle} />

            {/* Animated Inner Circle */}
            <Animated.View
                style={[
                    styles.animatedCircle,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim
                    }
                ]}
            />

            {/* Instruction Text */}
            <View style={styles.textContainer}>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 2,
        borderColor: '#FFFFFF20',
        zIndex: 1
    },
    animatedCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: '#CCFF00', // Accent color
        zIndex: 0
    },
    textContainer: {
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    instructionText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2
    }
});
