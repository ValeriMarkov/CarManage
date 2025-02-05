import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationSettings } from './actions';
import { Tooltip } from 'react-tooltip';
import notificationService from '../services/notification.service';

const NotificationSettings = () => {
    const { carId } = useParams();
    const dispatch = useDispatch();
    const notificationSettings = useSelector(state => state.notificationSettings);

    const [notificationSettingsData, setNotificationSettingsData] = useState({
        oilChangeNotification: notificationSettings.oilChangeNotification,
        filterChangeNotification: notificationSettings.filterChangeNotification,
        averageWeeklyMileage: notificationSettings.averageWeeklyMileage,
        currentOdometer: notificationSettings.currentOdometer,
        lastOilChangeMileage: notificationSettings.lastOilChangeMileage,
        oilChangeInterval: notificationSettings.oilChangeInterval,
        autoNotification: notificationSettings.autoNotification,
    });

    const handleInputChange = (event) => {
        const { name, type, checked, value } = event.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'autoNotification') {
            newValue = value === 'true';
        }

        setNotificationSettingsData((prev) => ({
            ...prev,
            [name]: newValue,
            ...(name === 'autoNotification' && !newValue ? { averageWeeklyMileage: '' } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(updateNotificationSettings(carId, notificationSettingsData));

        // Send email notification
        await notificationService.sendNotification(
            notificationSettingsData.email,
            'Notification Settings Updated',
            `Notification settings for car ${carId} have been updated.`,
        );
    };

    return (
        <div>
            <h2>Notification Settings</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <label>
                        Notification Mode:
                        <select
                            name="autoNotification"
                            value={notificationSettingsData.autoNotification}
                            onChange={handleInputChange}
                        >
                            <option value={false}>Manual</option>
                            <option value={true}>Auto</option>
                        </select>

                        <span
                            data-tooltip-id="notification-tooltip"
                            style={{
                                fontSize: 14,
                                color: 'white',
                                cursor: 'help',
                                border: '1px solid white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ?
                        </span>
                        <Tooltip
                            id="notification-tooltip"
                            place="right"
                            effect="solid"
                            style={{ whiteSpace: 'pre-line', maxWidth: '250px', textAlign: 'left' }}
                        >
                            Manual mode: Receive notifications when manually updating mileage. {'\n'}
                            Auto mode: Receive notifications using average weekly mileage.
                        </Tooltip>
                    </label>
                </div>

                <div>
                    <label>
                        Oil change notification:
                        <input
                            type="checkbox"
                            name="oilChangeNotification"
                            checked={notificationSettingsData.oilChangeNotification}
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
                            checked={notificationSettingsData.filterChangeNotification}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                {notificationSettingsData.autoNotification && (
                    <div>
                        <label>
                            Average weekly mileage:
                            <input
                                type="number"
                                name="averageWeeklyMileage"
                                value={notificationSettingsData.averageWeeklyMileage}
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
                            value={notificationSettingsData.currentOdometer}
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
                            value={notificationSettingsData.lastOilChangeMileage}
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
                            value={notificationSettingsData.oilChangeInterval}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div>
                    <button className="buttons" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default NotificationSettings;