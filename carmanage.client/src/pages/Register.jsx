import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Register = () => {
    const { signup } = useAuth(); // Get the signup function from context
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signup(email, password); // Call the signup function from context
            navigate("/"); // Redirect to the home page after successful registration
        } catch (err) {
            setError(err.message); // If there's an error, set the error message
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p>{error}</p>} {/* Display error message if any */}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
