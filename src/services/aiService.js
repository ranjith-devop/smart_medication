import axios from 'axios';
import { CONFIG } from '../config';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const sendMessageToGemini = async (messages, imageBase64 = null) => {
    try {
        const apiKey = CONFIG.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            throw new Error('Please set your Gemini API Key in src/config.js');
        }

        const contents = [];

        // Construct the message payload
        const parts = [];
        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                }
            });
        }

        // Add text message (last message from user)
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.text) {
            parts.push({ text: lastMessage.text });
        }

        contents.push({ parts });

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            { contents }
        );

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            // Clean up Markdown formatting (bold markers)
            return aiText.replace(/\*\*/g, '').replace(/\*/g, '-');
        } else {
            return "I'm sorry, I didn't understand that.";
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};

export const parseMedicineIntent = (text) => {
    // Simple regex-based intent parsing for now. 
    // In a real app, we'd ask the LLM to output JSON.
    // Example: "Add 5 Paracetamol"
    const addMatch = text.match(/add\s+(\d+)\s+(.+)/i);
    if (addMatch) {
        return {
            action: 'ADD',
            quantity: parseInt(addMatch[1]),
            name: addMatch[2].trim()
        };
    }

    const removeMatch = text.match(/remove\s+(\d+)\s+(.+)/i);
    if (removeMatch) {
        return {
            action: 'REMOVE',
            quantity: parseInt(removeMatch[1]),
            name: removeMatch[2].trim()
        };
    }

    return null;
};
