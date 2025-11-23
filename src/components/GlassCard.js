import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

export const GlassCard = ({ children, style, intensity = 20 }) => {
    return (
        <BlurView intensity={intensity} tint="dark" style={[styles.container, style]}>
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
});
