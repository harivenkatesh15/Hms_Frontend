import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true); // ✅ ADDED: Prevents "flicker" on refresh

    useEffect(() => {
        // 1. Check Local Storage on App Start
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedToken && storedUser) {
            try {
                // Parse the JSON string back into an object { id: 1, role: "DOCTOR", ... }
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.clear();
            }
        }
        setLoading(false); // App is ready
    }, []);

    // 2. Updated Login Function (Matches Login.jsx)
    const login = (userData, newToken) => {
        // userData contains: { id, email, role, fullName, status }
        
        // Save to State
        setToken(newToken);
        setUser(userData);

        // Save to Local Storage (Persist ID after refresh)
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData)); 
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Removes the whole object
        setToken('');
        setUser(null);
        // Optional: Redirect to login manually if needed, 
        // but usually the Router handles this via PrivateRoute.
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {/* Don't render children until we know if user is logged in */}
            {!loading && children}
        </AuthContext.Provider>
    );
};