import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(localStorage.getItem('selectedProfile') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const res = await api.get('/api/check-auth/');
            if (res.data.is_authenticated) {
                setUser(res.data.user);
                setIsAdmin(res.data.user.is_staff);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        } catch (error) {
            // A 401 just means the user isn't logged in yet, which is expected for guests.
            if (error.response && error.response.status !== 401) {
                console.error('Auth check failed', error);
            }
            setUser(null);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const res = await api.post('/api/login/', { username, password });
            setUser(res.data.user);
            setIsAdmin(res.data.user.is_staff);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error.response?.data);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const selectProfile = (profileName) => {
        setSelectedProfile(profileName);
        localStorage.setItem('selectedProfile', profileName);
    };

    const logout = async () => {
        try {
            await api.post('/api/logout/');
            setUser(null);
            setIsAdmin(false);
            setSelectedProfile(null);
            localStorage.removeItem('selectedProfile');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, selectedProfile, loading, login, selectProfile, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
