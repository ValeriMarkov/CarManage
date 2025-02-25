import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth'; // Firebase import

const Notifications = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications when the component loads
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken(true); // Get Firebase ID token

                const response = await axios.get(`https://localhost:7025/api/notificationsettings/${carId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Fetched Notifications:", response.data);
                setNotifications(response.data); // Set fetched notifications
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
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken(true);

            await axios.delete(`https://localhost:7025/api/notificationsettings/${carId}/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setNotifications(notifications.filter((notification) => notification.id !== notificationId));
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    };

    return (
        <div>
            <h2>Notifications for Car {carId}</h2>
            <button onClick={handleAddNotification}>Add New Notification</button>

            <div>
                <h3>Active Notifications:</h3>
                {notifications.length === 0 ? (
                    <p>No notifications are currently active for this car.</p>
                ) : (
                    <ul>
                        {notifications.map((notification) => {
                            let services = [];

                            // Add services dynamically
                            if (notification.oilChangeNotification) services.push("Engine oil");
                            if (notification.filterChangeNotification) services.push("Filters");

                            // In future, if you add new services (e.g., Timing Belt, Water Pump), include them here:
                            // if (notification.timingBeltNotification) services.push("Timing Belt");
                            // if (notification.waterPumpNotification) services.push("Water Pump");

                            const serviceType = services.length > 0 ? services.join(", ") : "Unknown Service";

                            // Calculate remaining kilometers for auto tracking
                            const kilometersLeft = notification.isAutomaticMileageTracking
                                ? notification.oilChangeInterval - (notification.currentOdometer - notification.lastOilChangeMileage)
                                : "N/A";

                            return (
                                <li key={notification.id}>
                                    <div>
                                        <span>{serviceType}</span> -{" "}
                                        {notification.isAutomaticMileageTracking ? (
                                            <>Change in: {kilometersLeft} km</>
                                        ) : (
                                            <>Current Odometer: {notification.currentOdometer}, Target: {notification.manualOdometerEntry}</>
                                        )}

                                        <button onClick={() => handleEditNotification(notification.id)}>Edit</button>
                                        <button onClick={() => handleRemoveNotification(notification.id)}>Remove</button>
                                        <button onClick={() => handleMarkAsDone(notification.id)}>Mark as Done</button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
