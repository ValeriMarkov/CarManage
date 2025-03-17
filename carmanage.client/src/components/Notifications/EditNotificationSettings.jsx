import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { updateNotificationSettings } from './actions';
import { Tooltip } from 'react-tooltip';
import { sendNotification } from '../../services/notificationService';
import carService from '../../services/carService';
import { useNavigation } from '../../utils';
import './EditNotificationSettings.css';

const EditNotificationSettings = () => {
    const { carId, notificationId } = useParams();
    const { goToNotifications } = useNavigation();
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

        brakePadsNotification: false,
        lastBrakePadsChangeMileage: 0,
        brakePadsChangeInterval: 0,

        tireRotationNotification: false,
        lastTireRotationMileage: 0,
        tireRotationInterval: 0,

        transmissionFluidChangeNotification: false,
        lastTransmissionFluidChangeMileage: 0,
        transmissionFluidChangeInterval: 0,

        sparkPlugChangeNotification: false,
        lastSparkPlugChangeMileage: 0,
        sparkPlugChangeInterval: 0,

        timingBeltNotification: false,
        lastTimingBeltChangeMileage: 0,
        timingBeltChangeInterval: 0,

        timingChainChangeNotification: false,
        lastTimingChainChangeMileage: 0,
        timingChainChangeInterval: 0,

        waterPumpReplacementNotification: false,
        lastWaterPumpReplacementMileage: 0,
        waterPumpReplacementInterval: 0,
    });

    const [isOilFilterExpanded, setIsOilFilterExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

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

                setNotificationData({
                    oilChangeNotification: response.data.oilChangeNotification,
                    filterChangeNotification: response.data.filterChangeNotification,

                    averageWeeklyMileage: response.data.averageWeeklyMileage ?? 0,
                    currentOdometer: response.data.currentOdometer ?? 0,

                    lastOilChangeMileage: response.data.lastOilChangeMileage ?? 0,
                    oilChangeInterval: response.data.oilChangeInterval ?? 0,

                    isAutomaticMileageTracking: response.data.isAutomaticMileageTracking,
                    email: response.data.email || email,

                    brakePadsNotification: response.data.brakePadsNotification,
                    lastBrakePadsChangeMileage: response.data.lastBrakePadsChangeMileage ?? 0,
                    brakePadsChangeInterval: response.data.brakePadsChangeInterval ?? 0,

                    tireRotationNotification: response.data.tireRotationNotification,
                    lastTireRotationMileage: response.data.lastTireRotationMileage ?? 0,
                    tireRotationInterval: response.data.tireRotationInterval ?? 0,

                    transmissionFluidChangeNotification: response.data.transmissionFluidChangeNotification,
                    lastTransmissionFluidChangeMileage: response.data.lastTransmissionFluidChangeMileage ?? 0,
                    transmissionFluidChangeInterval: response.data.transmissionFluidChangeInterval ?? 0,

                    sparkPlugChangeNotification: response.data.sparkPlugChangeNotification,
                    lastSparkPlugChangeMileage: response.data.lastSparkPlugChangeMileage ?? 0,
                    sparkPlugChangeInterval: response.data.sparkPlugChangeInterval ?? 0,

                    timingBeltNotification: response.data.timingBeltNotification,
                    lastTimingBeltChangeMileage: response.data.lastTimingBeltChangeMileage ?? 0,
                    timingBeltChangeInterval: response.data.timingBeltChangeInterval ?? 0,

                    timingChainChangeNotification: response.data.timingChainChangeNotification,
                    lastTimingChainChangeMileage: response.data.lastTimingChainChangeMileage ?? 0,
                    timingChainChangeInterval: response.data.timingChainChangeInterval ?? 0,

                    waterPumpReplacementNotification: response.data.waterPumpReplacementNotification,
                    lastWaterPumpReplacementMileage: response.data.lastWaterPumpReplacementMileage ?? 0,
                    waterPumpReplacementInterval: response.data.waterPumpReplacementInterval ?? 0,
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
            currentOdometer: Number(notificationData.currentOdometer) || 0,

            lastOilChangeMileage: Number(notificationData.lastOilChangeMileage) || 0,
            oilChangeInterval: Number(notificationData.oilChangeInterval) || 0,

            isAutomaticMileageTracking: notificationData.isAutomaticMileageTracking,
            email: notificationData.email,

            lastBrakePadsChangeMileage: Number(notificationData.lastBrakePadsChangeMileage) || 0,
            brakePadsChangeInterval: Number(notificationData.brakePadsChangeInterval) || 0,

            lastTireRotationMileage: Number(notificationData.lastTireRotationMileage) || 0,
            tireRotationInterval: Number(notificationData.tireRotationInterval) || 0,

            lastTransmissionFluidChangeMileage: Number(notificationData.lastTransmissionFluidChangeMileage) || 0,
            transmissionFluidChangeInterval: Number(notificationData.transmissionFluidChangeInterval) || 0,

            sparkPlugChangeNotification: notificationData.sparkPlugChangeNotification,
            lastSparkPlugChangeMileage: Number(notificationData.lastSparkPlugChangeMileage) || 0,

            lastTimingBeltChangeMileage: Number(notificationData.lastTimingBeltChangeMileage) || 0,
            timingBeltChangeInterval: Number(notificationData.timingBeltChangeInterval) || 0,

            lastTimingChainChangeMileage: Number(notificationData.lastTimingChainChangeMileage) || 0,
            timingChainChangeInterval: Number(notificationData.timingChainChangeInterval) || 0,

            lastWaterPumpReplacementMileage: Number(notificationData.lastWaterPumpReplacementMileage) || 0,
            waterPumpReplacementInterval: Number(notificationData.waterPumpReplacementInterval) || 0,
        };

        try {
            await dispatch(updateNotificationSettings(carId, payload));
            await sendNotification(
                payload.email,
                'Notification Settings Updated',
                `Notification settings for car ${carId} have been updated.`
            );
            goToNotifications(carId);
        } catch (error) {
            console.error('Error updating notification settings:', error);
        }
    };

    const sections = [
        {
            title: 'Oil and Filters',
            fields: [
                {
                    notifications: [
                        { name: 'oilChangeNotification', label: 'Oil Change Notification' },
                        { name: 'filterChangeNotification', label: 'Filter Change Notification' }
                    ],
                    subFields: ['lastOilChangeMileage', 'oilChangeInterval']
                }
            ]
        },
        {
            title: 'Brakes & Tires',
            fields: [
                { name: 'brakePadsNotification', label: 'Brake Pads Notification', subFields: ['lastBrakePadsChangeMileage', 'brakePadsChangeInterval'] },
                { name: 'tireRotationNotification', label: 'Tire Rotation Notification', subFields: ['lastTireRotationMileage', 'tireRotationInterval'] }
            ]
        },
        {
            title: 'Fluids',
            fields: [
                { name: 'transmissionFluidChangeNotification', label: 'Transmission Fluid Change Notification', subFields: ['lastTransmissionFluidChangeMileage', 'transmissionFluidChangeInterval'] }
            ]
        },
        {
            title: 'Engine & Timing',
            fields: [
                { name: 'sparkPlugChangeNotification', label: 'Spark Plug Change Notification', subFields: ['lastSparkPlugChangeMileage', 'sparkPlugChangeInterval'] },
                { name: 'timingBeltNotification', label: 'Timing Belt Notification', subFields: ['lastTimingBeltChangeMileage', 'timingBeltChangeInterval'] },
                { name: 'timingChainChangeNotification', label: 'Timing Chain Change Notification', subFields: ['lastTimingChainChangeMileage', 'timingChainChangeInterval'] },
                { name: 'waterPumpReplacementNotification', label: 'Water Pump Replacement Notification', subFields: ['lastWaterPumpReplacementMileage', 'waterPumpReplacementInterval'] }
            ]
        }
    ];

    const toggleOilFilterSection = () => {
        setIsOilFilterExpanded((prev) => !prev);
    };

    return (
        <div className="edit-notification-settings-container">
            <h2>Edit Notification Settings</h2>

            <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                    <label>
                        Notification Mode:
                        <select
                            name="isAutomaticMileageTracking"
                            value={notificationData.isAutomaticMileageTracking}
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

                {notificationData.isAutomaticMileageTracking && (
                    <div className="form-group">
                        <label>
                            Average weekly mileage:
                            <input
                                type="number"
                                name="averageWeeklyMileage"
                                value={notificationData.averageWeeklyMileage}
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
                            value={notificationData.currentOdometer}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </label>
                </div>

                {sections.map((section, index) => (
                    <div key={index} className="section-container">
                        <div className="section-header" onClick={() => toggleSection(section.title)}>
                            {section.title}
                            <span className={expandedSections[section.title] ? 'expanded' : ''}>⮟</span>
                        </div>
                        {expandedSections[section.title] && (
                            <div className="section-content">
                                {section.fields.map((field, idx) => {
                                    if (!field) {
                                        console.error("Missing field at index:", idx, field);
                                        return null;
                                    }

                                    return (
                                        <div key={idx} className="sub-section-box">
                                            {(section.title === "Oil and Filters" || !field.notifications) && (
                                                <div className="sub-section-header">
                                                    {field.label || (field.name && carService.formatServiceType(field.name))}
                                                </div>
                                            )}

                                            {field.notifications ? (
                                                field.notifications.map((notification, subIdx) => (
                                                    <div key={subIdx} className="form-group">
                                                        <label>
                                                            {notification.label}:
                                                            <input
                                                                type="checkbox"
                                                                name={notification.name}
                                                                checked={notificationData[notification.name] || false}
                                                                onChange={handleInputChange}
                                                                className="checkbox"
                                                            />
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="form-group">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name={field.name}
                                                            checked={notificationData[field.name] || false}
                                                            onChange={handleInputChange}
                                                            className="checkbox"
                                                        />
                                                    </label>
                                                </div>
                                            )}

                                            {field.subFields && field.subFields.length > 0 && (
                                                field.subFields.map((subField, subIdx) => (
                                                    <div key={subIdx} className="form-group">
                                                        <label>
                                                            {carService.formatServiceType(subField)}:
                                                            <input
                                                                type="number"
                                                                name={subField}
                                                                value={notificationData[subField] || ''}
                                                                onChange={handleInputChange}
                                                                className="input-field"
                                                            />
                                                        </label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                <div className="button-container">
                    <button type="submit" className="buttons">Save Changes</button>
                    <button className="buttons" onClick={() => goToNotifications(carId)}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default EditNotificationSettings;