import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { updateNotificationSettings } from './actions';
import { sendNotification } from '../../services/notificationService';

const EditNotificationSettings = () => {
    const { carId, notificationId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    const [notificationData, setNotificationData] = useState({
        oilChangeNotification: false,
        filterChangeNotification: false,
        averageWeeklyMileage: 0,
        currentOdometer: 0,
        lastOilChangeMileage: 0,
        oilChangeInterval: 0,
        isAutomaticMileageTracking: false,
        email: email,
    });

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const token = await auth.currentUser.getIdToken(true);
                const response = await axios.get(
                    `https://localhost:7025/api/notificationsettings/${carId}/${notificationId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log("Fetched Notification for Edit:", response.data);

                setNotificationData({
                    oilChangeNotification: response.data.oilChangeNotification,
                    filterChangeNotification: response.data.filterChangeNotification,
                    averageWeeklyMileage: response.data.averageWeeklyMileage ?? 0,
                    currentOdometer: response.data.currentOdometer ?? 0,
                    lastOilChangeMileage: response.data.lastOilChangeMileage ?? 0,
                    oilChangeInterval: response.data.oilChangeInterval ?? 0,
                    isAutomaticMileageTracking: response.data.isAutomaticMileageTracking,
                    email: response.data.email || email,
                });
            } catch (error) {
                console.error('Error fetching notification details:', error);
            }
        };

        fetchNotification();
    }, [carId, notificationId, auth, email]);

    const handleInputChange = (event) => {
        const { name, type, checked, value } = event.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'isAutomaticMileageTracking') {
            newValue = value === 'true';
        }

        setNotificationData((prev) => ({
            ...prev,
            [name]: newValue,
            ...(name === 'isAutomaticMileageTracking' && newValue ? { averageWeeklyMileage: '' } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            id: parseInt(notificationId, 10),
            carId: parseInt(carId, 10),
            userId: notificationData.userId || user?.uid,
            oilChangeNotification: notificationData.oilChangeNotification,
            filterChangeNotification: notificationData.filterChangeNotification,
            averageWeeklyMileage: notificationData.isAutomaticMileageTracking
                ? Number(notificationData.averageWeeklyMileage)
                : 0,
            currentOdometer: Number(notificationData.currentOdometer),
            lastOilChangeMileage: Number(notificationData.lastOilChangeMileage),
            oilChangeInterval: Number(notificationData.oilChangeInterval),
            isAutomaticMileageTracking: notificationData.isAutomaticMileageTracking,
            email: notificationData.email,
        };

        try {
            console.log("Sending Payload:", payload);
            await dispatch(updateNotificationSettings(carId, payload));
            await sendNotification(
                payload.email,
                'Notification Settings Updated',
                `Notification settings for car ${carId} have been updated.`
            );
            navigate(`/cars/${carId}/notifications`);
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h2>Edit Notification Settings</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <label>
                        Notification Mode:
                        <select
                            name="isAutomaticMileageTracking"
                            value={notificationData.isAutomaticMileageTracking}
                            onChange={handleInputChange}
                        >
                            <option value={false}>Manual</option>
                            <option value={true}>Auto</option>
                        </select>
                    </label>
                </div>

                <div>
                    <p>Oil and filters</p>
                    <div>
                        <label>
                            Oil change notification:
                            <input
                                type="checkbox"
                                name="oilChangeNotification"
                                checked={notificationData.oilChangeNotification}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Filter change notification:
                            <input
                                type="checkbox"
                                name="filterChangeNotification"
                                checked={notificationData.filterChangeNotification}
                                onChange={handleInputChange}
                            />
                        </label>
                        </div>
                </div>
                {notificationData.isAutomaticMileageTracking && (
                    <div>
                        <label>
                            Average weekly mileage:
                            <input
                                type="number"
                                name="averageWeeklyMileage"
                                value={notificationData.averageWeeklyMileage}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                )}

                <div>
                    <label>
                        Current odometer:
                        <input
                            type="number"
                            name="currentOdometer"
                            value={notificationData.currentOdometer}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Last oil change odometer:
                        <input
                            type="number"
                            name="lastOilChangeMileage"
                            value={notificationData.lastOilChangeMileage}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Oil change interval:
                        <input
                            type="number"
                            name="oilChangeInterval"
                            value={notificationData.oilChangeInterval}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <button className="buttons" type="submit">Save Changes</button>
                </div>
            </form>
            <button className="buttons" onClick={handleBack}>Back</button>
        </div>
    );
};

export default EditNotificationSettings;
