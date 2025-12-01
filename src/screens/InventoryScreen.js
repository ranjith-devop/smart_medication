import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { GradientBackground } from '../components/GradientBackground';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const InventoryScreen = () => {
    const { medicines, setMedicines, residents } = useApp();
    const { role } = useAuth();
    const { colors, isDarkMode } = useContext(ThemeContext);
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
        const status = getStockStatus(item.stock, item.threshold);
        const residentName = residents.find(r => r.id === item.residentId)?.name || 'Unknown';

        return (
            <GlassCard style={styles.medCard}>
                <View style={[styles.medIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Ionicons name="medkit" size={24} color={colors.primary} />
                </View>
                <View style={styles.medInfo}>
                    <Text style={[styles.medName, { color: colors.text }]}>{item.name}</Text>
                    {role !== 'USER' && <Text style={[styles.residentLabel, { color: colors.textSecondary }]}>For: {residentName}</Text>}
                    <View style={styles.stockRow}>
                        <Text style={[styles.medStock, { color: colors.textSecondary }]}>Stock: {item.stock}</Text>
                        <View style={[styles.badge, { backgroundColor: status.color }]}>
                            <Text style={styles.badgeText}>{status.label}</Text>
                        </View>
                    </View>
                    <Text style={[styles.medExpiry, { color: colors.textSecondary }]}>Expires: {item.expiry}</Text>
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
                    <Text style={[styles.title, { color: colors.text }]}>{role === 'USER' ? 'My Medicine Cabinet' : 'Inventory'}</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.scanButton} onPress={() => Alert.alert("Scanner", "Camera scanner would open here.")}>
                            <Ionicons name="barcode-outline" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setIsAdding(!isAdding);
                        }} style={[styles.addButton, { backgroundColor: colors.primary }]}>
                            <Ionicons name={isAdding ? "close" : "add"} size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {isAdding && (
                    <View style={styles.addForm}>
                        <GlassCard>
                            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Medicine</Text>

                            {role !== 'USER' && (
                                <View style={styles.residentSelector}>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>Resident:</Text>
                                    <FlatList
                                        horizontal
                                        data={residents}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => setSelectedResident(item.id)}
                                                style={[
                                                    styles.residentChip,
                                                    { backgroundColor: selectedResident === item.id ? colors.primary : 'rgba(255,255,255,0.1)' }
                                                ]}
                                            >
                                                <Text style={[styles.residentChipText, { color: colors.white }]}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                    color: colors.text,
                                    borderColor: colors.glassBorder
                                }]}
                                placeholder="Medicine Name"
                                placeholderTextColor={colors.textSecondary}
                                value={newMedName}
                                onChangeText={setNewMedName}
                            />
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                    color: colors.text,
                                    borderColor: colors.glassBorder
                                }]}
                                placeholder="Stock Quantity"
                                placeholderTextColor={colors.textSecondary}
                                value={newMedStock}
                                onChangeText={setNewMedStock}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleAdd}>
                                <Text style={[styles.saveButtonText, { color: colors.white }]}>Save Medicine</Text>
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
                            <Text style={[styles.emptyText, { color: colors.text }]}>Your cabinet is empty.</Text>
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
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        marginBottom: 2,
    },
    residentLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    medStock: {
        fontSize: 14,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    medExpiry: {
        fontSize: 12,
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
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    residentSelector: {
        marginBottom: 16,
    },
    residentChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    residentChipText: {
        // color handled inline
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    saveButton: {
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
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
        marginTop: 16,
    },
});

export default InventoryScreen;
