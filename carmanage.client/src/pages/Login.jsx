import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../utils";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
            <div className="car-info">
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
                    <div className="button-container">
                        <button className="buttons" type="submit">Login</button>
                        <button className="buttons" type="button" onClick={() => goToHome()}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
