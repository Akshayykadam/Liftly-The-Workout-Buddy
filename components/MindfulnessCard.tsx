import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';

interface MindfulnessCardProps {
    title: string;
    description: string;
    duration: number;
    color: string;
    type: 'Meditation' | 'Yoga';
    onPress: () => void;
}

export function MindfulnessCard({ title, description, duration, color, type, onPress }: MindfulnessCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.colorStrip, { backgroundColor: color }]} />
            <View style={styles.content}>
                <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color: color }]}>{type}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>

                <View style={styles.footer}>
                    <View style={styles.durationContainer}>
                        <Clock size={14} color="#A0A0A0" />
                        <Text style={styles.duration}>{duration} min</Text>
                    </View>
                    <ChevronRight size={20} color="#A0A0A0" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333'
    },
    colorStrip: {
        width: 6,
        height: '100%'
    },
    content: {
        flex: 1,
        padding: 16
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600'
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4
    },
    description: {
        fontSize: 14,
        color: '#A0A0A0',
        marginBottom: 12,
        lineHeight: 20
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    duration: {
        fontSize: 14,
        color: '#A0A0A0',
        fontWeight: '500'
    }
});
