import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedName = localStorage.getItem('fullName');
        const storedStatus = localStorage.getItem('status'); // <--- GET STATUS
        
        if (token && storedRole) {
            setUser({ role: storedRole, fullName: storedName, status: storedStatus });
        }
    }, [token]);

    // Update login to accept status
    const login = (newToken, role, fullName, status) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', role);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('status', status); // <--- SAVE STATUS
        
        setToken(newToken);
        setUser({ role, fullName, status });
    };

    const logout = () => {
        localStorage.clear(); // Clears all items
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};