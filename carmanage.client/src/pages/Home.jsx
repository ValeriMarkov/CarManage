import React from "react";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Home = () => {
    const { user } = useAuth(); // Get the user from context

    return (
        <div>
            <h2>Welcome to the Home Page</h2>

            {/* Conditionally render a welcome message based on the user */}
            {user ? (
                <p>Welcome, {user.email}!</p>  // Show user's email if logged in
            ) : (
                <p>Please log in or register to continue.</p> // Show message if not logged in
            )}
        </div>
    );
};

export default Home;
