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
                        const verifiedUser = res.data.user || res.data.doctor || res.data.admin;
                        setUser(verifiedUser);
                        // Update stored data
                        localStorage.setItem('user', JSON.stringify({
                            ...verifiedUser,
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
                const verifiedUser = res.data.user || res.data.doctor || res.data.admin;
                const userData = { ...verifiedUser, role: type };
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
                message: error.response?.data?.message || 'Login failed',
                requiresOTP: error.response?.status === 403 && error.response?.data?.requiresOTP
            };
        }
    };

    const requestLoginOTP = async (data) => {
        try {
            const res = await API.post('/auth/request-login-otp', data);
            return res.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send OTP'
            };
        }
    };

    const loginWithOTP = async (verifyData) => {
        try {
            const res = await API.post('/auth/login-with-otp', verifyData);
            if (res.data.success) {
                const type = verifyData.role;
                const verifiedUser = res.data[type];
                const userData = { ...verifiedUser, role: type };
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setRole(type);
                setIsAuthenticated(true);
                return { success: true };
            }
            return res.data;
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

    const resendOTP = async (data) => {
        try {
            const res = await API.post('/auth/resend-otp', data);
            return res.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to resend OTP'
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
            verifyOTP,
            requestLoginOTP,
            loginWithOTP,
            resendOTP
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
