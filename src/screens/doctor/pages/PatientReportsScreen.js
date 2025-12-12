import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../../components/GradientBackground';
import { useTheme } from '../../../context/ThemeContext';
import { BlurView } from 'expo-blur';

const PatientReportsScreen = ({ navigation }) => {
    const { colors, isDarkMode } = useTheme();
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [showReports, setShowReports] = useState(false);

    const handleSearch = () => {
        if (!patientName.trim() || !patientId.trim()) {
            alert.error('Error', 'Please enter both Patient Name and ID');
            return;
        }
        // Mock search - in real app, fetch from API
        setShowReports(true);
    };

    const ReportCard = ({ title, date, status, icon, color }) => (
        <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.reportCard, { borderColor: colors.glassBorder }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.reportInfo}>
                <Text style={[styles.reportTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.reportDate, { color: colors.textSecondary }]}>{date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status === 'Normal' ? '#10b98120' : '#f59e0b20' }]}>
                <Text style={[styles.statusText, { color: status === 'Normal' ? '#10b981' : '#f59e0b' }]}>{status}</Text>
            </View>
        </BlurView>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { borderBottomColor: colors.glassBorder }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Patient Reports</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={[styles.searchContainer, { borderColor: colors.glassBorder }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Patient Details</Text>

                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                color: colors.text,
                                borderColor: colors.glassBorder
                            }]}
                            placeholder="Patient Name"
                            placeholderTextColor={colors.textSecondary}
                            value={patientName}
                            onChangeText={setPatientName}
                        />

                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                color: colors.text,
                                borderColor: colors.glassBorder
                            }]}
                            placeholder="Patient ID"
                            placeholderTextColor={colors.textSecondary}
                            value={patientId}
                            onChangeText={setPatientId}
                        />

                        <TouchableOpacity
                            style={[styles.searchButton, { backgroundColor: colors.primary }]}
                            onPress={handleSearch}
                        >
                            <Text style={styles.searchButtonText}>View Reports</Text>
                        </TouchableOpacity>
                    </BlurView>

                    {showReports && (
                        <View style={styles.reportsSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical Reports</Text>
                            <ReportCard
                                title="Blood Test (CBC)"
                                date="Nov 28, 2025"
                                status="Normal"
                                icon="water"
                                color="#ef4444"
                            />
                            <ReportCard
                                title="Chest X-Ray"
                                date="Nov 25, 2025"
                                status="Review"
                                icon="scan"
                                color="#3b82f6"
                            />
                            <ReportCard
                                title="Lipid Profile"
                                date="Nov 20, 2025"
                                status="Normal"
                                icon="fitness"
                                color="#10b981"
                            />

                            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Current Medications</Text>
                            <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.medCard, { borderColor: colors.glassBorder }]}>
                                <Text style={[styles.medName, { color: colors.text }]}>Amoxicillin 500mg</Text>
                                <Text style={[styles.medDosage, { color: colors.textSecondary }]}>1 tablet - Twice daily</Text>
                            </BlurView>
                            <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"} style={[styles.medCard, { borderColor: colors.glassBorder }]}>
                                <Text style={[styles.medName, { color: colors.text }]}>Paracetamol 650mg</Text>
                                <Text style={[styles.medDosage, { color: colors.textSecondary }]}>1 tablet - SOS</Text>
                            </BlurView>
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    searchContainer: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 24,
        overflow: 'hidden',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    searchButton: {
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    reportsSection: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    reportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    reportInfo: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    reportDate: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    medCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
        overflow: 'hidden',
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    medDosage: {
        fontSize: 14,
    },
});

export default PatientReportsScreen;
