import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook
import Home from "./pages/Home"; // Home page (now acting as Dashboard)
import Login from "./pages/Login"; // Login page
import Register from "./pages/Register"; // Register page
import ProtectedRoute from "./components/ProtectedRoute"; // Optional ProtectedRoute component (if needed)
import CarForm from "./components/CarForm";

const App = () => {
    const { user, logout } = useAuth(); // Access the user and logout function from context

    return (
        <Router>
            <nav>
                <ul>
                    {/* Conditionally show Register/Login if no user, or Logout if user is logged in */}
                    {!user ? (
                        <>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="App">
                <Routes>
                    {/* Home route now acting as the dashboard */}
                    <Route path="/" element={<Home />} />

                    {/* Register route */}
                    <Route path="/register" element={<Register />} />

                    {/* Login route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected route for adding a car */}
                    <Route
                        path="/add-car"
                        element={
                            user ? (
                                <CarForm />
                            ) : (
                                <div>Please log in to add a car.</div>
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
