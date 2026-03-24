import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await AuthService.login(username, password);
            setCurrentUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    const updateCurrentUser = (user) => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...storedUser, ...user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
    };

    const register = async (username, email, password, age, height, weight, activityLevel, healthGoal) => {
        return AuthService.register(username, email, password, age, height, weight, activityLevel, healthGoal);
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register, updateCurrentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
