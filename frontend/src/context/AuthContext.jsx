import { createContext, useState, useEffect, useContext } from 'react';
import { login as loginAPI, register as registerAPI } from '../utils/api.js';

const AuthContext = createContext({
    user: null,
    token: null,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    updateUser: () => {},
    isAuthenticated: false,
});

export default function AuthContextComp({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginAPI(email, password);
            setToken(data.token);
            setUser({ _id: data._id, email: data.email, fullName: data.fullName });
            localStorage.setItem('token', data.token);
            localStorage.setItem(
                'user',
                JSON.stringify({ _id: data._id, email: data.email, fullName: data.fullName })
            );
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (email, password, fullName) => {
        try {
            const data = await registerAPI(email, password, fullName);
            setToken(data.token);
            setUser({ _id: data._id, email: data.email, fullName: data.fullName });
            localStorage.setItem('token', data.token);
            localStorage.setItem(
                'user',
                JSON.stringify({ _id: data._id, email: data.email, fullName: data.fullName })
            );
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthContextComp.AuthContext = AuthContext;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthContextComp');
    }
    return context;
};
