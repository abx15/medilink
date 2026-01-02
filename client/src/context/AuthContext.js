import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setRole(parsedUser.role);
                    setIsAuthenticated(true);

                    // Verify token with backend
                    const endpoint = parsedUser.role === 'admin' ? '/admin/profile' :
                        parsedUser.role === 'doctor' ? '/doctor/profile' : '/user/profile';

                    const res = await API.get(endpoint);
                    if (res.data.success) {
                        setUser(res.data.user || res.data.doctor || res.data.admin);
                        // Update stored data
                        localStorage.setItem('user', JSON.stringify({
                            ...(res.data.user || res.data.doctor || res.data.admin),
                            role: parsedUser.role
                        }));
                    }
                } catch (error) {
                    console.error('Auth verification failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials, type = 'user') => {
        try {
            const res = await API.post(`/auth/login/${type}`, credentials);
            if (res.data.success) {
                const userData = { ...res.data.user, role: type };
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setRole(type);
                setIsAuthenticated(true);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (formData, type = 'user') => {
        try {
            const res = await API.post(`/auth/register/${type}`, formData);
            return res.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const verifyOTP = async (verifyData) => {
        try {
            const res = await API.post('/auth/verify-otp', verifyData);
            return res.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Verification failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            loading,
            isAuthenticated,
            login,
            logout,
            register,
            verifyOTP
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
