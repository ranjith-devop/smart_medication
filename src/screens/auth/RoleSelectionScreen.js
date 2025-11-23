import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const RoleCard = ({ title, icon, description, onPress, color }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.cardContainer}>
        <BlurView intensity={20} tint="dark" style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={32} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </BlurView>
    </TouchableOpacity>
);

const RoleSelectionScreen = ({ navigation }) => {
    const handleRoleSelect = (role) => {
        navigation.navigate('Login', { role });
    };

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
                <Text style={styles.title}>Choose Account Type</Text>
                <Text style={styles.subtitle}>Select how you will use SmartMeds</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <RoleCard
                    title="Doctor"
                    icon="medical"
                    description="Manage patients, prescriptions, and reports."
                    color="#3b82f6"
                    onPress={() => handleRoleSelect('DOCTOR')}
                />

                <RoleCard
                    title="Caregiver"
                    icon="heart"
                    description="Monitor residents, receive alerts, and track meds."
                    color="#ec4899"
                    onPress={() => handleRoleSelect('CAREGIVER')}
                />

                <RoleCard
                    title="Personal User"
                    icon="person"
                    description="Track your own medications and reminders."
                    color="#10b981"
                    onPress={() => handleRoleSelect('USER')}
                />
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
        padding: 24,
        paddingTop: 60,
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    content: {
        padding: 24,
        gap: 20,
    },
    cardContainer: {
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});

export default RoleSelectionScreen;
