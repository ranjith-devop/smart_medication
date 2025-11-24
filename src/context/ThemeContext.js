import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../theme/themes';
import { colors as defaultColors } from '../theme/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [colors, setColors] = useState(darkTheme);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const storedPreference = await AsyncStorage.getItem('isDarkMode');
            if (storedPreference !== null) {
                const isDark = JSON.parse(storedPreference);
                setIsDarkMode(isDark);
                setColors(isDark ? darkTheme : lightTheme);
            } else {
                // Default to dark mode
                setIsDarkMode(true);
                setColors(darkTheme);
            }
        } catch (e) {
            console.error("Failed to load theme preference", e);
            // Fallback to dark mode
            setColors(darkTheme);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            setColors(newMode ? darkTheme : lightTheme);
            await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
        } catch (e) {
            console.error("Failed to save theme preference", e);
        }
    };

    return (
        <ThemeContext.Provider value={{
            isDarkMode,
            colors,
            toggleTheme,
            isLoading
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
