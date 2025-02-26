import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const Notifications = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken(true);

                const response = await axios.get(`https://localhost:7025/api/notificationsettings/${carId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Fetched Notifications:", response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [carId]);

    const handleAddNotification = () => {
        navigate(`/cars/${carId}/notifications/notification-settings`);
    };

    const handleEditNotification = (notificationId) => {
        navigate(`/cars/${carId}/notifications/notification-settings/edit/${notificationId}`);
    };

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
                alert("Notification removed successfully!");
                setSuccessMessage("Notification removed successfully!");
                setError(null);
            }
        } catch (err) {
            console.error("Error removing notification:", err);
            setError(err.message);
            setSuccessMessage(null);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h2>Notifications for Car {carId}</h2>
            <button className="buttons"  onClick={handleAddNotification}>Add New Notification</button>

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
                            }

                            if (!notification.isAutomaticMileageTracking) {
                                changeInKm = (notification.lastOilChangeMileage - notification.currentOdometer) + notification.oilChangeInterval;
                            }

                            return (
                                <li key={notification.id}>
                                    <div>
                                        <span>{serviceType}</span> -{" "}
                                        <>Change in: {changeInKm} km</>
                                        <button className="buttons"  onClick={() => handleEditNotification(notification.id)}>Edit</button>
                                        <button className="buttons"  onClick={() => handleRemoveNotification(notification.id)}>Remove</button>
                                    </div>
                                </li>
                            );
                        })}
                    <button className="buttons" onClick={handleBack}>Back</button>
                        </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
