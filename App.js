import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AlertProvider } from './src/context/AlertContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <AppProvider>
                        <AlertProvider>
                            <StatusBar style="auto" />
                            <RootNavigator />
                        </AlertProvider>
                    </AppProvider>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
