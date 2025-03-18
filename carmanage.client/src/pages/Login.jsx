import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../utils";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { goToHome } = useNavigation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            goToHome();
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className ="buttons" type="submit">Login</button>
            </form>
            <button className="buttons" onClick={() => goToHome()}>Back</button>
        </div>
    );
};

export default Login;
