import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const CaregiverDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { alerts } = useApp();
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, colors.gradientEnd]}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hello,</Text>
                    <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {alerts.length > 0 && (
                    <View style={styles.alertSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Alerts</Text>
                        {alerts.map(alert => (
                            <View key={alert.id} style={[styles.alertCard, { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderColor: alert.type === 'CRITICAL' ? '#ef4444' : '#f59e0b' }]}>
                                <Ionicons
                                    name={alert.type === 'CRITICAL' ? 'warning' : 'alert-circle'}
                                    size={24}
                                    color={alert.type === 'CRITICAL' ? '#ef4444' : '#f59e0b'}
                                />
                                <View style={styles.alertContent}>
                                    <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                                    <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>{alert.message}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Dashboard</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]} onPress={() => navigation.navigate('Residents')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                            <Ionicons name="people" size={24} color="#ec4899" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>Residents</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]} onPress={() => navigation.navigate('Inventory')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Ionicons name="list" size={24} color="#3b82f6" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>Inventory</Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    alertSection: {
        marginBottom: 24,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginBottom: 4,
    },
    alertMessage: {
        fontSize: 14,
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

export default CaregiverDashboard;
