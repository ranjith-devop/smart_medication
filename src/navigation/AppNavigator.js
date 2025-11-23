import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen'; // Fallback
import ChatScreen from '../screens/ChatScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResidentsScreen from '../screens/ResidentsScreen';

import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import CaregiverDashboard from '../screens/caregiver/CaregiverDashboard';
import UserDashboard from '../screens/user/UserDashboard';

import PatientDetailsScreen from '../screens/doctor/PatientDetailsScreen';
import EPrescriptionScreen from '../screens/doctor/EPrescriptionScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    // Define which routes should show in the tab bar
    const visibleRoutes = ['Dashboard', 'Residents', 'Inventory', 'MyMeds', 'Chat', 'Profile'];

    return (
        <View style={styles.tabBarContainer}>
            <BlurView intensity={80} tint="dark" style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    if (!visibleRoutes.includes(route.name)) return null;

                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let iconName;
                    if (route.name === 'Dashboard') iconName = isFocused ? 'grid' : 'grid-outline';
                    else if (route.name === 'Residents') iconName = isFocused ? 'people' : 'people-outline';
                    else if (route.name === 'Inventory' || route.name === 'MyMeds') iconName = isFocused ? 'medkit' : 'medkit-outline';
                    else if (route.name === 'Chat') iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
                    else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';
                    else iconName = 'ellipse';

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.tabItemContainer}
                            onPress={onPress}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={isFocused ? colors.primary : colors.textSecondary}
                            />
                            {isFocused && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

// Import TouchableOpacity for the custom tab bar
import { TouchableOpacity } from 'react-native';

export const AppNavigator = () => {
    const { role } = useAuth();

    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                }
            }}
        >
            {role === 'DOCTOR' && (
                <>
                    <Tab.Screen name="Dashboard" component={DoctorDashboard} />
                    <Tab.Screen name="Residents" component={ResidentsScreen} />
                    <Tab.Screen name="Inventory" component={InventoryScreen} />
                    <Tab.Screen name="Chat" component={ChatScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                    <Tab.Screen name="PatientDetails" component={PatientDetailsScreen} />
                    <Tab.Screen name="EPrescription" component={EPrescriptionScreen} />
                </>
            )}

            {role === 'CAREGIVER' && (
                <>
                    <Tab.Screen name="Dashboard" component={CaregiverDashboard} />
                    <Tab.Screen name="Residents" component={ResidentsScreen} />
                    <Tab.Screen name="Inventory" component={InventoryScreen} />
                    <Tab.Screen name="Chat" component={ChatScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                    <Tab.Screen name="PatientDetails" component={PatientDetailsScreen} />
                </>
            )}

            {role === 'USER' && (
                <>
                    <Tab.Screen name="Dashboard" component={UserDashboard} />
                    <Tab.Screen name="MyMeds" component={InventoryScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                </>
            )}

            {/* Fallback for development or undefined role */}
            {!role && (
                <Tab.Screen name="Dashboard" component={HomeScreen} />
            )}
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'rgba(15, 23, 42, 0.85)', // Slightly more opaque for better visibility
    },
    tabItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary,
    }
});
