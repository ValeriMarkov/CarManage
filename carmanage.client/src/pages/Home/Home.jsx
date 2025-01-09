import React from "react";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation
import "./Home.css";  // Import the CSS file for Home page styles

const Home = () => {
    const { user } = useAuth(); // Get the user from context
    const navigate = useNavigate(); // Initialize the navigate function for routing

    // Function to navigate to the 'Add Car' page
    const goToAddCarPage = () => {
        navigate("/add-car");
    };

    return (
        <div className="home-container">
            <h2>Welcome to the Home Page</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={goToAddCarPage}>Add Car</button>
                </div>
            ) : (
                <p>Please log in or register to continue.</p>
            )}
        </div>
    );
};

export default Home;
