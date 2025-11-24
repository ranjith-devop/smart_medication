import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'DOCTOR', 'CAREGIVER', 'USER'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const storedRole = await AsyncStorage.getItem('role');
                if (storedUser && storedRole) {
                    setUser(JSON.parse(storedUser));
                    setRole(storedRole);
                }
            } catch (e) {
                console.error("Failed to load user", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (selectedRole, method, credentials) => {
        setIsLoading(true);
        // MOCK LOGIN LOGIC
        // In a real app, verify credentials with backend

        const mockUser = {
            id: Date.now().toString(),
            name: credentials.name || 'Test User',
            email: method === 'EMAIL' ? credentials.identifier : undefined,
            phone: method === 'MOBILE' ? credentials.identifier : undefined,
            role: selectedRole
        };

        try {
            await AsyncStorage.setItem('user', JSON.stringify(mockUser));
            await AsyncStorage.setItem('role', selectedRole);
            setUser(mockUser);
            setRole(selectedRole);
        } catch (e) {
            console.error("Login failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('role');
            setUser(null);
            setRole(null);
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
