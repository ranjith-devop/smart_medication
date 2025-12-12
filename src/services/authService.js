import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// NOTE: For Android Emulator use 'http://10.0.2.2:5001'
// For iOS Simulator use 'http://localhost:5001'
// For Physical Device use your machine's LAN IP (e.g., 'http://192.168.1.5:5001')

import Constants from 'expo-constants';

const getApiUrl = () => {
    // Use the Metro bundler URL to detect if we're on a physical device
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

    // If debuggerHost contains a LAN IP (not localhost), we're on a physical device
    const isPhysicalDevice = debuggerHost && !debuggerHost.includes('localhost') && !debuggerHost.includes('127.0.0.1');

    if (isPhysicalDevice) {
        // Extract IP from debuggerHost (format: "10.205.45.158:8081")
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:5001/api`;
    }

    // Emulator/Simulator
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5001/api';  // Android Emulator
    } else {
        return 'http://localhost:5001/api';  // iOS Simulator
    }
};

const API_URL = `${getApiUrl()}/auth`;

const authService = {
    sendMobileOtp: async (phoneNumber) => {
        try {
            console.log('Attempting to send OTP to:', phoneNumber);
            console.log('API URL:', `${API_URL}/send-otp-mobile`);
            const response = await axios.post(`${API_URL}/send-otp-mobile`, { phoneNumber });
            console.log('OTP Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('OTP Error:', error);
            console.error('Error details:', error.response?.data || error.message);
            throw error.response ? error.response.data : { message: error.message || 'Network Error' };
        }
    },

    verifyMobileOtp: async (phoneNumber, otp) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp-mobile`, { phoneNumber, otp });
            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    sendEmailOtp: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/send-otp-email`, { email });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    verifyEmailOtp: async (email, otp) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp-email`, { email, otp });
            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    finishRegistration: async (userId, name, password) => {
        try {
            const response = await axios.post(`${API_URL}/register-finish`, { userId, name, password });
            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    googleAuth: async (idToken, userInfo) => {
        try {
            // Sending userInfo (email, name) along with token for our Mock/Hybrid verification
            const response = await axios.post(`${API_URL}/google`, { idToken, ...userInfo });
            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    loginWithPassword: async (identifier, password) => {
        try {
            console.log('Attempting password login for:', identifier);
            const response = await axios.post(`${API_URL}/login`, { identifier, password });
            console.log('Login Response:', response.data);

            if (response.data.token) {
                await AsyncStorage.setItem('userToken', response.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error.response ? error.response.data : { message: error.message || 'Login Failed' };
        }
    },

    forgotPassword: async (identifier, method) => {
        try {
            console.log('Requesting password reset for:', identifier, 'via', method);
            const response = await axios.post(`${API_URL}/forgot-password`, { identifier, method });
            console.log('Forgot Password Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Forgot Password Error:', error);
            throw error.response ? error.response.data : { message: error.message || 'Failed to send reset code' };
        }
    },

    resetPassword: async (identifier, otp, newPassword, method) => {
        try {
            console.log('Resetting password for:', identifier);
            const response = await axios.post(`${API_URL}/reset-password`, {
                identifier,
                otp,
                newPassword,
                method
            });
            console.log('Reset Password Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Reset Password Error:', error);
            throw error.response ? error.response.data : { message: error.message || 'Failed to reset password' };
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
    }
};

export default authService;
