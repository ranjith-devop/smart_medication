import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';

const LoginScreen = ({ navigation, route }) => {
    const { role } = route.params;
    const { login, isLoading, setAuthUser } = useAuth();
    const [method, setMethod] = useState('MOBILE'); // 'MOBILE' or 'EMAIL'
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loginMode, setLoginMode] = useState('PASSWORD'); // 'PASSWORD' or 'OTP'
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Import authService dynamically or top level if context doesn't cover it
    // Assuming we use direct service calls here for OTP, then Context for final Token set
    const { sendMobileOtp, sendEmailOtp, googleAuth, loginWithPassword } = require('../../services/authService').default;

    const handleLogin = async () => {
        if (!identifier) {
            alert('Please enter your ' + (method === 'MOBILE' ? 'Phone Number' : 'Email Address'));
            return;
        }

        setLoading(true);
        try {
            if (loginMode === 'PASSWORD') {
                if (!password) {
                    alert('Please enter your password');
                    setLoading(false);
                    return;
                }

                // Password login
                const response = await loginWithPassword(identifier, password);
                await setAuthUser({
                    ...response,
                    role: role || response.role || 'USER'
                });
                setLoading(false);
            } else {
                // OTP login (existing code)
                if (method === 'MOBILE') {
                    await sendMobileOtp(identifier);
                } else {
                    await sendEmailOtp(identifier);
                }
                setLoading(false);
                navigation.navigate('OtpVerification', { type: method.toLowerCase(), value: identifier, role });
            }
        } catch (error) {
            setLoading(false);
            if (error.requiresRegistration) {
                // User exists but hasn't completed registration
                alert('Please complete registration using OTP');
                setLoginMode('OTP');
            } else {
                alert(error.message || 'Login failed');
            }
        }
    };

    const handleGoogleLogin = async () => {
        // MOCK GOOGLE LOGIN FOR NOW
        // In real app, use GoogleSignin.signIn() to get idToken
        const mockIdToken = "mock_google_id_token";
        const mockUserInfo = {
            email: "user@example.com",
            name: "Mock User",
            googleId: "mock_google_id_123"
        };

        try {
            setLoading(true);
            const response = await googleAuth(mockIdToken, mockUserInfo);

            // Use setAuthUser instead of navigation.reset
            await setAuthUser({
                ...response,
                role: role || response.role || 'USER'
            });

            setLoading(false);
            // Navigation happens automatically via RootNavigator
        } catch (error) {
            setLoading(false);
            alert(error.message || 'Google Sign-In Failed');
        }
    };

    const getRoleTitle = () => {
        switch (role) {
            case 'DOCTOR': return 'Doctor Login';
            case 'CAREGIVER': return 'Caregiver Login';
            case 'USER': return 'User Login';
            default: return 'Login';
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
                    <Text style={styles.subtitle}>
                        {loginMode === 'PASSWORD' ? 'Sign in with Password' : 'Sign in with OTP'}
                    </Text>

                    {/* Login Mode Toggle */}
                    <View style={styles.methodContainer}>
                        <TouchableOpacity
                            style={[styles.methodTab, loginMode === 'PASSWORD' && styles.activeMethodTab]}
                            onPress={() => setLoginMode('PASSWORD')}
                        >
                            <Text style={[styles.methodText, loginMode === 'PASSWORD' && styles.activeMethodText]}>Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.methodTab, loginMode === 'OTP' && styles.activeMethodTab]}
                            onPress={() => setLoginMode('OTP')}
                        >
                            <Text style={[styles.methodText, loginMode === 'OTP' && styles.activeMethodText]}>OTP</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mobile/Email Toggle (only show in OTP mode) */}
                    {loginMode === 'OTP' && (
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
                    )}

                    <BlurView intensity={20} tint="dark" style={styles.formCard}>

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
                            />
                        </View>

                        {/* Password Input (show only in PASSWORD mode) */}
                        {loginMode === 'PASSWORD' && (
                            <>
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
                                        secureTextEntry
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={() => setShowForgotPassword(true)}
                                    style={styles.forgotButton}
                                >
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={[colors.primary, '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>
                                    {loading
                                        ? (loginMode === 'PASSWORD' ? 'Logging in...' : 'Sending OTP...')
                                        : (loginMode === 'PASSWORD' ? 'Login' : 'Get OTP')
                                    }
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                            <Text style={{ color: colors.textSecondary, marginHorizontal: 10 }}>OR</Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        </View>

                        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                            <Ionicons name="logo-google" size={20} color={colors.text} style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </BlurView>
                </ScrollView>
            </KeyboardAvoidingView>

            <ForgotPasswordModal
                visible={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                initialMethod={method}
            />
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
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: colors.primary,
        fontSize: 14,
    },
    loginButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
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
    googleButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    googleButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    registerLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
