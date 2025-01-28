import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login error: ", error.message);
            throw new Error(error.message);
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

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

export const useAuth = () => useContext(AuthContext);
