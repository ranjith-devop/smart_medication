import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';



const HomeScreen = ({ navigation }) => {
    const { medicines, alerts } = useApp();
    const userName = "Caregiver";

    const QuickAction = ({ icon, label, onPress }) => (
        <TouchableOpacity onPress={onPress} style={styles.actionWrapper}>
            <GlassCard style={styles.actionCard}>
                <Ionicons name={icon} size={24} color={colors.primary} />
                <Text style={styles.actionLabel}>{label}</Text>
            </GlassCard>
        </TouchableOpacity>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Hello, {userName}</Text>
                            <Text style={styles.subtitle}>Smart Medicine Dashboard</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <GlassCard style={styles.profileButton}>
                                <Ionicons name="person" size={20} color={colors.white} />
                            </GlassCard>
                        </TouchableOpacity>
                    </View>

                    {/* Critical Alerts Section */}
                    {alerts.length > 0 && (
                        <View style={styles.alertsContainer}>
                            <Text style={styles.sectionTitle}>Critical Alerts</Text>
                            {alerts.map(alert => (
                                <GlassCard key={alert.id} style={[styles.alertCard, alert.type === 'DANGER' ? styles.alertDanger : styles.alertWarning]}>
                                    <Ionicons
                                        name={alert.type === 'DANGER' ? "warning" : "alert-circle"}
                                        size={24}
                                        color={colors.white}
                                    />
                                    <View style={styles.alertContent}>
                                        <Text style={styles.alertTitle}>{alert.title}</Text>
                                        <Text style={styles.alertMessage}>{alert.message}</Text>
                                    </View>
                                </GlassCard>
                            ))}
                        </View>
                    )}

                    <View>
                        <GlassCard style={styles.statsCard}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{medicines.length}</Text>
                                <Text style={styles.statLabel}>Medicines</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{alerts.length}</Text>
                                <Text style={styles.statLabel}>Alerts</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>100%</Text>
                                <Text style={styles.statLabel}>Adherence</Text>
                            </View>
                        </GlassCard>
                    </View>

                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <QuickAction
                            icon="people"
                            label="Residents"
                            onPress={() => navigation.navigate('Residents')}
                        />
                        <QuickAction
                            icon="add-circle"
                            label="Add Meds"
                            onPress={() => navigation.navigate('Inventory')}
                        />
                        <QuickAction
                            icon="chatbubble-ellipses"
                            label="Ask AI"
                            onPress={() => navigation.navigate('Chat')}
                        />
                        <QuickAction
                            icon="document-text"
                            label="Reports"
                            onPress={() => { }}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    {medicines.length === 0 ? (
                        <GlassCard style={styles.emptyState}>
                            <Text style={styles.emptyText}>No medicines scheduled for today.</Text>
                        </GlassCard>
                    ) : (
                        medicines.slice(0, 3).map((med) => (
                            <GlassCard key={med.id} style={styles.scheduleCard}>
                                <View style={styles.scheduleInfo}>
                                    <Text style={styles.medName}>{med.name}</Text>
                                    <Text style={styles.medTime}>08:00 AM • {med.dosage}</Text>
                                </View>
                                <TouchableOpacity style={styles.checkButton}>
                                    <Ionicons name="checkmark" size={20} color={colors.white} />
                                </TouchableOpacity>
                            </GlassCard>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 4,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 24,
        marginBottom: 32,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    divider: {
        width: 1,
        backgroundColor: colors.glassBorder,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.white,
        marginBottom: 16,
        marginTop: 8,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    actionWrapper: {
        width: '48%',
        marginBottom: 12,
    },
    actionCard: {
        alignItems: 'center',
        padding: 20,
    },
    actionLabel: {
        color: colors.white,
        marginTop: 8,
        fontWeight: '500',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
    },
    scheduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    scheduleInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        marginBottom: 4,
    },
    medTime: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    checkButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertsContainer: {
        marginBottom: 24,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    alertDanger: {
        borderLeftColor: colors.error,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    alertWarning: {
        borderLeftColor: colors.warning,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    alertContent: {
        marginLeft: 12,
        flex: 1,
    },
    alertTitle: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    alertMessage: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});

export default HomeScreen;
