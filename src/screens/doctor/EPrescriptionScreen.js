import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useAlert } from '../../context/AlertContext';

const EPrescriptionScreen = ({ navigation, route }) => {
    const alert = useAlert();
    const { resident } = route.params;
    const { setMedicines } = useApp(); // In a real app, we would have a more robust addMedicine function

    const [medName, setMedName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');

    const handlePrescribe = () => {
        if (!medName || !dosage) {
            alert.error('Error', 'Please fill in Medicine Name and Dosage');
            return;
        }

        // Mock adding medicine
        const newMed = {
            id: Date.now().toString(),
            name: medName,
            stock: 30, // Default stock
            threshold: 10,
            expiry: '2026-01-01', // Default expiry
            residentId: resident.id,
            dosage: dosage,
            frequency: frequency,
            duration: duration
        };

        setMedicines(prev => [...prev, newMed]);
        alert.success('Success', 'Prescription sent successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
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
                <Text style={styles.title}>E-Prescription</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.patientCard}>
                    <Text style={styles.patientLabel}>Prescribing for:</Text>
                    <Text style={styles.patientName}>{resident.name}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Medicine Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Amoxicillin"
                        placeholderTextColor={colors.textSecondary}
                        value={medName}
                        onChangeText={setMedName}
                    />

                    <Text style={styles.label}>Dosage</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 500mg"
                        placeholderTextColor={colors.textSecondary}
                        value={dosage}
                        onChangeText={setDosage}
                    />

                    <Text style={styles.label}>Frequency</Text>
                    <View style={styles.chipContainer}>
                        {['1x Daily', '2x Daily', '3x Daily', 'As Needed'].map((freq) => (
                            <TouchableOpacity
                                key={freq}
                                style={[styles.chip, frequency === freq && styles.activeChip]}
                                onPress={() => setFrequency(freq)}
                            >
                                <Text style={[styles.chipText, frequency === freq && styles.activeChipText]}>{freq}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Duration (Days)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 7"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                        value={duration}
                        onChangeText={setDuration}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handlePrescribe}>
                        <LinearGradient
                            colors={[colors.primary, '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>Send Prescription</Text>
                        </LinearGradient>
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
    patientCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    patientLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        padding: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        fontSize: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeChip: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    activeChipText: {
        color: colors.primary,
        fontWeight: '600',
    },
    submitButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 24,
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

export default EPrescriptionScreen;
