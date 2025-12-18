import { useUser } from '@/contexts/UserContext';
import { getLevelInfo, type WorkoutLevel } from '@/constants';
import { DEFAULT_REMINDER_SETTINGS } from '@/utils/notifications';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ChevronRight, Check, Dumbbell, Target, Activity, Flame, ChevronLeft, Calendar as CalendarIcon, TrendingDown, TrendingUp, Sparkles, User, User as PersonStanding } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    LayoutAnimation
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { UserGoal } from '@/contexts/UserContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const TOTAL_STEPS = 9;

export default function OnboardingScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { completeOnboarding } = useUser();

    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
    const [goal, setGoal] = useState<UserGoal | null>(null);
    const [level, setLevel] = useState<WorkoutLevel | null>(null);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [startDay, setStartDay] = useState<number>(1); // 1=Monday default
    const [age, setAge] = useState<number>(25);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const animateToStep = (nextStep: number) => {
        const direction = nextStep > step ? 1 : -1;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: -direction * 50,
                duration: 150,
                useNativeDriver: true
            })
        ]).start(() => {
            setStep(nextStep);
            slideAnim.setValue(direction * 50);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true
                })
            ]).start();
        });
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (step < TOTAL_STEPS - 1) {
            animateToStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (step > 0) {
            animateToStep(step - 1);
        }
    };

    const handleComplete = () => {
        if (!goal || !level) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - age;

        completeOnboarding({
            name,
            birthYear,
            weight: parseFloat(weight) || 0,
            height: parseFloat(height) || 0,
            weightUnit,
            heightUnit,
            goal,
            level,
            gender,
            startDayOfWeek: startDay,
            reminderSettings: DEFAULT_REMINDER_SETTINGS
        });

        router.replace('/(tabs)');
    };

    const canProceed = () => {
        switch (step) {
            case 0: return true; // Welcome
            case 1: return true; // Gender always has a default
            case 2: return name.trim().length >= 2;
            case 2: return name.trim().length >= 2;
            case 3: return age >= 10 && age <= 100;
            case 4: return parseFloat(weight) > 0;
            case 4: return parseFloat(weight) > 0;
            case 5: return parseFloat(height) > 0;
            case 6: return goal !== null;
            case 7: return true; // Start day always has a default
            case 8: return level !== null;
            default: return false;
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <WelcomeStep />;
            case 1:
                return (
                    <GenderStep
                        gender={gender}
                        setGender={setGender}
                    />
                );
            case 2:
                return (
                    <NameStep
                        name={name}
                        setName={setName}
                    />
                );
            case 3:
                return (
                    <AgeStep
                        age={age}
                        setAge={setAge}
                    />
                );
            case 4:
                return (
                    <WeightStep
                        weight={weight}
                        setWeight={setWeight}
                        unit={weightUnit}
                        setUnit={setWeightUnit}
                    />
                );
            case 5:
                return (
                    <HeightStep
                        height={height}
                        setHeight={setHeight}
                        unit={heightUnit}
                        setUnit={setHeightUnit}
                    />
                );
            case 6:
                return (
                    <GoalStep
                        goal={goal}
                        setGoal={setGoal}
                    />
                );
            case 7:
                return (
                    <StartDayStep
                        startDay={startDay}
                        setStartDay={setStartDay}
                    />
                );
            case 8:
                return (
                    <LevelStep
                        level={level}
                        setLevel={setLevel}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: `${((step + 1) / TOTAL_STEPS) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>{step + 1} / {TOTAL_STEPS}</Text>
                </View>

                {/* Content */}
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}
                >
                    {renderStep()}
                </Animated.View>

                {/* Navigation */}
                <View style={[styles.navigation, { paddingBottom: insets.bottom + 20 }]}>
                    {step > 0 && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.7}
                        >
                            <ChevronLeft size={24} color={COLORS.textSecondary} />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            !canProceed() && styles.nextButtonDisabled,
                            step === 0 && styles.nextButtonFull
                        ]}
                        onPress={handleNext}
                        disabled={!canProceed()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextButtonText}>
                            {step === 0 ? "Get Started" : step === TOTAL_STEPS - 1 ? "Complete" : "Continue"}
                        </Text>
                        <ChevronRight size={20} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

function WelcomeStep() {
    return (
        <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
                <Dumbbell size={64} color={COLORS.accent} strokeWidth={1.5} />
            </View>
            <Text style={styles.stepTitle}>Welcome to{'\n'}Your Fitness Journey</Text>
            <Text style={styles.stepDescription}>
                Let's set up your personalized workout plan. We'll help you reach your goals with training tailored just for you.
            </Text>
            <View style={styles.featureList}>
                <FeatureItem icon={<Target size={20} color={COLORS.accent} />} text="Personalized workouts" />
                <FeatureItem icon={<Activity size={20} color={COLORS.accent} />} text="Track your progress" />
                <FeatureItem icon={<Flame size={20} color={COLORS.accent} />} text="Build healthy habits" />
            </View>
        </View>
    );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <View style={styles.featureItem}>
            {icon}
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

interface NameStepProps {
    name: string;
    setName: (name: string) => void;
}

function NameStep({ name, setName }: NameStepProps) {
    return (
        <ScrollView style={styles.scrollStep} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <View style={styles.iconContainer}>
                    <User size={48} color={COLORS.accent} strokeWidth={1.5} />
                </View>
                <Text style={styles.stepTitle}>What's your name?</Text>
                <Text style={styles.stepDescription}>
                    Let's make this personal. How should we call you?
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    autoCapitalize="words"
                />
            </View>
        </ScrollView>
    );
}

interface WeightStepProps {
    weight: string;
    setWeight: (weight: string) => void;
    unit: 'kg' | 'lbs';
    setUnit: (unit: 'kg' | 'lbs') => void;
}

function WeightStep({ weight, setWeight, unit, setUnit }: WeightStepProps) {
    return (
        <ScrollView style={styles.scrollStep} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>What's your current weight?</Text>
                <Text style={styles.stepDescription}>
                    This helps us track your progress over time.
                </Text>

                <View style={styles.unitToggle}>
                    <TouchableOpacity
                        style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                        onPress={() => setUnit('kg')}
                    >
                        <Text style={[styles.unitButtonText, unit === 'kg' && styles.unitButtonTextActive]}>kg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                        onPress={() => setUnit('lbs')}
                    >
                        <Text style={[styles.unitButtonText, unit === 'lbs' && styles.unitButtonTextActive]}>lbs</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.textInput, styles.numberInput]}
                        placeholder="0"
                        placeholderTextColor={COLORS.textSecondary}
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="decimal-pad"
                        autoFocus
                    />
                    <Text style={styles.unitLabel}>{unit}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

interface HeightStepProps {
    height: string;
    setHeight: (height: string) => void;
    unit: 'cm' | 'ft';
    setUnit: (unit: 'cm' | 'ft') => void;
}

function HeightStep({ height, setHeight, unit, setUnit }: HeightStepProps) {
    return (
        <ScrollView style={styles.scrollStep} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>What's your height?</Text>
                <Text style={styles.stepDescription}>
                    We'll use this to calculate your BMI and other metrics.
                </Text>

                <View style={styles.unitToggle}>
                    <TouchableOpacity
                        style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
                        onPress={() => setUnit('cm')}
                    >
                        <Text style={[styles.unitButtonText, unit === 'cm' && styles.unitButtonTextActive]}>cm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.unitButton, unit === 'ft' && styles.unitButtonActive]}
                        onPress={() => setUnit('ft')}
                    >
                        <Text style={[styles.unitButtonText, unit === 'ft' && styles.unitButtonTextActive]}>ft</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.textInput, styles.numberInput]}
                        placeholder="0"
                        placeholderTextColor={COLORS.textSecondary}
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="decimal-pad"
                        autoFocus
                    />
                    <Text style={styles.unitLabel}>{unit}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

interface GoalStepProps {
    goal: UserGoal | null;
    setGoal: (goal: UserGoal) => void;
}

function GoalStep({ goal, setGoal }: GoalStepProps) {
    const goals: { key: UserGoal; label: string; description: string; icon: React.ReactNode; color: string }[] = [
        {
            key: 'loss',
            label: 'Lose Weight',
            description: 'Burn fat and get leaner',
            icon: <TrendingDown size={28} color={COLORS.red} />,
            color: COLORS.red
        },
        {
            key: 'maintenance',
            label: 'Stay Fit',
            description: 'Maintain your current shape',
            icon: <Target size={28} color={COLORS.blue} />,
            color: COLORS.blue
        },
        {
            key: 'gain',
            label: 'Build Muscle',
            description: 'Gain strength and size',
            icon: <TrendingUp size={28} color={COLORS.green} />,
            color: COLORS.green
        }
    ];

    return (
        <ScrollView style={styles.scrollStep} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>What's your goal?</Text>
                <Text style={styles.stepDescription}>
                    Choose your primary fitness objective.
                </Text>

                <View style={styles.cardList}>
                    {goals.map((g) => (
                        <TouchableOpacity
                            key={g.key}
                            style={[
                                styles.goalCard,
                                goal === g.key && { borderColor: g.color }
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setGoal(g.key);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.goalCardContent}>
                                {g.icon}
                                <View style={styles.goalCardText}>
                                    <Text style={styles.goalCardLabel}>{g.label}</Text>
                                    <Text style={styles.goalCardDescription}>{g.description}</Text>
                                </View>
                            </View>
                            {goal === g.key && (
                                <View style={[styles.selectedIndicator, { backgroundColor: g.color }]} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

interface StartDayStepProps {
    startDay: number;
    setStartDay: (day: number) => void;
}

function StartDayStep({ startDay, setStartDay }: StartDayStepProps) {
    const days = [
        { value: 1, label: 'Monday', short: 'Mon' },
        { value: 2, label: 'Tuesday', short: 'Tue' },
        { value: 3, label: 'Wednesday', short: 'Wed' },
        { value: 4, label: 'Thursday', short: 'Thu' },
        { value: 5, label: 'Friday', short: 'Fri' },
        { value: 6, label: 'Saturday', short: 'Sat' },
        { value: 0, label: 'Sunday', short: 'Sun' }
    ];

    return (
        <ScrollView style={styles.scrollStep} showsVerticalScrollIndicator={false}>
            <View style={[styles.stepContent, { paddingBottom: 120 }]}>
                <Text style={styles.stepTitle}>When should your{'\n'}week start?</Text>
                <Text style={styles.stepDescription}>
                    Choose the first day of your 6-day workout week. The 7th day will be your rest day.
                </Text>

                <View style={styles.dayGrid}>
                    {days.map((day) => (
                        <TouchableOpacity
                            key={day.value}
                            style={[
                                styles.dayButton,
                                startDay === day.value && styles.dayButtonActive
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setStartDay(day.value);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.dayButtonText,
                                startDay === day.value && styles.dayButtonTextActive
                            ]}>
                                {day.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.schedulePreview}>
                    <Text style={styles.schedulePreviewTitle}>Your Schedule</Text>
                    {days.slice(0, 6).map((day, idx) => {
                        const dayIndex = days.findIndex(d => d.value === startDay);
                        const actualDay = days[(dayIndex + idx) % 7];
                        return (
                            <View key={idx} style={styles.scheduleRow}>
                                <Text style={styles.scheduleDay}>{actualDay.label}</Text>
                                <Text style={styles.scheduleWorkout}>Day {idx + 1}</Text>
                            </View>
                        );
                    })}
                    <View style={styles.scheduleRow}>
                        <Text style={styles.scheduleDay}>
                            {days[(days.findIndex(d => d.value === startDay) + 6) % 7].label}
                        </Text>
                        <Text style={styles.scheduleRest}>Rest Day</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
// Gender Step Component
interface GenderStepProps {
    gender: 'male' | 'female';
    setGender: (gender: 'male' | 'female') => void;
}

function GenderStep({ gender, setGender }: GenderStepProps) {
    const genderOptions = [
        { value: 'male' as const, label: 'Male', icon: <PersonStanding size={48} color={gender === 'male' ? COLORS.accent : COLORS.textSecondary} /> },
        { value: 'female' as const, label: 'Female', icon: <User size={48} color={gender === 'female' ? COLORS.accent : COLORS.textSecondary} /> }
    ];

    return (
        <ScrollView style={styles.scrollStep} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Your Gender</Text>
                <Text style={styles.stepSubtitle}>
                    We&apos;ll customize your workout program based on your selection
                </Text>

                <View style={styles.genderOptions}>
                    {genderOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.genderButton,
                                gender === option.value && styles.genderButtonActive
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setGender(option.value);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.genderIconContainer}>
                                {option.icon}
                            </View>
                            <Text style={[
                                styles.genderButtonText,
                                gender === option.value && styles.genderButtonTextActive
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.genderNote}>
                    <Text style={styles.genderNoteText}>
                        Note: This selection cannot be changed later
                    </Text>
                </View>
            </View>
        </ScrollView >
    );
}

interface LevelStepProps {
    level: WorkoutLevel | null;
    setLevel: (level: WorkoutLevel) => void;
}

function LevelStep({ level, setLevel }: LevelStepProps) {
    const levels: WorkoutLevel[] = [1, 2, 3];

    return (
        <ScrollView style={styles.scrollStep} showsVerticalScrollIndicator={false}>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose your level</Text>
                <Text style={styles.stepDescription}>
                    Don't worry, you can change this anytime.
                </Text>

                <View style={styles.cardList}>
                    {levels.map((l) => {
                        const info = getLevelInfo(l);
                        return (
                            <TouchableOpacity
                                key={l}
                                style={[
                                    styles.levelCard,
                                    level === l && styles.levelCardActive
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setLevel(l);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.levelHeader}>
                                    <View style={styles.levelBadge}>
                                        <Text style={styles.levelBadgeText}>Level {l}</Text>
                                    </View>
                                </View>
                                <Text style={styles.levelName}>{info.name}</Text>
                                <Text style={styles.levelDescription}>{info.description}</Text>
                                <View style={styles.levelStats}>
                                    <Text style={styles.levelStat}>{info.setsRange}</Text>
                                    <Text style={styles.levelStatDivider}>•</Text>
                                    <Text style={styles.levelStat}>{info.repsRange}</Text>
                                </View>
                                {level === l && (
                                    <View style={styles.levelSelectedIndicator}>
                                        <Sparkles size={16} color={COLORS.black} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

interface AgeStepProps {
    age: number;
    setAge: (age: number) => void;
}

function AgeStep({ age, setAge }: AgeStepProps) {
    const ITEM_HEIGHT = 60;
    const flatListRef = useRef<FlatList>(null);
    const ages = Array.from({ length: 91 }, (_, i) => i + 10); // Ages 10 to 100

    useEffect(() => {
        // Scroll to initial value after render
        setTimeout(() => {
            const index = ages.indexOf(age);
            if (index !== -1 && flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: false,
                    viewOffset: ITEM_HEIGHT * 2
                });
            }
        }, 100);
    }, []);

    const renderItem = ({ item }: { item: number }) => {
        const isSelected = item === age;
        return (
            <TouchableOpacity
                style={[
                    styles.agePickerItem,
                    { height: ITEM_HEIGHT }
                ]}
                onPress={() => {
                    setAge(item);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    flatListRef.current?.scrollToIndex({
                        index: ages.indexOf(item),
                        animated: true,
                        viewOffset: ITEM_HEIGHT * 2
                    });
                }}
            >
                <Text style={[
                    styles.agePickerText,
                    isSelected && styles.agePickerTextSelected
                ]}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
                <CalendarIcon size={48} color={COLORS.accent} strokeWidth={1.5} />
            </View>
            <Text style={styles.stepTitle}>How old are you?</Text>
            <Text style={styles.stepDescription}>
                This helps us customize your plan.
            </Text>

            <View style={styles.agePickerContainer}>
                <View style={styles.agePickerSelectionOverlay} />
                <FlatList
                    ref={flatListRef}
                    data={ages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    getItemLayout={(_, index) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * index,
                        index,
                    })}
                    contentContainerStyle={{
                        paddingVertical: ITEM_HEIGHT * 2
                    }}
                    onMomentumScrollEnd={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        const index = Math.round(offsetY / ITEM_HEIGHT);
                        if (index >= 0 && index < ages.length) {
                            const newAge = ages[index];
                            if (newAge !== age) {
                                setAge(newAge);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black
    },
    keyboardView: {
        flex: 1
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 2
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    content: {
        flex: 1,
        paddingHorizontal: 24
    },
    scrollStep: {
        flex: 1
    },
    stepContent: {
        flex: 1,
        paddingTop: 32
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    stepTitle: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 16,
        letterSpacing: -0.5
    },
    stepDescription: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: 32
    },
    featureList: {
        gap: 16,
        marginTop: 24
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    featureText: {
        fontSize: 16,
        fontWeight: '500' as const,
        color: COLORS.textPrimary
    },
    textInput: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 18,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    numberInput: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700' as const
    },
    unitToggle: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24
    },
    unitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    unitButtonActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent
    },
    unitButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    unitButtonTextActive: {
        color: COLORS.black
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    unitLabel: {
        fontSize: 24,
        fontWeight: '600' as const,
        color: COLORS.accent,
        minWidth: 50
    },
    cardList: {
        gap: 16
    },
    goalCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        overflow: 'hidden'
    },
    goalCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    goalCardText: {
        flex: 1
    },
    goalCardLabel: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 4
    },
    goalCardDescription: {
        fontSize: 14,
        color: COLORS.textSecondary
    },
    selectedIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomLeftRadius: 20
    },
    levelCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        borderColor: COLORS.border,
        overflow: 'hidden'
    },
    levelCardActive: {
        borderColor: COLORS.accent
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    levelIcon: {
        fontSize: 32
    },
    levelBadge: {
        backgroundColor: COLORS.border,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    levelBadgeText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    levelName: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 8
    },
    levelDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: 16
    },
    levelStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    levelStat: {
        fontSize: 13,
        fontWeight: '600' as const,
        color: COLORS.accent
    },
    levelStatDivider: {
        color: COLORS.textSecondary
    },
    levelSelectedIndicator: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        gap: 16
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        gap: 4
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '500' as const,
        color: COLORS.textSecondary
    },
    nextButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.accent,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        gap: 8
    },
    nextButtonFull: {
        flex: 1
    },
    nextButtonDisabled: {
        opacity: 0.5
    },
    nextButtonText: {
        fontSize: 17,
        fontWeight: '700' as const,
        color: COLORS.black
    },
    // StartDayStep styles
    dayGrid: {
        gap: 12,
        marginBottom: 24
    },
    dayButton: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center'
    },
    dayButtonActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent
    },
    dayButtonText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: COLORS.textPrimary
    },
    dayButtonTextActive: {
        color: COLORS.black
    },
    schedulePreview: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    schedulePreviewTitle: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: COLORS.textPrimary,
        marginBottom: 16
    },
    scheduleRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    scheduleDay: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: COLORS.textSecondary
    },
    scheduleWorkout: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.accent
    },
    scheduleRest: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    // Gender Step Styles
    stepSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center' as const,
        marginBottom: 40,
        lineHeight: 22
    },
    genderOptions: {
        flexDirection: 'row' as const,
        gap: 16,
        marginBottom: 32
    },
    genderButton: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: 'center' as const,
        borderWidth: 2,
        borderColor: COLORS.border
    },
    genderButtonActive: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.accent + '15'
    },
    genderEmoji: {
        fontSize: 48,
        marginBottom: 12
    },
    genderIconContainer: {
        marginBottom: 16
    },
    genderButtonText: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: COLORS.textSecondary
    },
    genderButtonTextActive: {
        color: COLORS.accent
    },
    genderNote: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    genderNoteText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: 'center' as const,
        fontStyle: 'italic' as const
    },
    agePickerContainer: {
        height: 300,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 20,
    },
    agePickerSelectionOverlay: {
        position: 'absolute',
        top: 120, // (300 height / 2) - (60 itemHeight / 2)
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(204, 255, 0, 0.1)',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.accent,
        zIndex: 0
    },
    agePickerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    agePickerText: {
        fontSize: 24,
        color: COLORS.textSecondary,
        fontWeight: '500' as const
    },
    agePickerTextSelected: {
        fontSize: 32,
        color: COLORS.accent,
        fontWeight: '700' as const
    }
});
