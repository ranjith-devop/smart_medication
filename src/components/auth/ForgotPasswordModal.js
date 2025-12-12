import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import authService from '../../services/authService';
import { useAlert } from '../../context/AlertContext';

const ForgotPasswordModal = ({ visible, onClose, initialMethod = 'MOBILE' }) => {
    const alert = useAlert();
    const [method, setMethod] = useState(initialMethod);
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!identifier) {
            alert.error('Error', 'Please enter your ' + (method === 'MOBILE' ? 'phone number' : 'email'));
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(identifier, method);
            alert.success('Success', 'Reset code sent successfully!');
            setStep(2);
        } catch (error) {
            alert.error('Error', error.message || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async () => {
        if (!otp) {
            alert.error('Error', 'Please enter the OTP');
            return;
        }
        if (!newPassword || !confirmPassword) {
            alert.error('Error', 'Please enter and confirm your new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert.error('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(identifier, otp, newPassword, method);
            alert.success('Success', 'Password reset successfully!', [
                { text: 'OK', onPress: handleClose }
            ]);
        } catch (error) {
            alert.error('Error', error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setIdentifier('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <BlurView intensity={40} tint="dark" style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Reset Password</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        {step === 1 && (
                            <>
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

                                <View style={styles.inputContainer}>
                                    <Ionicons
                                        name={method === 'MOBILE' ? 'call-outline' : 'mail-outline'}
                                        size={20}
                                        color={colors.textSecondary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={method === 'MOBILE' ? "Enter Mobile Number" : "Enter Email Address"}
                                        placeholderTextColor={colors.textSecondary}
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                        keyboardType={method === 'MOBILE' ? 'phone-pad' : 'email-address'}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity style={styles.actionButton} onPress={handleSendOTP} disabled={loading}>
                                    <LinearGradient
                                        colors={[colors.primary, '#3b82f6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? 'Sending...' : 'Send Reset Code'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Text style={styles.stepInfo}>Enter the code sent to {identifier}</Text>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="key-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter OTP"
                                        placeholderTextColor={colors.textSecondary}
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="New Password"
                                        placeholderTextColor={colors.textSecondary}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor={colors.textSecondary}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                </View>

                                <TouchableOpacity style={styles.actionButton} onPress={handleVerifyAndReset} disabled={loading}>
                                    <LinearGradient
                                        colors={[colors.primary, '#3b82f6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </KeyboardAvoidingView>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    stepInfo: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    methodContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    methodTab: {
        flex: 1,
        paddingVertical: 10,
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
    actionButton: {
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
});

export default ForgotPasswordModal;
