import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/config');
                setConfig(res.data);

                // Update CSS variables for branding
                if (res.data.ui) {
                    document.documentElement.style.setProperty('--color-primary', res.data.ui.primaryColor);
                    document.documentElement.style.setProperty('--color-secondary', res.data.ui.secondaryColor);
                }

            } catch (err) {
                console.error('Error loading config:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
