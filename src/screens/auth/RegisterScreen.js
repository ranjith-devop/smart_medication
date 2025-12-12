import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation, route }) => {
    const { role } = route.params;
    // const { register, isLoading } = useAuth(); // Assuming register function exists or will be added
    const [isLoading, setIsLoading] = useState(false); // Mock loading state
    const [method, setMethod] = useState('MOBILE'); // 'MOBILE' or 'EMAIL'
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState('');

    const handleRegister = async () => {
        if (!identifier || !password || !name || password !== confirmPassword || !otpVerified) return;
        setIsLoading(true);
        // Simulate registration
        setTimeout(() => {
            setIsLoading(false);
            alert('Registration Successful!');
            navigation.navigate('Login', { role });
        }, 1500);
        // await register(role, method, { identifier, password, name });
    };

    const handleSendOTP = () => {
        if (!identifier) {
            alert('Please enter a valid mobile number or email');
            return;
        }
        // Simulate sending OTP
        setOtpSent(true);
        alert(`OTP sent to ${identifier}: 1234`);
    };

    const handleVerifyOTP = () => {
        if (otp === '1234') {
            setOtpVerified(true);
            alert('OTP Verified Successfully!');
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };

    const getRoleTitle = () => {
        switch (role) {
            case 'DOCTOR': return 'Doctor Registration';
            case 'CAREGIVER': return 'Caregiver Registration';
            case 'USER': return 'User Registration';
            default: return 'Registration';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, '#0f172a']}
                style={styles.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <Text style={styles.title}>{getRoleTitle()}</Text>
                    <Text style={styles.subtitle}>Create your account</Text>

                    <View style={styles.methodContainer}>
                        <TouchableOpacity
                            style={[styles.methodTab, method === 'MOBILE' && styles.activeMethodTab]}
                            onPress={() => setMethod('MOBILE')}
                        >
                            <Text style={[styles.methodText, method === 'MOBILE' && styles.activeMethodText]}>Mobile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.methodTab, method === 'EMAIL' && styles.activeMethodTab]}
                            onPress={() => setMethod('EMAIL')}
                        >
                            <Text style={[styles.methodText, method === 'EMAIL' && styles.activeMethodText]}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    <BlurView intensity={20} tint="dark" style={styles.formCard}>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name={method === 'MOBILE' ? 'call-outline' : 'mail-outline'}
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={method === 'MOBILE' ? "Mobile Number" : "Email Address"}
                                placeholderTextColor={colors.textSecondary}
                                value={identifier}
                                onChangeText={setIdentifier}
                                keyboardType={method === 'MOBILE' ? 'phone-pad' : 'email-address'}
                                autoCapitalize="none"
                                editable={!otpVerified}
                            />
                            {!otpVerified && (
                                <TouchableOpacity onPress={handleSendOTP} style={styles.otpButton}>
                                    <Text style={styles.otpButtonText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
                                </TouchableOpacity>
                            )}
                            {otpVerified && (
                                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                            )}
                        </View>

                        {otpSent && !otpVerified && (
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="key-outline"
                                    size={20}
                                    color={colors.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter OTP"
                                    placeholderTextColor={colors.textSecondary}
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                                <TouchableOpacity onPress={handleVerifyOTP} style={styles.verifyButton}>
                                    <Text style={styles.verifyButtonText}>Verify</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading || !otpVerified}
                            style={[styles.registerButton, (!otpVerified) && styles.disabledButton]}
                        >
                            <LinearGradient
                                colors={[colors.primary, '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </BlurView>
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    content: {
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
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 32,
    },
    methodContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    methodTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeMethodTab: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    methodText: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    activeMethodText: {
        color: colors.primary,
    },
    formCard: {
        borderRadius: 24,
        padding: 24,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
    },
    registerButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    buttonGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    otpButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderRadius: 8,
    },
    otpButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    verifyButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default RegisterScreen;
