import { useState, useEffect } from 'react';

export const useFetchUserSettings = (userId = 1) => {
    const [userSettings, setUserSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/user-settings?id=${userId}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch user settings: ${response.statusText}`);
                }
                
                const data = await response.json();
                setUserSettings(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user settings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSettings();
    }, [userId]);

    return { 
        userSettings, 
        loading, 
        error,
        emergencyBudget: userSettings?.emergency_budget || 0,
        peaceOfMindBudget: userSettings?.peace_of_mind_budget || 0
    };
};
