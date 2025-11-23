import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome,</Text>
                    <Text style={styles.name}>Dr. {user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statsContainer}>
                    <BlurView intensity={20} tint="dark" style={styles.statCard}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Patients</Text>
                    </BlurView>
                    <BlurView intensity={20} tint="dark" style={styles.statCard}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Critical</Text>
                    </BlurView>
                    <BlurView intensity={20} tint="dark" style={styles.statCard}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </BlurView>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Residents')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Ionicons name="people" size={24} color="#3b82f6" />
                        </View>
                        <Text style={styles.actionText}>View Patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Ionicons name="document-text" size={24} color="#10b981" />
                        </View>
                        <Text style={styles.actionText}>Reports</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                            <Ionicons name="medkit" size={24} color="#ec4899" />
                        </View>
                        <Text style={styles.actionText}>Prescribe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                            <Ionicons name="scan" size={24} color="#f59e0b" />
                        </View>
                        <Text style={styles.actionText}>AI Scan</Text>
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        alignItems: 'center',
        overflow: 'hidden',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
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

export default DoctorDashboard;
