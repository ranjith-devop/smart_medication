import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const ProfileScreen = () => {
    const { user } = useAuth();
    const { colors, isDarkMode, toggleTheme } = useContext(ThemeContext);

    const SettingItem = ({ icon, label, value, isSwitch, onPress, onValueChange }) => (
        <TouchableOpacity onPress={onPress} disabled={isSwitch}>
            <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
                </View>
                {isSwitch ? (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
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
                    <View style={[styles.avatarContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <Ionicons name="person" size={40} color={colors.white} />
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'User Name'}</Text>
                </View>

                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Account</Text>
                    <SettingItem icon="person-outline" label="Personal Info" />
                    <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
                    <SettingItem icon="medical-outline" label="Health Profile" />
                    <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
                    <SettingItem icon="notifications-outline" label="Notifications" isSwitch value={true} />
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>App Settings</Text>
                    <SettingItem
                        icon="moon-outline"
                        label="Dark Mode"
                        isSwitch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
                    <SettingItem icon="language-outline" label="Language" />
                    <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
                    <SettingItem icon="shield-checkmark-outline" label="Privacy & Security" />
                </GlassCard>

                <GlassCard style={styles.section}>
                    <SettingItem icon="help-circle-outline" label="Help & Support" />
                    <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />
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
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    section: {
        marginBottom: 20,
        padding: 0,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
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
    },
    divider: {
        height: 1,
        marginLeft: 60,
    },
});

export default ProfileScreen;
