import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, LayoutAnimation, Platform, UIManager } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';



const ResidentsScreen = ({ navigation }) => {
    const { residents, addResident } = useApp();
    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [condition, setCondition] = useState('');

    const handleAdd = () => {
        if (name && age) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            addResident(name, age, condition);
            setName('');
            setAge('');
            setCondition('');
            setModalVisible(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('PatientDetails', { resident: item })}>
            <GlassCard style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.details}>{item.age} years old • {item.condition || 'No conditions'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </GlassCard>
        </TouchableOpacity>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Residents</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                        <Ionicons name="person-add" size={20} color={colors.white} />
                        <Text style={styles.addButtonText}>Add New</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={residents}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />

                <Modal visible={isModalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <GlassCard style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Resident</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Age"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                                value={age}
                                onChangeText={setAge}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Medical Condition (Optional)"
                                placeholderTextColor={colors.textSecondary}
                                value={condition}
                                onChangeText={setCondition}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAdd} style={styles.saveButton}>
                                    <Text style={styles.saveText}>Save Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </View>
                </Modal>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: colors.white,
        marginLeft: 8,
        fontWeight: '600',
    },
    list: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
    details: {
        color: colors.textSecondary,
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.background,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 12,
        color: colors.white,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        padding: 12,
    },
    cancelText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    saveText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ResidentsScreen;
