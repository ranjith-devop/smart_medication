import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const PatientDetailsScreen = ({ navigation, route }) => {
    const { resident } = route.params;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Patient Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{resident.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.name}>{resident.name}</Text>
                    <Text style={styles.details}>{resident.age} years old • {resident.condition}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>98%</Text>
                        <Text style={styles.statLabel}>Adherence</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>120/80</Text>
                        <Text style={styles.statLabel}>BP</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>72</Text>
                        <Text style={styles.statLabel}>Heart Rate</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Actions</Text>
                <View style={styles.actionList}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EPrescription', { resident })}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Ionicons name="medkit" size={24} color="#3b82f6" />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>E-Prescription</Text>
                            <Text style={styles.actionDesc}>Add or modify medicines</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Ionicons name="document-text" size={24} color="#10b981" />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Medical Reports</Text>
                            <Text style={styles.actionDesc}>View lab results & history</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        padding: 24,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: colors.white,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    details: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 16,
        padding: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
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
    actionList: {
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionInfo: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    actionDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});

export default PatientDetailsScreen;
