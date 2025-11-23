import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const SettingItem = ({ icon, label, value, isSwitch, onPress }) => (
        <TouchableOpacity onPress={onPress} disabled={isSwitch}>
            <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{label}</Text>
                </View>
                {isSwitch ? (
                    <Switch
                        value={value}
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={colors.white}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={40} color={colors.white} />
                    </View>
                    <Text style={styles.name}>User Name</Text>
                    <Text style={styles.email}>user@example.com</Text>
                </View>

                <GlassCard style={styles.section}>
                    <Text style={styles.sectionHeader}>Account</Text>
                    <SettingItem icon="person-outline" label="Personal Info" />
                    <View style={styles.divider} />
                    <SettingItem icon="medical-outline" label="Health Profile" />
                    <View style={styles.divider} />
                    <SettingItem icon="notifications-outline" label="Notifications" isSwitch value={true} />
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text style={styles.sectionHeader}>App Settings</Text>
                    <SettingItem icon="moon-outline" label="Dark Mode" isSwitch value={true} />
                    <View style={styles.divider} />
                    <SettingItem icon="language-outline" label="Language" />
                    <View style={styles.divider} />
                    <SettingItem icon="shield-checkmark-outline" label="Privacy & Security" />
                </GlassCard>

                <GlassCard style={styles.section}>
                    <SettingItem icon="help-circle-outline" label="Help & Support" />
                    <View style={styles.divider} />
                    <SettingItem icon="log-out-outline" label="Log Out" />
                </GlassCard>
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: 20,
        padding: 0,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: colors.glassBorder,
        marginLeft: 60,
    },
});

export default ProfileScreen;
