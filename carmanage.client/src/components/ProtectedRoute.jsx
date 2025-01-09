import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();  // Get the user state from context

    // If there's no user (i.e., not logged in), redirect to login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Otherwise, render the children (the protected component)
    return children;
};

export default ProtectedRoute;
