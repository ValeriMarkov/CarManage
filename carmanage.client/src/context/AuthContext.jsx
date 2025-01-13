import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // Import Firebase authentication
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Use createUserWithEmailAndPassword for registration

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State for storing the current user
    const [loading, setLoading] = useState(true); // Loading state to show loading indicator

    // Listen to auth state changes and update the user state accordingly
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false); // Set loading to false when the auth state is resolved
        });
        return unsubscribe; // Clean up the listener when the component unmounts
    }, []);

    // Sign up function (use createUserWithEmailAndPassword for registration)
    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password); // Registration method
        } catch (error) {
            throw new Error(error.message); // If there's an error, throw it
        }
    };

    // Sign in function (login method)
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password); // Login method
        } catch (error) {
            console.error("Login error: ", error.message); // Log error for debugging
            throw new Error(error.message); // If there's an error, throw it
        }
    };

    // Sign out function
    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
