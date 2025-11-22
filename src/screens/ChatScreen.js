import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { sendMessageToGemini, parseMedicineIntent } from '../services/aiService';
import { GradientBackground } from '../components/GradientBackground';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { BlurView } from 'expo-blur';

const ChatScreen = () => {
    const { setMedicines } = useApp();
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

        try {
            const intent = parseMedicineIntent(userMessage.text);
            if (intent) {
                if (intent.action === 'ADD') {
                    setMedicines(prev => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            name: intent.name,
                            stock: intent.quantity,
                            expiry: '2025-01-01',
                            residentId: '1'
                        }
                    ]);
                } else if (intent.action === 'REMOVE') {
                    setMedicines(prev => prev.filter(m => m.name.toLowerCase() !== intent.name.toLowerCase()));
                }

                const responseText = `I've ${intent.action === 'ADD' ? 'added' : 'removed'} ${intent.quantity} ${intent.name} ${intent.action === 'ADD' ? 'to' : 'from'} your inventory.`;
                const aiMessage = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai' };
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);
                return;
            }

            const response = await sendMessageToGemini([...messages, userMessage]);
            const aiMessage = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { id: (Date.now() + 1).toString(), text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const userMessage = {
                id: Date.now().toString(),
                text: 'Analyze this medical report. Extract key values (e.g., blood pressure, sugar levels) in a concise list. Based on these values, suggest any potential diagnosis or health concerns. Keep it short and easy to understand.',
                sender: 'user',
                image: result.assets[0].uri
            };
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            try {
                const response = await sendMessageToGemini([...messages, userMessage], result.assets[0].base64);
                const aiMessage = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
                setMessages(prev => [...prev, aiMessage]);
            } catch (error) {
                const errorMessage = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't analyze the image.", sender: 'ai' };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.aiBubble
        ]}>
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userText : styles.aiText
            ]}>{item.text}</Text>
        </View>
    );

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Smart Assistant</Text>
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
                    <BlurView intensity={30} tint="dark" style={styles.inputContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                            <Ionicons name="camera" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                            placeholderTextColor={colors.textSecondary}
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
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
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
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
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: colors.white,
    },
    aiText: {
        color: colors.white,
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
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        fontSize: 16,
        color: colors.white,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconButton: {
        padding: 8,
    },
    sendButton: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatScreen;
