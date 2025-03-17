import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '../../utils';
import './Notifications.css';

const Notifications = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { goToNotificationSettings, goToCarDetails, goToEditNotificationSettings } = useNavigation();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            setNotifications([]);
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken(true);

                const response = await axios.get(`https://localhost:7025/api/notificationsettings/${carId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data && response.data.length === 0) {
                    setNotifications([]);
                } else {
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Failed to load notifications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [carId]);

    const handleRemoveNotification = async (notificationId) => {
        try {
            if (window.confirm("Are you sure you want to delete this notification?")) {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    throw new Error("User is not authenticated");
                }

                const token = await user.getIdToken(true);

                const response = await fetch(`https://localhost:7025/api/notificationsettings/${carId}/${notificationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to remove notification");
                }

                setNotifications(notifications.filter((notification) => notification.id !== notificationId));
                setSuccessMessage("Notification removed successfully!");
                setError(null);
            }
        } catch (err) {
            console.error("Error removing notification:", err);
            setError(err.message);
            setSuccessMessage(null);
        }
    };

    const LoadingSpinner = () => (
        <div className="spinner">
            <div className="spin"></div>
        </div>
    );

    return (
        <div className="notifications-container">
            <h2>Notifications for Car {carId}</h2>

            <div className="button-container">
                <button className="buttons" onClick={() => goToNotificationSettings(carId)}>Add New Notification</button>
                <button className="buttons" onClick={() => goToCarDetails(carId)}>Back</button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <div>
                        <h3>Active Notifications:</h3>
                        {notifications.length === 0 ? (
                            <p>No notifications are currently active for this car.</p> 
                        ) : (
                            <ul>
                                {notifications.map((notification) => {
                                    let services = [];
                                    if (notification.oilChangeNotification) services.push("Engine oil");
                                    if (notification.filterChangeNotification) services.push("Filters");

                                    const serviceType = services.length > 0 ? services.join(", ") : "Unknown Service";

                                    let changeInKm = 0;
                                    if (notification.isAutomaticMileageTracking) {
                                        const remainingKm = notification.oilChangeInterval - (notification.currentOdometer - notification.lastOilChangeMileage);
                                        changeInKm = remainingKm < 0 ? 0 : remainingKm;
                                    } else {
                                        changeInKm = (notification.lastOilChangeMileage - notification.currentOdometer) + notification.oilChangeInterval;
                                    }

                                    return (
                                        <li key={notification.id}>
                                            <div>
                                                <span>{serviceType}</span> - Change in: {changeInKm} km
                                                <div className="button-container">
                                                    <button className="buttons" onClick={() => goToEditNotificationSettings(carId, notification.id)}>Edit</button>
                                                    <button className="buttons" onClick={() => handleRemoveNotification(notification.id)}>Remove</button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;
