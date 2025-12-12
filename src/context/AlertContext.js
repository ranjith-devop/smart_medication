import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        buttons: [],
    });

    const showAlert = ({ type = 'info', title, message, buttons = [] }) => {
        setAlertConfig({
            visible: true,
            type,
            title,
            message,
            buttons,
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // Convenience methods
    const alert = {
        show: showAlert,
        success: (title, message, buttons) => showAlert({ type: 'success', title, message, buttons }),
        error: (title, message, buttons) => showAlert({ type: 'error', title, message, buttons }),
        warning: (title, message, buttons) => showAlert({ type: 'warning', title, message, buttons }),
        info: (title, message, buttons) => showAlert({ type: 'info', title, message, buttons }),
    };

    return (
        <AlertContext.Provider value={alert}>
            {children}
            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onDismiss={hideAlert}
            />
        </AlertContext.Provider>
    );
};
