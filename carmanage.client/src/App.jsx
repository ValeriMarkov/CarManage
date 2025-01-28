import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CarForm from "./components/CarForm";
import CarDetails from "./components/CarDetails/CarDetails";
import EditCarForm from "./components/EditCarForm";
import AddService from "./components/AddService/AddService";

const App = () => {
    const { user, logout } = useAuth();

    return (
        <Router>
            <nav>
                <ul>
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
                        <>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/add-car" element={<ProtectedRoute> <CarForm /> </ProtectedRoute>} />
                    <Route path="/cars/:carId" element={<CarDetails />} />
                    <Route path="/edit-car/:carId" element={<ProtectedRoute> <EditCarForm /> </ProtectedRoute>} />
                    <Route path="/cars/:carId/add-service" element={<AddService />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;