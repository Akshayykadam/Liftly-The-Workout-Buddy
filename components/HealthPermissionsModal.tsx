/**
 * Health Permissions Modal
 * Android-only modal for managing Health Connect permissions
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    X,
    Shield,
    Activity,
    Heart,
    Flame,
    Moon,
    Scale,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
} from 'lucide-react-native';
import { useHealthConnect } from '@/contexts/HealthConnectContext';

const COLORS = {
    black: '#000000',
    surface: '#0F0F0F',
    surfaceLight: '#1A1A1A',
    accent: '#CCFF00',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#1F1F1F',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
} as const;

interface HealthPermissionsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface PermissionItemProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    granted?: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({
    icon,
    label,
    description,
    granted,
}) => (
    <View style={styles.permissionItem}>
        <View style={styles.permissionIcon}>{icon}</View>
        <View style={styles.permissionContent}>
            <Text style={styles.permissionLabel}>{label}</Text>
            <Text style={styles.permissionDescription}>{description}</Text>
        </View>
        <View style={styles.permissionStatus}>
            {granted !== undefined && (
                granted ? (
                    <CheckCircle2 size={20} color={COLORS.success} />
                ) : (
                    <AlertCircle size={20} color={COLORS.textSecondary} />
                )
            )}
        </View>
    </View>
);

export const HealthPermissionsModal: React.FC<HealthPermissionsModalProps> = ({
    visible,
    onClose,
}) => {
    const insets = useSafeAreaInsets();
    const {
        isAndroid,
        healthConnectStatus,
        permissions,
        requestPermissions,
        openSettings,
        error,
    } = useHealthConnect();

    if (!isAndroid) return null;

    const isAvailable = healthConnectStatus === 'available';
    const needsInstall = healthConnectStatus === 'not_installed';

    const handleRequestPermissions = async () => {
        await requestPermissions();
    };

    const handleOpenPlayStore = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata');
    };

    const handleOpenSettings = async () => {
        await openSettings();
    };

    // Check if a specific permission is granted
    const isPermissionGranted = (type: string): boolean | undefined => {
        const perm = permissions.find(p => p.permission === type);
        return perm?.granted;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Health Connect</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Status Banner */}
                    {!isAvailable && (
                        <View style={[styles.statusBanner, needsInstall ? styles.warningBanner : styles.errorBanner]}>
                            <AlertCircle size={24} color={needsInstall ? COLORS.warning : COLORS.error} />
                            <View style={styles.statusBannerContent}>
                                <Text style={styles.statusBannerTitle}>
                                    {needsInstall
                                        ? 'Health Connect Not Installed'
                                        : 'Health Connect Unavailable'}
                                </Text>
                                <Text style={styles.statusBannerDescription}>
                                    {needsInstall
                                        ? 'Install Health Connect from the Play Store to use health features.'
                                        : error || 'Health Connect is not available on this device.'}
                                </Text>
                                {needsInstall && (
                                    <TouchableOpacity
                                        style={styles.installButton}
                                        onPress={handleOpenPlayStore}
                                    >
                                        <Text style={styles.installButtonText}>Install from Play Store</Text>
                                        <ExternalLink size={16} color={COLORS.textPrimary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <Shield size={32} color={COLORS.accent} />
                        <Text style={styles.infoTitle}>Your Health Data is Private</Text>
                        <Text style={styles.infoDescription}>
                            Liftly uses Android Health Connect to read your health and fitness data.
                            This data stays on your device and is never sent to our servers.
                        </Text>
                    </View>

                    {/* Permissions List */}
                    <View style={styles.permissionsSection}>
                        <Text style={styles.sectionTitle}>Data Access</Text>

                        <PermissionItem
                            icon={<Activity size={20} color={COLORS.accent} />}
                            label="Steps"
                            description="Daily step count and history"
                            granted={isPermissionGranted('Steps')}
                        />

                        <PermissionItem
                            icon={<Heart size={20} color="#EF4444" />}
                            label="Heart Rate"
                            description="Heart rate and resting heart rate"
                            granted={isPermissionGranted('HeartRate')}
                        />

                        <PermissionItem
                            icon={<Activity size={20} color="#3B82F6" />}
                            label="Exercise"
                            description="Workout sessions and activities"
                            granted={isPermissionGranted('ExerciseSession')}
                        />

                        <PermissionItem
                            icon={<Flame size={20} color="#F97316" />}
                            label="Calories"
                            description="Active and total calories burned"
                            granted={isPermissionGranted('ActiveCaloriesBurned')}
                        />

                        <PermissionItem
                            icon={<Moon size={20} color="#8B5CF6" />}
                            label="Sleep"
                            description="Sleep sessions and stages"
                            granted={isPermissionGranted('SleepSession')}
                        />

                        <PermissionItem
                            icon={<Scale size={20} color="#22C55E" />}
                            label="Body Measurements"
                            description="Weight, height, body fat percentage"
                            granted={isPermissionGranted('Weight')}
                        />
                    </View>

                    {/* Action Buttons */}
                    {isAvailable && (
                        <View style={styles.actionsSection}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleRequestPermissions}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {permissions.length > 0 ? 'Update Permissions' : 'Grant Permissions'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={handleOpenSettings}
                            >
                                <Text style={styles.secondaryButtonText}>Open Health Connect Settings</Text>
                                <ExternalLink size={16} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Requirements Note */}
                    <View style={styles.noteSection}>
                        <Text style={styles.noteTitle}>Requirements</Text>
                        <Text style={styles.noteText}>
                            • Android 14+ (built-in) or Android 13 with Health Connect app{'\n'}
                            • Screen lock must be enabled (PIN, pattern, or password){'\n'}
                            • Health data from connected fitness apps
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    statusBanner: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
    },
    warningBanner: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    errorBanner: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    statusBannerContent: {
        flex: 1,
    },
    statusBannerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statusBannerDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    installButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    installButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    infoSection: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    infoDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 300,
    },
    permissionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    permissionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    permissionContent: {
        flex: 1,
    },
    permissionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    permissionDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    permissionStatus: {
        marginLeft: 8,
    },
    actionsSection: {
        gap: 12,
        marginBottom: 24,
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    noteSection: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});

export default HealthPermissionsModal;
