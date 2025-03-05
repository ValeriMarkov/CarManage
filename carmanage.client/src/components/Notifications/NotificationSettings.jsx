import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationSettings } from './actions';
import { Tooltip } from 'react-tooltip';
import { sendNotification } from '../../services/notificationService';
import { getAuth } from 'firebase/auth';
import './NotificationSettings.css';

const NotificationSettings = () => {
    const { carId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notificationSettings = useSelector((state) => state.notificationSettings);
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    const [notificationSettingsData, setNotificationSettingsData] = useState({
        oilChangeNotification: notificationSettings.oilChangeNotification || false,
        filterChangeNotification: notificationSettings.filterChangeNotification || false,
        averageWeeklyMileage: notificationSettings.averageWeeklyMileage || '',
        currentOdometer: notificationSettings.currentOdometer || '',
        lastOilChangeMileage: notificationSettings.lastOilChangeMileage || '',
        oilChangeInterval: notificationSettings.oilChangeInterval || '',
        isAutomaticMileageTracking: notificationSettings.isAutomaticMileageTracking !== undefined ? notificationSettings.isAutomaticMileageTracking : true,
        email: email,
    });

    const [isOilFilterExpanded, setIsOilFilterExpanded] = useState(false);

    const handleInputChange = (event) => {
        const { name, type, checked, value } = event.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'isAutomaticMileageTracking') {
            newValue = value === 'true';
        }

        setNotificationSettingsData((prev) => ({
            ...prev,
            [name]: newValue,
            ...(name === 'isAutomaticMileageTracking' && newValue ? { averageWeeklyMileage: '' } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            ...notificationSettingsData,
            averageWeeklyMileage: Number(notificationSettingsData.averageWeeklyMileage) || 0,
            currentOdometer: Number(notificationSettingsData.currentOdometer) || 0,
            lastOilChangeMileage: Number(notificationSettingsData.lastOilChangeMileage) || 0,
            oilChangeInterval: Number(notificationSettingsData.oilChangeInterval) || 0,
        };

        try {
            console.log("Sending Payload:", payload);
            await dispatch(updateNotificationSettings(carId, payload));
            await sendNotification(email, 'Notification Settings Updated', `Notification settings for car ${carId} have been updated.`);
            navigate(`/cars/${carId}/notifications`);
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const toggleOilFilterSection = () => {
        setIsOilFilterExpanded(!isOilFilterExpanded);
    };

    return (
        <div className="notification-settings-container">
            <h2>Notification Settings</h2>

            <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                    <label>
                        Notification Mode:
                        <select
                            name="isAutomaticMileageTracking"
                            value={notificationSettingsData.isAutomaticMileageTracking}
                            onChange={handleInputChange}
                            className="dropdown"
                        >
                            <option value={false}>Manual</option>
                            <option value={true}>Auto</option>
                        </select>
                        <span className="tooltip-icon" data-tooltip-id="notification-tooltip">?</span>
                        <Tooltip id="notification-tooltip" place="right" effect="solid" className="tooltip-text">
                            Manual mode: Receive notifications when manually updating mileage. <br />
                            Auto mode: Receive notifications using average weekly mileage.
                        </Tooltip>
                    </label>
                </div>

                {notificationSettingsData.isAutomaticMileageTracking && (
                    <div className="form-group">
                        <label>
                            Average weekly mileage:
                            <input
                                type="number"
                                name="averageWeeklyMileage"
                                value={notificationSettingsData.averageWeeklyMileage}
                                onChange={handleInputChange}
                                className="input-field"
                            />
                        </label>
                    </div>
                )}

                <div className="form-group">
                    <label>
                        Current odometer:
                        <input
                            type="number"
                            name="currentOdometer"
                            value={notificationSettingsData.currentOdometer}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                </div>

                <div className="section-header" onClick={toggleOilFilterSection}>
                    Oil and filters
                    <span className={`expand-arrow ${isOilFilterExpanded ? 'expanded' : ''}`}>⮟</span>
                </div>

                <div className={`collapsible-section ${isOilFilterExpanded ? 'active' : ''}`}>
                    <div className="form-group">
                        <label>
                            Oil change notification:
                            <input
                                type="checkbox"
                                name="oilChangeNotification"
                                checked={notificationSettingsData.oilChangeNotification}
                                onChange={handleInputChange}
                                className="checkbox"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Filter change notification:
                            <input
                                type="checkbox"
                                name="filterChangeNotification"
                                checked={notificationSettingsData.filterChangeNotification}
                                onChange={handleInputChange}
                                className="checkbox"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Last oil change odometer:
                            <input
                                type="number"
                                name="lastOilChangeMileage"
                                value={notificationSettingsData.lastOilChangeMileage}
                                onChange={handleInputChange}
                                className="input-field"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Oil change interval:
                            <input
                                type="number"
                                name="oilChangeInterval"
                                value={notificationSettingsData.oilChangeInterval}
                                onChange={handleInputChange}
                                className="input-field"
                            />
                        </label>
                    </div>
                </div>

                <div className="button-container">
                    <button type="submit" className="buttons">Save</button>
                    <button type="button" onClick={handleBack} className="buttons">Back</button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings;
