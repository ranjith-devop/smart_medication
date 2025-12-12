import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GradientBackground } from '../components/GradientBackground';
import { useApp } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';
import { useAlert } from '../context/AlertContext';

const ChatScreen = ({ route }) => {
    const alert = useAlert();
    const { setMedicines } = useApp();
    const { colors, isDarkMode } = useContext(ThemeContext);
    const autoOpenScanner = route?.params?.autoOpenScanner;
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! I am your Smart Meds Assistant. How can I help you today?', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        // Simulate AI response delay
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                text: "This is a mock response. The AI service is currently disconnected.",
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleImageAction = () => {
        alert.info(
            "Upload Medical Report",
            "Choose an option to upload your medical report",
            [
                {
                    text: "Camera",
                    onPress: openCamera
                },
                {
                    text: "Gallery",
                    onPress: openGallery
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const processImage = (result) => {
        if (!result.canceled) {
            const userMessage = {
                id: Date.now().toString(),
                text: 'Analyze this medical report.',
                sender: 'user',
                image: result.assets[0].uri
            };
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            // Simulate AI response delay for image
            setTimeout(() => {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    text: "Mock Analysis Report:\n\n• Blood Pressure: 120/80 mmHg (Normal)\n• Heart Rate: 72 bpm (Normal)\n• Sugar Levels: 95 mg/dL (Normal)\n\nDiagnosis: Vitals are within healthy range. No immediate concerns detected.",
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);
            }, 2000);
        }
    };

    const openCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert.warning("Permission Required", "You've refused to allow this app to access your camera!");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                quality: 0.5,
                base64: true,
            });

            processImage(result);
        } catch (error) {
            console.log("Error opening camera:", error);
            setIsLoading(false);
        }
    };

    const openGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                quality: 0.5,
                base64: true,
            });

            processImage(result);
        } catch (error) {
            console.log("Error opening gallery:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    useEffect(() => {
        if (autoOpenScanner) {
            handleImageAction();
        }
    }, [autoOpenScanner]);

    const renderItem = ({ item }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.glassBorder }]
        ]}>
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userText : { color: colors.text }
            ]}>{item.text}</Text>
        </View>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={[styles.header, { borderBottomColor: colors.glassBorder }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Smart Assistant</Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <BlurView intensity={30} tint={isDarkMode ? "dark" : "light"} style={[styles.inputContainer, { borderTopColor: colors.glassBorder }]}>
                        <TouchableOpacity onPress={handleImageAction} style={styles.iconButton}>
                            <Ionicons name="camera" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                color: colors.text,
                                borderColor: colors.glassBorder
                            }]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textSecondary}
                        />
                        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.primary }]} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Ionicons name="send" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </BlurView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#3b82f6', // Keep primary color static or use colors.primary if available in scope (it is not in styles scope)
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        fontSize: 16,
        borderWidth: 1,
    },
    iconButton: {
        padding: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatScreen;
