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
import EditCar from "./components/Cars/EditCar";
import AddService from "./components/Services/AddService";
import EditService from "./components/Services/EditService";
import NotificationSettings from "./components/Notifications/NotificationSettings";
import store from './components/Notifications/store';
import { Provider } from 'react-redux';

const App = () => {
    const { user, logout } = useAuth();

    return (
        <Provider store={store}>
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
                        <Route path="/cars/:carId" element={<ProtectedRoute> {<CarDetails />} </ProtectedRoute>} />
                        <Route path="/edit-car/:carId" element={<ProtectedRoute> <EditCar /> </ProtectedRoute>} />
                        <Route path="/cars/:carId/add-service" element={<ProtectedRoute> {<AddService />} </ProtectedRoute>} />
                        <Route path="/cars/:carId/services/:serviceId/edit" element={<ProtectedRoute> {<EditService />} </ProtectedRoute>} />
                        <Route path="/cars/:carId/notification-settings" element={<ProtectedRoute> {<NotificationSettings />} </ProtectedRoute>} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
};

export default App;