import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { BlurView } from 'expo-blur';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#1e293b']}
                style={styles.background}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>SmartMeds</Text>
                    <Text style={styles.subtitle}>Advanced Medication Management</Text>
                </View>

                <View style={styles.illustration}>
                    {/* Placeholder for illustration */}
                    <View style={styles.circle} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.description}>
                        Your health companion for smarter, safer, and easier medication tracking.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('RoleSelection')}
                    >
                        <LinearGradient
                            colors={[colors.primary, '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
        paddingTop: 80,
        paddingBottom: 50,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    illustration: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    footer: {
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default WelcomeScreen;
