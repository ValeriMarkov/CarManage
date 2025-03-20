import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
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
import Notifications from "./components/Notifications/Notifications";
import EditNotificationSettings from "./components/Notifications/EditNotificationSettings";
import Export from "./components/Exports/Export";
import { Provider } from 'react-redux';
import '/src/styles/global.css';

const AppContent = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <>
            <div className="container">
                <nav>
                    <ul className="navbarContainer">
                        {!user ? (
                            <div className={`navbarButtons ${isHomePage ? "homepage-adjustment" : ""}`}>
                                {location.pathname !== "/register" && (
                                    <li role="button">
                                        <Link to="/register">
                                            <button className="buttons" role="button">Register</button>
                                        </Link>
                                    </li>
                                )}
                                {location.pathname !== "/login" && (
                                    <li role="button">
                                        <Link to="/login">
                                            <button className="buttons" role="button">Login</button>
                                        </Link>
                                    </li>
                                )}
                            </div>
                        ) : (
                            <div className="navbarButtons">
                                <li role="button">
                                    <button className="buttons" onClick={logout}>Logout</button>
                                </li>
                            </div>
                        )}
                    </ul>
                </nav>

                <div className="App">
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/add-car" element={<ProtectedRoute> <CarForm /> </ProtectedRoute>} />
                            <Route path="/cars/:carId" element={<ProtectedRoute> <CarDetails /> </ProtectedRoute>} />
                            <Route path="/edit-car/:carId" element={<ProtectedRoute> <EditCar /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/add-service" element={<ProtectedRoute> <AddService /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/services/:serviceId/edit" element={<ProtectedRoute> <EditService /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/notifications" element={<ProtectedRoute> <Notifications /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/notifications/notification-settings" element={<ProtectedRoute> <NotificationSettings /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/notifications/notification-settings/edit/:notificationId" element={<ProtectedRoute> <EditNotificationSettings /> </ProtectedRoute>} />
                            <Route path="/cars/:carId/export" element={<ProtectedRoute> <Export /> </ProtectedRoute>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
        </Provider>
    );
};

export default App;
