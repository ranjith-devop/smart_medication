import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';



import { useAuth } from '../context/AuthContext';

const InventoryScreen = () => {
    const { medicines, setMedicines, residents } = useApp();
    const { role } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [newMedName, setNewMedName] = useState('');
    const [newMedStock, setNewMedStock] = useState('');
    const [selectedResident, setSelectedResident] = useState(residents[0]?.id);

    const handleAdd = () => {
        if (!newMedName.trim() || !newMedStock.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const newMed = {
            id: Date.now().toString(),
            name: newMedName,
            stock: parseInt(newMedStock),
            threshold: 5, // Default threshold
            expiry: '2026-01-01', // Default expiry for manual entry
            residentId: role === 'USER' ? 'SELF' : selectedResident
        };

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMedicines(prev => [...prev, newMed]);
        setNewMedName('');
        setNewMedStock('');
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Medicine',
            'Are you sure you want to remove this medicine?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setMedicines(prev => prev.filter(m => m.id !== id));
                    }
                }
            ]
        );
    };

    const getStockStatus = (stock, threshold) => {
        if (stock <= threshold) return { color: colors.error, label: 'Low Stock' };
        if (stock <= threshold * 2) return { color: colors.warning, label: 'Medium' };
        return { color: colors.success, label: 'Good' };
    };

    const renderItem = ({ item }) => {
        // For USER role, only show their own meds (mocked as 'SELF' or just all for demo if we want to show something)
        // For demo purposes, if USER, we show everything but hide resident name to make it look personal
        // In a real app: if (role === 'USER' && item.residentId !== 'SELF') return null;

        const status = getStockStatus(item.stock, item.threshold);
        const residentName = residents.find(r => r.id === item.residentId)?.name || 'Unknown';

        return (
            <GlassCard style={styles.medCard}>
                <View style={styles.medIconContainer}>
                    <Ionicons name="medkit" size={24} color={colors.primary} />
                </View>
                <View style={styles.medInfo}>
                    <Text style={styles.medName}>{item.name}</Text>
                    {role !== 'USER' && <Text style={styles.residentLabel}>For: {residentName}</Text>}
                    <View style={styles.stockRow}>
                        <Text style={styles.medStock}>Stock: {item.stock}</Text>
                        <View style={[styles.badge, { backgroundColor: status.color }]}>
                            <Text style={styles.badgeText}>{status.label}</Text>
                        </View>
                    </View>
                    <Text style={styles.medExpiry}>Expires: {item.expiry}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
            </GlassCard>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{role === 'USER' ? 'My Medicine Cabinet' : 'Inventory'}</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.scanButton} onPress={() => Alert.alert("Scanner", "Camera scanner would open here.")}>
                            <Ionicons name="barcode-outline" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setIsAdding(!isAdding);
                        }} style={styles.addButton}>
                            <Ionicons name={isAdding ? "close" : "add"} size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {isAdding && (
                    <View style={styles.addForm}>
                        <GlassCard>
                            <Text style={styles.formTitle}>Add New Medicine</Text>

                            {role !== 'USER' && (
                                <View style={styles.residentSelector}>
                                    <Text style={styles.label}>Resident:</Text>
                                    <FlatList
                                        horizontal
                                        data={residents}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => setSelectedResident(item.id)}
                                                style={[
                                                    styles.residentChip,
                                                    selectedResident === item.id && styles.residentChipActive
                                                ]}
                                            >
                                                <Text style={styles.residentChipText}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder="Medicine Name"
                                placeholderTextColor={colors.textSecondary}
                                value={newMedName}
                                onChangeText={setNewMedName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Stock Quantity"
                                placeholderTextColor={colors.textSecondary}
                                value={newMedStock}
                                onChangeText={setNewMedStock}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                                <Text style={styles.saveButtonText}>Save Medicine</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    </View>
                )}

                <FlatList
                    data={medicines}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="medical-outline" size={64} color={colors.textSecondary} />
                            <Text style={styles.emptyText}>Your cabinet is empty.</Text>
                        </View>
                    }
                />
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    medIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    medInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        marginBottom: 2,
    },
    residentLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    medStock: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        color: colors.white,
        fontWeight: 'bold',
    },
    medExpiry: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    deleteButton: {
        padding: 8,
    },
    addForm: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
        marginBottom: 16,
    },
    label: {
        color: colors.textSecondary,
        marginBottom: 8,
    },
    residentSelector: {
        marginBottom: 16,
    },
    residentChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginRight: 8,
    },
    residentChipActive: {
        backgroundColor: colors.primary,
    },
    residentChipText: {
        color: colors.white,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 12,
        color: colors.white,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: colors.white,
        marginTop: 16,
    },
});

export default InventoryScreen;
