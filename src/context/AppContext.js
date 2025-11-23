import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Dummy Initial Data for Demo
    const [residents, setResidents] = useState([
        { id: '1', name: 'Grandpa John', age: 78, condition: 'Hypertension' },
        { id: '2', name: 'Grandma Mary', age: 75, condition: 'Diabetes' },
    ]);

    const [medicines, setMedicines] = useState([
        {
            id: '101',
            name: 'Aspirin',
            stock: 5,
            threshold: 10,
            expiry: '2025-11-25', // Expiring soon
            residentId: '1',
            dosage: '100mg'
        },
        {
            id: '102',
            name: 'Metformin',
            stock: 45,
            threshold: 10,
            expiry: '2026-01-01',
            residentId: '2',
            dosage: '500mg'
        },
        {
            id: '103',
            name: 'Insulin',
            stock: 2,
            threshold: 5,
            expiry: '2025-12-01',
            residentId: '2',
            dosage: '10 units'
        }
    ]);

    const [alerts, setAlerts] = useState([]);

    // Check for alerts whenever medicines change
    useEffect(() => {
        const newAlerts = [];
        const today = new Date();

        medicines.forEach(med => {
            // Stockout Check
            if (med.stock <= med.threshold) {
                newAlerts.push({
                    id: `stock-${med.id}`,
                    type: 'CRITICAL',
                    title: 'Low Stock Alert',
                    message: `${med.name} is running low (${med.stock} left).`,
                    medId: med.id
                });
            }

            // Expiry Check
            const expiryDate = new Date(med.expiry);
            const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            if (daysToExpiry < 0) {
                newAlerts.push({
                    id: `exp-${med.id}`,
                    type: 'DANGER',
                    title: 'Expired Medicine',
                    message: `${med.name} expired on ${med.expiry}. Discard immediately.`,
                    medId: med.id
                });
            } else if (daysToExpiry <= 30) {
                newAlerts.push({
                    id: `exp-soon-${med.id}`,
                    type: 'WARNING',
                    title: 'Expiring Soon',
                    message: `${med.name} expires in ${daysToExpiry} days.`,
                    medId: med.id
                });
            }
        });

        setAlerts(newAlerts);
    }, [medicines]);

    const addResident = (name, age, condition) => {
        setResidents(prev => [...prev, { id: Date.now().toString(), name, age, condition }]);
    };

    return (
        <AppContext.Provider value={{
            medicines,
            setMedicines,
            residents,
            addResident,
            alerts
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
