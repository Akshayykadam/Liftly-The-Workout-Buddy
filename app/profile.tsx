import { useUser } from '@/contexts/UserContext';
import { useHealthConnect } from '@/contexts/HealthConnectContext';
import { useRouter } from 'expo-router';
import { getLevelInfo, type WorkoutLevel } from '@/constants';
import { Calendar, Bell } from 'lucide-react-native';
import { scheduleWorkoutReminders, type ReminderSettings } from '@/utils/notifications';
import * as Haptics from 'expo-haptics';
import {
    User,
    Edit3,
    Target,
    Ruler,
    Scale,
    TrendingDown,
    TrendingUp,
    Activity,
    ChevronRight,
    ChevronLeft,
    X,
    Check,
    Footprints
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { UserGoal } from '@/contexts/UserContext';

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

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { profile, calculateBMI, updateProfile, setLevel, setStartDayOfWeek } = useUser();
    const { stepGoal, setStepGoal } = useHealthConnect();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [showStepGoalModal, setShowStepGoalModal] = useState(false);
    const [showStartDayModal, setShowStartDayModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);

    const bmi = calculateBMI();
    const levelInfo = getLevelInfo(profile.level);
    const age = profile.birthYear ? new Date().getFullYear() - profile.birthYear : null;

    const getDayName = (day: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day] || 'Monday';
    };

    const getGoalInfo = (goal: UserGoal) => {
        switch (goal) {
            case 'loss':
                return { label: 'Weight Loss', icon: TrendingDown, color: COLORS.red };
            case 'gain':
                return { label: 'Build Muscle', icon: TrendingUp, color: COLORS.green };
            case 'maintenance':
                return { label: 'Stay Fit', icon: Activity, color: COLORS.blue };
        }
    };

    const goalInfo = getGoalInfo(profile.goal);
    const GoalIcon = goalInfo.icon;

    return (
        <View style={[styles.container, { backgroundColor: COLORS.black }]}>
            <View style={{ paddingTop: insets.top + 16 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setShowEditModal(true)}
                    >
                        <Edit3 size={20} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {profile.name.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.profileName}>{profile.name || 'User'}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{levelInfo.name}</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Scale size={24} color={COLORS.accent} strokeWidth={2} />
                        <Text style={styles.statValue}>
                            {profile.weight} {profile.weightUnit}
                        </Text>
                        <Text style={styles.statLabel}>Weight</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ruler size={24} color={COLORS.accent} strokeWidth={2} />
                        <Text style={styles.statValue}>
                            {profile.height} {profile.heightUnit}
                        </Text>
                        <Text style={styles.statLabel}>Height</Text>
                    </View>

                    {age && (
                        <View style={styles.statCard}>
                            <Calendar size={24} color={COLORS.accent} strokeWidth={2} />
                            <Text style={styles.statValue}>{age}</Text>
                            <Text style={styles.statLabel}>Years</Text>
                        </View>
                    )}
                </View>

                {/* BMI Card */}
                {bmi && (
                    <View style={styles.bmiCard}>
                        <View style={styles.bmiHeader}>
                            <Text style={styles.bmiTitle}>Body Mass Index</Text>
                            <View style={[styles.bmiCategoryBadge, {
                                backgroundColor: bmi.category === 'Normal' ? COLORS.green + '20' : COLORS.red + '20'
                            }]}>
                                <Text style={[styles.bmiCategoryText, {
                                    color: bmi.category === 'Normal' ? COLORS.green : COLORS.red
                                }]}>{bmi.category}</Text>
                            </View>
                        </View>
                        <Text style={styles.bmiValue}>{bmi.value}</Text>
                        <View style={styles.bmiScale}>
                            <View style={[styles.bmiScaleSection, { backgroundColor: COLORS.blue, flex: 18.5 }]} />
                            <View style={[styles.bmiScaleSection, { backgroundColor: COLORS.green, flex: 6.5 }]} />
                            <View style={[styles.bmiScaleSection, { backgroundColor: '#FFA502', flex: 5 }]} />
                            <View style={[styles.bmiScaleSection, { backgroundColor: COLORS.red, flex: 10 }]} />
                        </View>
                        <View style={styles.bmiLabels}>
                            <Text style={styles.bmiLabel}>Under</Text>
                            <Text style={styles.bmiLabel}>Normal</Text>
                            <Text style={styles.bmiLabel}>Over</Text>
                            <Text style={styles.bmiLabel}>Obese</Text>
                        </View>
                    </View>
                )}

                {/* Goal Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: goalInfo.color + '20' }]}>
                            <GoalIcon size={24} color={goalInfo.color} />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Current Goal</Text>
                            <Text style={styles.infoCardValue}>{goalInfo.label}</Text>
                        </View>
                    </View>
                </View>

                {/* Gender Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: COLORS.blue + '20' }]}>
                            <User size={24} color={COLORS.blue} />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Gender</Text>
                            <Text style={styles.infoCardValue}>
                                {profile.gender === 'female' ? 'Female' : 'Male'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Level Card */}
                <TouchableOpacity
                    style={styles.infoCard}
                    onPress={() => setShowLevelModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: COLORS.accent + '20' }]}>
                            <Target size={24} color={COLORS.accent} />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Training Level</Text>
                            <Text style={styles.infoCardValue}>Level {profile.level} - {levelInfo.name}</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textSecondary} />
                    </View>
                    <Text style={styles.changeLevelHint}>Tap to change level</Text>
                </TouchableOpacity>

                {/* Step Goal Card */}
                <TouchableOpacity
                    style={styles.infoCard}
                    onPress={() => setShowStepGoalModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: COLORS.green + '20' }]}>
                            <Footprints size={24} color={COLORS.green} />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Daily Step Goal</Text>
                            <Text style={styles.infoCardValue}>{stepGoal.toLocaleString()} steps</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textSecondary} />
                    </View>
                    <Text style={styles.changeLevelHint}>Tap to change goal</Text>
                </TouchableOpacity>

                {/* Workout Week Start Card */}
                <TouchableOpacity
                    style={styles.infoCard}
                    onPress={() => setShowStartDayModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: COLORS.blue + '20' }]}>
                            <Calendar size={24} color={COLORS.blue} />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Workout Week Starts</Text>
                            <Text style={styles.infoCardValue}>{getDayName(profile.startDayOfWeek)}</Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textSecondary} />
                    </View>
                    <Text style={styles.changeLevelHint}>Tap to change start day</Text>
                </TouchableOpacity>

                {/* Workout Reminders Card */}
                <TouchableOpacity
                    style={styles.infoCard}
                    onPress={() => setShowReminderModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.infoCardRow}>
                        <View style={[styles.infoIconContainer, { backgroundColor: '#FF6B6B20' }]}>
                            <Bell size={24} color="#FF6B6B" />
                        </View>
                        <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Workout Reminders</Text>
                            <Text style={styles.infoCardValue}>
                                {profile.reminderSettings?.enabled
                                    ? `${profile.reminderSettings.hour.toString().padStart(2, '0')}:${profile.reminderSettings.minute.toString().padStart(2, '0')} • ${profile.reminderSettings.days.length} days`
                                    : 'Disabled'}
                            </Text>
                        </View>
                        <ChevronRight size={24} color={COLORS.textSecondary} />
                    </View>
                    <Text style={styles.changeLevelHint}>Tap to configure reminders</Text>
                </TouchableOpacity>

                {/* Member Since */}
                <View style={styles.memberSince}>
                    <User size={16} color={COLORS.textSecondary} />
                    <Text style={styles.memberSinceText}>
                        Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                        }) : 'N/A'}
                    </Text>
                </View>
            </ScrollView>

            <LevelSelectModal
                visible={showLevelModal}
                currentLevel={profile.level}
                onSelect={(level) => {
                    setLevel(level);
                    setShowLevelModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onClose={() => setShowLevelModal(false)}
            />

            <EditProfileModal
                visible={showEditModal}
                profile={profile}
                onSave={(updates) => {
                    updateProfile(updates);
                    setShowEditModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onClose={() => setShowEditModal(false)}
            />

            <StepGoalModal
                visible={showStepGoalModal}
                currentGoal={stepGoal}
                onSave={(goal) => {
                    setStepGoal(goal);
                    setShowStepGoalModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onClose={() => setShowStepGoalModal(false)}
            />

            <StartDayModal
                visible={showStartDayModal}
                currentDay={profile.startDayOfWeek}
                onSelect={(day) => {
                    setStartDayOfWeek(day);
                    setShowStartDayModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onClose={() => setShowStartDayModal(false)}
            />

            <ReminderSettingsModal
                visible={showReminderModal}
                currentSettings={profile.reminderSettings}
                onSave={async (settings) => {
                    updateProfile({ reminderSettings: settings });
                    await scheduleWorkoutReminders(settings);
                    setShowReminderModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onClose={() => setShowReminderModal(false)}
            />
        </View>
    );
}

interface LevelSelectModalProps {
    visible: boolean;
    currentLevel: WorkoutLevel;
    onSelect: (level: WorkoutLevel) => void;
    onClose: () => void;
}

function LevelSelectModal({ visible, currentLevel, onSelect, onClose }: LevelSelectModalProps) {
    const insets = useSafeAreaInsets();
    const levels: WorkoutLevel[] = [1, 2, 3];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Choose Training Level</Text>
                    <Text style={styles.modalDescription}>
                        Your workouts will be adjusted based on your selection.
                    </Text>

                    <View style={styles.levelList}>
                        {levels.map((level) => {
                            const info = getLevelInfo(level);
                            const isSelected = level === currentLevel;

                            return (
                                <TouchableOpacity
                                    key={level}
                                    style={[styles.levelOption, isSelected && styles.levelOptionSelected]}
                                    onPress={() => onSelect(level)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.levelOptionContent}>
                                        <Text style={styles.levelOptionName}>Level {level} - {info.name}</Text>
                                        <Text style={styles.levelOptionDesc}>{info.setsRange} • {info.repsRange}</Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.levelOptionCheck}>
                                            <Check size={16} color={COLORS.black} strokeWidth={3} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// Reminder Settings Modal
interface ReminderSettingsModalProps {
    visible: boolean;
    currentSettings: ReminderSettings;
    onSave: (settings: ReminderSettings) => void;
    onClose: () => void;
}

function ReminderSettingsModal({ visible, currentSettings, onSave, onClose }: ReminderSettingsModalProps) {
    const insets = useSafeAreaInsets();
    const [enabled, setEnabled] = React.useState(currentSettings?.enabled ?? false);
    const [selectedDays, setSelectedDays] = React.useState<number[]>(currentSettings?.days ?? [1, 2, 3, 4, 5, 6]);
    const [hour, setHour] = React.useState(currentSettings?.hour ?? 8);
    const [minute, setMinute] = React.useState(currentSettings?.minute ?? 0);

    const days = [
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
        { value: 0, label: 'Sun' }
    ];

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSave = () => {
        onSave({
            enabled,
            days: selectedDays,
            hour,
            minute
        });
    };

    React.useEffect(() => {
        if (visible && currentSettings) {
            setEnabled(currentSettings.enabled ?? false);
            setSelectedDays(currentSettings.days ?? [1, 2, 3, 4, 5, 6]);
            setHour(currentSettings.hour ?? 8);
            setMinute(currentSettings.minute ?? 0);
        }
    }, [visible, currentSettings]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Workout Reminders</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalDescription}>
                        Get reminded to workout on your selected days
                    </Text>

                    {/* Enable Toggle */}
                    <TouchableOpacity
                        style={styles.reminderToggleRow}
                        onPress={() => {
                            setEnabled(!enabled);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Text style={styles.reminderToggleLabel}>Enable Reminders</Text>
                        <View style={[styles.toggleSwitch, enabled && styles.toggleSwitchActive]}>
                            <View style={[styles.toggleKnob, enabled && styles.toggleKnobActive]} />
                        </View>
                    </TouchableOpacity>

                    {enabled && (
                        <>
                            {/* Day Selection */}
                            <Text style={styles.reminderSectionLabel}>Reminder Days</Text>
                            <View style={styles.dayToggleRow}>
                                {days.map((day) => (
                                    <TouchableOpacity
                                        key={day.value}
                                        style={[
                                            styles.dayToggle,
                                            selectedDays.includes(day.value) && styles.dayToggleActive
                                        ]}
                                        onPress={() => toggleDay(day.value)}
                                    >
                                        <Text style={[
                                            styles.dayToggleText,
                                            selectedDays.includes(day.value) && styles.dayToggleTextActive
                                        ]}>
                                            {day.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Time Selection */}
                            <Text style={styles.reminderSectionLabel}>Reminder Time</Text>
                            <View style={styles.timePickerRow}>
                                <View style={styles.timePicker}>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setHour(hour > 0 ? hour - 1 : 23)}
                                    >
                                        <Text style={styles.timeButtonText}>−</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.timeValue}>{hour.toString().padStart(2, '0')}</Text>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setHour(hour < 23 ? hour + 1 : 0)}
                                    >
                                        <Text style={styles.timeButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.timeSeparator}>:</Text>
                                <View style={styles.timePicker}>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setMinute(minute >= 5 ? minute - 5 : 55)}
                                    >
                                        <Text style={styles.timeButtonText}>−</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.timeValue}>{minute.toString().padStart(2, '0')}</Text>
                                    <TouchableOpacity
                                        style={styles.timeButton}
                                        onPress={() => setMinute(minute < 55 ? minute + 5 : 0)}
                                    >
                                        <Text style={styles.timeButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={[styles.saveButton, selectedDays.length === 0 && enabled && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={selectedDays.length === 0 && enabled}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

interface StartDayModalProps {
    visible: boolean;
    currentDay: number;
    onSelect: (day: number) => void;
    onClose: () => void;
}

function StartDayModal({ visible, currentDay, onSelect, onClose }: StartDayModalProps) {
    const insets = useSafeAreaInsets();
    const days = [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
        { value: 0, label: 'Sunday' }
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Workout Week Starts</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalDescription}>
                        Choose the first day of your 6-day workout week. The 7th day will be your rest day.
                    </Text>

                    <View style={styles.startDayList}>
                        {days.map((day) => {
                            const isSelected = day.value === currentDay;

                            return (
                                <TouchableOpacity
                                    key={day.value}
                                    style={[styles.levelOption, isSelected && styles.levelOptionSelected]}
                                    onPress={() => onSelect(day.value)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.levelOptionContent}>
                                        <Text style={styles.levelOptionName}>{day.label}</Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.levelOptionCheck}>
                                            <Check size={16} color={COLORS.black} strokeWidth={3} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

interface EditProfileModalProps {
    visible: boolean;
    profile: any;
    onSave: (updates: any) => void;
    onClose: () => void;
}

function EditProfileModal({ visible, profile, onSave, onClose }: EditProfileModalProps) {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState(profile.name);
    const [weight, setWeight] = useState(String(profile.weight));
    const [height, setHeight] = useState(String(profile.height));

    const handleSave = () => {
        onSave({
            name,
            weight: parseFloat(weight) || profile.weight,
            height: parseFloat(height) || profile.height
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.editForm}>
                        <View style={styles.editField}>
                            <Text style={styles.editLabel}>Name</Text>
                            <TextInput
                                style={styles.editInput}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your name"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>

                        <View style={styles.editField}>
                            <Text style={styles.editLabel}>Weight ({profile.weightUnit})</Text>
                            <TextInput
                                style={styles.editInput}
                                value={weight}
                                onChangeText={setWeight}
                                placeholder="0"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.editField}>
                            <Text style={styles.editLabel}>Height ({profile.heightUnit})</Text>
                            <TextInput
                                style={styles.editInput}
                                value={height}
                                onChangeText={setHeight}
                                placeholder="0"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="decimal-pad"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

interface StepGoalModalProps {
    visible: boolean;
    currentGoal: number;
    onSave: (goal: number) => void;
    onClose: () => void;
}

function StepGoalModal({ visible, currentGoal, onSave, onClose }: StepGoalModalProps) {
    const insets = useSafeAreaInsets();
    const [goalInput, setGoalInput] = useState(String(currentGoal));

    React.useEffect(() => {
        if (visible) {
            setGoalInput(String(currentGoal));
        }
    }, [visible, currentGoal]);

    const handleSave = () => {
        const newGoal = parseInt(goalInput, 10);
        if (newGoal > 0) {
            onSave(newGoal);
        }
    };

    const presetGoals = [5000, 7500, 10000, 12500, 15000];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Daily Step Goal</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalDescription}>
                        Set a daily step goal that challenges you to stay active.
                    </Text>

                    <View style={styles.stepGoalInputContainer}>
                        <TextInput
                            style={styles.stepGoalInput}
                            value={goalInput}
                            onChangeText={setGoalInput}
                            keyboardType="number-pad"
                            selectTextOnFocus
                        />
                        <Text style={styles.stepGoalUnit}>steps</Text>
                    </View>

                    <View style={styles.presetGoals}>
                        {presetGoals.map((goal) => (
                            <TouchableOpacity
                                key={goal}
                                style={[
                                    styles.presetGoalButton,
                                    parseInt(goalInput, 10) === goal && styles.presetGoalButtonActive
                                ]}
                                onPress={() => setGoalInput(String(goal))}
                            >
                                <Text style={[
                                    styles.presetGoalText,
                                    parseInt(goalInput, 10) === goal && styles.presetGoalTextActive
                                ]}>
                                    {(goal / 1000).toFixed(goal % 1000 === 0 ? 0 : 1)}k
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>Save Goal</Text>
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
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.surface
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        letterSpacing: -0.5
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 32
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700' as const,
        color: COLORS.black
    },
    profileName: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    levelBadgeIcon: {
        fontSize: 16
    },
    levelBadgeText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginTop: 12,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: COLORS.textSecondary
    },
    bmiCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    bmiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    bmiTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    bmiCategoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    bmiCategoryText: {
        fontSize: 12,
        fontWeight: '700' as const
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 20
    },
    bmiScale: {
        flexDirection: 'row',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8
    },
    bmiScaleSection: {
        height: '100%'
    },
    bmiLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bmiLabel: {
        fontSize: 11,
        color: COLORS.textSecondary
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    infoCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    infoIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoCardContent: {
        flex: 1
    },
    infoCardLabel: {
        fontSize: 13,
        fontWeight: '500' as const,
        color: COLORS.textSecondary,
        marginBottom: 4
    },
    infoCardValue: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: COLORS.textPrimary
    },
    changeLevelHint: {
        fontSize: 12,
        color: COLORS.accent,
        marginTop: 12,
        marginLeft: 64
    },
    memberSince: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24
    },
    memberSinceText: {
        fontSize: 13,
        color: COLORS.textSecondary
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
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
        marginBottom: 24
    },
    levelList: {
        gap: 12
    },
    levelOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: COLORS.black,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border
    },
    levelOptionSelected: {
        borderColor: COLORS.accent
    },
    levelOptionIcon: {
        fontSize: 28
    },
    levelOptionContent: {
        flex: 1
    },
    levelOptionName: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    levelOptionDesc: {
        fontSize: 13,
        color: COLORS.textSecondary
    },
    levelOptionCheck: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editForm: {
        gap: 16,
        marginBottom: 24
    },
    editField: {
        gap: 8
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    editInput: {
        backgroundColor: COLORS.black,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    saveButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center'
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: COLORS.black
    },
    // Step Goal Modal Styles
    stepGoalInputContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24
    },
    stepGoalInput: {
        fontSize: 48,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        textAlign: 'center' as const,
        minWidth: 150
    },
    stepGoalUnit: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: COLORS.accent
    },
    presetGoals: {
        flexDirection: 'row' as const,
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32
    },
    presetGoalButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.black,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    presetGoalButtonActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent
    },
    presetGoalText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    presetGoalTextActive: {
        color: COLORS.black
    },
    startDayList: {
        gap: 8
    },
    // Reminder Modal Styles
    reminderToggleRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    reminderToggleLabel: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textPrimary
    },
    toggleSwitch: {
        width: 52,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.border,
        justifyContent: 'center',
        padding: 2
    },
    toggleSwitchActive: {
        backgroundColor: COLORS.accent
    },
    toggleKnob: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.textSecondary
    },
    toggleKnobActive: {
        backgroundColor: COLORS.black,
        alignSelf: 'flex-end' as const
    },
    reminderSectionLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary,
        marginBottom: 12,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5
    },
    dayToggleRow: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: 8,
        marginBottom: 24
    },
    dayToggle: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    dayToggleActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent
    },
    dayToggleText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    dayToggleTextActive: {
        color: COLORS.black
    },
    timePickerRow: {
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 24
    },
    timePicker: {
        flexDirection: 'row' as const,
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    timeButton: {
        padding: 12
    },
    timeButtonText: {
        fontSize: 24,
        fontWeight: '600' as const,
        color: COLORS.accent
    },
    timeValue: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        minWidth: 50,
        textAlign: 'center' as const
    },
    timeSeparator: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginHorizontal: 8
    },
    saveButtonDisabled: {
        opacity: 0.5
    }
});
