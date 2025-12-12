import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const CustomAlert = ({ visible, type = 'info', title, message, buttons = [], onDismiss }) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'checkmark-circle', color: '#10b981', gradient: ['#10b981', '#059669'] };
            case 'error':
                return { name: 'close-circle', color: '#ef4444', gradient: ['#ef4444', '#dc2626'] };
            case 'warning':
                return { name: 'warning', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] };
            default:
                return { name: 'information-circle', color: colors.primary, gradient: [colors.primary, '#3b82f6'] };
        }
    };

    const iconConfig = getIconConfig();

    const handleButtonPress = (onPress) => {
        if (onPress) onPress();
        if (onDismiss) onDismiss();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                    <Animated.View style={[styles.alertContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <BlurView intensity={80} tint="dark" style={styles.alertContent}>
                            {/* Icon */}
                            <View style={styles.iconContainer}>
                                <LinearGradient
                                    colors={iconConfig.gradient}
                                    style={styles.iconGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name={iconConfig.name} size={40} color="#fff" />
                                </LinearGradient>
                            </View>

                            {/* Title */}
                            {title && <Text style={styles.title}>{title}</Text>}

                            {/* Message */}
                            {message && <Text style={styles.message}>{message}</Text>}

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {buttons.length === 0 ? (
                                    <TouchableOpacity
                                        style={styles.singleButton}
                                        onPress={() => handleButtonPress(null)}
                                    >
                                        <LinearGradient
                                            colors={iconConfig.gradient}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.buttonText}>OK</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : (
                                    buttons.map((button, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.button,
                                                button.style === 'cancel' && styles.cancelButton,
                                                buttons.length === 1 && styles.singleButton
                                            ]}
                                            onPress={() => handleButtonPress(button.onPress)}
                                        >
                                            {button.style === 'cancel' ? (
                                                <View style={styles.cancelButtonContent}>
                                                    <Text style={styles.cancelButtonText}>{button.text}</Text>
                                                </View>
                                            ) : (
                                                <LinearGradient
                                                    colors={iconConfig.gradient}
                                                    style={styles.buttonGradient}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                >
                                                    <Text style={styles.buttonText}>{button.text}</Text>
                                                </LinearGradient>
                                            )}
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        </BlurView>
                    </Animated.View>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    blurContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: '85%',
        maxWidth: 400,
    },
    alertContent: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        overflow: 'hidden',
    },
    singleButton: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cancelButtonContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CustomAlert;
