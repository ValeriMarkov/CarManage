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

/*    const handleRemoveNotification = async (notificationId) => {
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
    };*/

    const handleRemoveNotification = async (notificationId) => {
        try {
            if (window.confirm("Are you sure you want to delete this notification?")) {
                const response = await fetch(`https://localhost:7025/api/notificationsettings/${carId}/${notificationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to remove notification');
                }

                setSNotifications(notifications.filter((notification) => notification.id !== serviceHistoryId));
                alert("Notification removed successfully!");
                setSuccessMessage("Notification removed successfully!");
                setError(null);
            }
        } catch (err) {
            setError(err.message);
            setSuccessMessage(null);
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

                            if (notification.oilChangeNotification) services.push("Engine oil");
                            if (notification.filterChangeNotification) services.push("Filters");

                            // TODO - add the rest of the services

                            const serviceType = services.length > 0 ? services.join(", ") : "Unknown Service";

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
