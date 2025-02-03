import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";
import CarForm from "./components/Cars/AddCar";
import CarDetails from "./components/Cars/CarDetails";
import EditCarForm from "./components/Cars/EditCar";
import AddService from "./components/Services/AddService";
import EditService from "./components/Services/EditService";

const App = () => {
    const { user, logout } = useAuth();

    return (
        <Router>
                <nav>
                    <ul>
                        {!user ? (
                            <>
                            <li>
                                <Link to="/register">
                                    <button className="buttons" role="button">Register</button>
                                </Link>
                                <Link to="/login">
                                    <button className="buttons" role="button">Login</button>
                                </Link>
                            </li>
                            </>
                        ) : (
                            <>
                                <li className="logoutButton" role="button">
                                    <button className="buttons" onClick={logout}>Logout</button>
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
                            <Route path="/cars/:carId/services/:serviceId/edit" element={<EditService />} />
                        </Routes>
                    </div>
        </Router>
    );
};

export default App;