import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

export const GlassCard = ({ children, style, intensity = 20 }) => {
    const { colors, isDarkMode } = useTheme();

    return (
        <BlurView
            intensity={intensity}
            tint={isDarkMode ? "dark" : "light"}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.glassBorder
                },
                style
            ]}
        >
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
});
