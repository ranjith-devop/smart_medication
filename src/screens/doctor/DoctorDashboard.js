import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../../context/AlertContext';

const DoctorDashboard = ({ navigation }) => {
    const alert = useAlert();
    const { user, logout } = useAuth();
    const { colors, isDarkMode } = useTheme();
    const [isPrescribeModalVisible, setIsPrescribeModalVisible] = React.useState(false);
    const [patientName, setPatientName] = React.useState('');
    const [patientId, setPatientId] = React.useState('');

    const handlePrescribeSubmit = () => {
        if (!patientName.trim() || !patientId.trim()) {
            alert.error('Error', 'Please enter both Patient Name and ID');
            return;
        }

        setIsPrescribeModalVisible(false);
        navigation.navigate('EPrescription', {
            resident: {
                id: patientId,
                name: patientName
            }
        });

        // Reset form
        setPatientName('');
        setPatientId('');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, colors.gradientEnd]}
                style={styles.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome,</Text>
                    <Text style={[styles.name, { color: colors.text }]}>Dr. {user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statsContainer}>
                    <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Patients</Text>
                    </BlurView>
                    <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>5</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Critical</Text>
                    </BlurView>
                    <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reports</Text>
                    </BlurView>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]} onPress={() => navigation.navigate('Residents')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                            <Ionicons name="people" size={24} color="#3b82f6" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>View Patients</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}
                        onPress={() => navigation.navigate('PatientReports')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                            <Ionicons name="document-text" size={24} color="#10b981" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>Reports</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}
                        onPress={() => setIsPrescribeModalVisible(true)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
                            <Ionicons name="medkit" size={24} color="#ec4899" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>Prescribe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]}
                        onPress={() => navigation.navigate('Chat', { autoOpenScanner: true })}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                            <Ionicons name="scan" size={24} color="#f59e0b" />
                        </View>
                        <Text style={[styles.actionText, { color: colors.text }]}>AI Scan</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isPrescribeModalVisible}
                onRequestClose={() => setIsPrescribeModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.modalKeyboardAvoid}
                        >
                            <BlurView intensity={40} tint="dark" style={[styles.modalContent, { borderColor: colors.glassBorder }]}>
                                <Text style={[styles.modalTitle, { color: '#fff' }]}>New Prescription</Text>
                                <Text style={[styles.modalSubtitle, { color: '#cbd5e1' }]}>Enter patient details to proceed</Text>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.inputLabel, { color: '#fff' }]}>Patient Name</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }]}
                                        placeholder="e.g. John Doe"
                                        placeholderTextColor="#94a3b8"
                                        value={patientName}
                                        onChangeText={setPatientName}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.inputLabel, { color: '#fff' }]}>Patient ID</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }]}
                                        placeholder="e.g. P-12345"
                                        placeholderTextColor="#94a3b8"
                                        value={patientId}
                                        onChangeText={setPatientId}
                                    />
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => setIsPrescribeModalVisible(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: colors.primary }]}
                                        onPress={handlePrescribeSubmit}
                                    >
                                        <Text style={styles.submitButtonText}>Proceed</Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        overflow: 'hidden',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalKeyboardAvoid: {
        width: '100%',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DoctorDashboard;
