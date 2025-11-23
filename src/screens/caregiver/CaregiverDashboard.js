import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const CaregiverDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { alerts } = useApp();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.name}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {alerts.length > 0 && (
                    <View style={styles.alertSection}>
                        <Text style={styles.sectionTitle}>Active Alerts</Text>
                        {alerts.map(alert => (
                            <View key={alert.id} style={[styles.alertCard, { borderColor: alert.type === 'CRITICAL' ? '#ef4444' : '#f59e0b' }]}>
                                <Ionicons
                                    name={alert.type === 'CRITICAL' ? 'warning' : 'alert-circle'}
                                    size={24}
                                    color={alert.type === 'CRITICAL' ? '#ef4444' : '#f59e0b'}
                                />
                                <View style={styles.alertContent}>
                                    <Text style={styles.alertTitle}>{alert.title}</Text>
                                    <Text style={styles.alertMessage}>{alert.message}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Dashboard</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Residents')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                            <Ionicons name="people" size={24} color="#ec4899" />
                        </View>
                        <Text style={styles.actionText}>Residents</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Inventory')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Ionicons name="list" size={24} color="#3b82f6" />
                        </View>
                        <Text style={styles.actionText}>Inventory</Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        marginTop: 8,
    },
    alertSection: {
        marginBottom: 24,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    alertContent: {
        marginLeft: 12,
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    alertMessage: {
        fontSize: 14,
        color: colors.textSecondary,
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

export default CaregiverDashboard;
