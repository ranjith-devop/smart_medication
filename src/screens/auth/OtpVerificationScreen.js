import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const OtpVerificationScreen = ({ navigation, route }) => {
    const alert = useAlert();
    const { type, value, role } = route.params; // type: 'mobile' | 'email', value: phoneNumber | email, role: user role
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuth();

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 5) {
            // Logic to focus next ref could be added here preferably with extensive separate inputs
            // For simplicity/speed using simple array state, user taps next or we use a library usually
        }
    };

    // Quick hack to combine otp array to string
    const otpString = otp.join('');

    const handleVerify = async () => {
        if (otpString.length !== 6) {
            alert.error('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (type === 'mobile') {
                response = await authService.verifyMobileOtp(value, otpString);
            } else {
                response = await authService.verifyEmailOtp(value, otpString);
            }

            setLoading(false);

            if (response.isNewUser) {
                navigation.navigate('RegisterFinish', { userId: response._id, role });
            } else {
                // Use setAuthUser instead of navigation.reset
                await setAuthUser({
                    ...response,
                    role: role || response.role || 'USER'
                });
                // Navigation happens automatically
            }

        } catch (error) {
            setLoading(false);
            alert.error('Verification Failed', error.message || 'Invalid OTP');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
                We have sent the verification code to your {type === 'mobile' ? 'mobile number' : 'email address'}
            </Text>
            <Text style={styles.value}>{value}</Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerify}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.verifyButtonText}>Confirm</Text>
                )}
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.resendText}>Didn't receive code? </Text>
                <TouchableOpacity>
                    <Text style={styles.resendLink}>Resend New Code</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
    },
    backButton: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
        lineHeight: 24,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: '#F9F9F9',
        color: 'black',
    },
    verifyButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resendText: {
        color: colors.textSecondary,
    },
    resendLink: {
        color: colors.primary,
        fontWeight: '600',
    }
});

export default OtpVerificationScreen;
