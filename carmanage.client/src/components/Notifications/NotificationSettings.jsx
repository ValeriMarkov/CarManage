import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotificationSettings } from './actions';
import { Tooltip } from 'react-tooltip';
import { sendNotification } from '../../services/notificationService';
import { getAuth } from 'firebase/auth';
import carService from '../../services/carService';
import { useNavigation } from '../../utils';
import './NotificationSettings.css';

const NotificationSettings = () => {
    const { carId } = useParams();
    const dispatch = useDispatch();
    const { goToNotifications } = useNavigation();
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

        brakePadsNotification: notificationSettings.brakePadsNotification || false,
        lastBrakePadsChangeMileage: notificationSettings.lastBrakePadsChangeMileage || '',
        brakePadsChangeInterval: notificationSettings.brakePadsChangeInterval || '',

        tireRotationNotification: notificationSettings.tireRotationNotification || false,
        lastTireRotationMileage: notificationSettings.lastTireRotationMileage || '',
        tireRotationInterval: notificationSettings.tireRotationInterval || '',

        transmissionFluidChangeNotification: notificationSettings.transmissionFluidChangeNotification || false,
        lastTransmissionFluidChangeMileage: notificationSettings.lastTransmissionFluidChangeMileage || '',
        transmissionFluidChangeInterval: notificationSettings.transmissionFluidChangeInterval || '',

        sparkPlugChangeNotification: notificationSettings.sparkPlugChangeNotification || false,
        lastSparkPlugChangeMileage: notificationSettings.lastSparkPlugChangeMileage || '',
        sparkPlugChangeInterval: notificationSettings.sparkPlugChangeInterval || '',

        timingBeltNotification: notificationSettings.timingBeltNotification || false,
        lastTimingBeltChangeMileage: notificationSettings.lastTimingBeltChangeMileage || '',
        timingBeltChangeInterval: notificationSettings.timingBeltChangeInterval || '',

        timingChainChangeNotification: notificationSettings.timingChainChangeNotification || false,
        lastTimingChainChangeMileage: notificationSettings.lastTimingChainChangeMileage || '',
        timingChainChangeInterval: notificationSettings.timingChainChangeInterval || '',

        waterPumpReplacementNotification: notificationSettings.waterPumpReplacementNotification || false,
        lastWaterPumpReplacementMileage: notificationSettings.lastWaterPumpReplacementMileage || '',
        waterPumpReplacementInterval: notificationSettings.waterPumpReplacementInterval || '',
    });

    const [isOilFilterExpanded, setIsOilFilterExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

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

        const hasNotification = Object.keys(notificationSettingsData).some(
            (key) => key.includes('Notification') && notificationSettingsData[key]
        );

        if (!hasNotification) {
            return;
        }

        const payload = {
            ...notificationSettingsData,
            averageWeeklyMileage: Number(notificationSettingsData.averageWeeklyMileage) || 0,
            currentOdometer: Number(notificationSettingsData.currentOdometer) || 0,

            lastOilChangeMileage: Number(notificationSettingsData.lastOilChangeMileage) || 0,
            oilChangeInterval: Number(notificationSettingsData.oilChangeInterval) || 0,

            lastBrakePadsChangeMileage: Number(notificationSettingsData.lastBrakePadsChangeMileage) || 0,
            brakePadsChangeInterval: Number(notificationSettingsData.brakePadsChangeInterval) || 0,

            lastTireRotationMileage: Number(notificationSettingsData.lastTireRotationMileage) || 0,
            tireRotationInterval: Number(notificationSettingsData.tireRotationInterval) || 0,

            lastTransmissionFluidChangeMileage: Number(notificationSettingsData.lastTransmissionFluidChangeMileage) || 0,
            transmissionFluidChangeInterval: Number(notificationSettingsData.transmissionFluidChangeInterval) || 0,

            lastSparkPlugChangeMileage: Number(notificationSettingsData.lastSparkPlugChangeMileage) || 0,
            sparkPlugChangeInterval: Number(notificationSettingsData.sparkPlugChangeInterval) || 0,

            lastTimingBeltChangeMileage: Number(notificationSettingsData.lastTimingBeltChangeMileage) || 0,
            timingBeltChangeInterval: Number(notificationSettingsData.timingBeltChangeInterval) || 0,

            lastTimingChainChangeMileage: Number(notificationSettingsData.lastTimingChainChangeMileage) || 0,
            timingChainChangeInterval: Number(notificationSettingsData.timingChainChangeInterval) || 0,

            lastWaterPumpReplacementMileage: Number(notificationSettingsData.lastWaterPumpReplacementMileage) || 0,
            waterPumpReplacementInterval: Number(notificationSettingsData.waterPumpReplacementInterval) || 0,
        };

        try {
            await dispatch(updateNotificationSettings(carId, payload));
            await sendNotification(email, 'New Notification Settings Added', `You have set up new notification settings for car ${carId}.`);

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

                {sections.map((section, index) => (
                    <div key={index} className="section-container">
                        <div className="section-header" onClick={() => toggleSection(section.title)}>
                            {section.title}
                            <span className={expandedSections[section.title] ? 'expanded' : ''}>⮟</span>
                        </div>
                        {expandedSections[section.title] && (
                            <div className="section-content">
                                {section.fields.map((field, idx) => {
                                    if (typeof field === 'object') {
                                        return (
                                            <div key={idx} className="sub-section-container">
                                                <div className="sub-section-header" onClick={() => toggleSection(field.name)}>
                                                    {field.notifications ? (
                                                        field.notifications.map((notification, subIdx) => (
                                                            <div key={subIdx} className="form-group">
                                                                <label>
                                                                    {notification.label}:
                                                                    <input
                                                                        type="checkbox"
                                                                        name={notification.name}
                                                                        checked={notificationSettingsData[notification.name]}
                                                                        onChange={handleInputChange}
                                                                        className="checkbox"
                                                                    />
                                                                </label>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="form-group">
                                                            <label>
                                                                {field.label} :
                                                                <input
                                                                    type="checkbox"
                                                                    name={field.name}
                                                                    checked={notificationSettingsData[field.name]}
                                                                    onChange={handleInputChange}
                                                                    className="checkbox"
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>

                                                {field.subFields && field.subFields.map((subField, subIdx) => (
                                                    <div key={subIdx} className="form-group">
                                                        <label>
                                                            {carService.formatServiceType(subField)}:
                                                            <input
                                                                type="number"
                                                                name={subField}
                                                                value={notificationSettingsData[subField]}
                                                                onChange={handleInputChange}
                                                                className="input-field"
                                                            />
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={idx} className="form-group">
                                            <label>
                                                {carService.formatServiceType(field)} Notification:
                                                <input
                                                    type="checkbox"
                                                    name={field}
                                                    checked={notificationSettingsData[field]}
                                                    onChange={handleInputChange}
                                                    className="checkbox"
                                                />
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                <div className="button-container">
                    <button type="submit" className="buttons">Save</button>
                    <button type="button" className="buttons" onClick={() => goToNotifications(carId)}>Back</button>
                </div>
            </form>
        </div>
    );

};

export default NotificationSettings;