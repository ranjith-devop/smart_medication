import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.name}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.reminderCard}>
                    <View style={styles.reminderHeader}>
                        <Text style={styles.reminderTitle}>Next Dose</Text>
                        <View style={styles.timeTag}>
                            <Text style={styles.timeText}>12:30 PM</Text>
                        </View>
                    </View>
                    <Text style={styles.medicineName}>Metformin - 500mg</Text>
                    <Text style={styles.instruction}>Take with food</Text>

                    <TouchableOpacity style={styles.takeButton}>
                        <Text style={styles.takeButtonText}>Mark as Taken</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>My Health</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Ionicons name="medkit" size={24} color="#10b981" />
                        </View>
                        <Text style={styles.actionText}>My Meds</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                            <Ionicons name="calendar" size={24} color="#f59e0b" />
                        </View>
                        <Text style={styles.actionText}>Schedule</Text>
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
        color: colors.textSecondary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
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
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reminderTitle: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    timeTag: {
        backgroundColor: colors.primary,
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
        color: colors.text,
        marginBottom: 4,
    },
    instruction: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    takeButton: {
        backgroundColor: colors.primary,
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
        color: colors.text,
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    actionCard: {
        width: '47%',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
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
        color: colors.text,
    },
});

export default UserDashboard;
