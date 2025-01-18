import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Firebase authentication instance
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Current user state
    const [loading, setLoading] = useState(true); // Loading state to handle async operations

    // Monitor authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // Sign up a new user
    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw new Error(error.message); // Propagate error to the caller
        }
    };

    // Log in an existing user
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login error: ", error.message);
            throw new Error(error.message); // Propagate error to the caller
        }
    };

    // Log out the current user
    const logout = async () => {
        await signOut(auth);
    };

    // Remove a car by ID, requiring authentication
    const handleRemoveCar = async (carId) => {
        if (!user) return;

        try {
            const idToken = await user.getIdToken(true);
            const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove car");
            }

            alert("Car removed successfully");
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, handleRemoveCar }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);
