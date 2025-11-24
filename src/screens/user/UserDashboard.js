import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const UserDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, colors.gradientEnd]}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning,</Text>
                    <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.reminderCard, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                    <View style={styles.reminderHeader}>
                        <Text style={[styles.reminderTitle, { color: colors.primary }]}>Next Dose</Text>
                        <View style={[styles.timeTag, { backgroundColor: colors.primary }]}>
                            <Text style={styles.timeText}>12:30 PM</Text>
                        </View>
                    </View>
                    <Text style={[styles.medicineName, { color: colors.text }]}>Metformin - 500mg</Text>
                    <Text style={[styles.instruction, { color: colors.textSecondary }]}>Take with food</Text>

                    <TouchableOpacity style={[styles.takeButton, { backgroundColor: colors.primary }]}>
                        <Text style={styles.takeButtonText}>Mark as Taken</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>My Health</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Ionicons name="medkit" size={24} color="#10b981" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>My Meds</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                            <Ionicons name="calendar" size={24} color="#f59e0b" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>Schedule</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
    },
    greeting: {
        fontSize: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    content: {
        padding: 24,
    },
    reminderCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    medicineName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    instruction: {
        fontSize: 16,
        marginBottom: 24,
    },
    takeButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    takeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    actionCard: {
        width: '47%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default UserDashboard;
