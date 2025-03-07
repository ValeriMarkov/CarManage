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
        brakePadsNotification: notificationSettings.brakePadsNotification || false,
        lastBrakePadsChangeMileage: notificationSettings.lastBrakePadsChangeMileage || '',
        brakePadsChangeInterval: notificationSettings.brakePadsChangeInterval || '',
        tireRotationNotification: notificationSettings.tireRotationNotification || false,
        lastTireRotationMileage: notificationSettings.lastTireRotationMileage || '',
        tireRotationInterval: notificationSettings.tireRotationInterval || '',
        batteryCheckNotification: notificationSettings.batteryCheckNotification || false,
        lastBatteryCheckMileage: notificationSettings.lastBatteryCheckMileage || '',
        batteryCheckInterval: notificationSettings.batteryCheckInterval || '',
        transmissionFluidChangeNotification: notificationSettings.transmissionFluidChangeNotification || false,
        lastTransmissionFluidChangeMileage: notificationSettings.lastTransmissionFluidChangeMileage || '',
        transmissionFluidChangeInterval: notificationSettings.transmissionFluidChangeInterval || '',
        engineFlushNotification: notificationSettings.engineFlushNotification || false,
        lastEngineFlushMileage: notificationSettings.lastEngineFlushMileage || '',
        engineFlushInterval: notificationSettings.engineFlushInterval || '',
        coolantFlushNotification: notificationSettings.coolantFlushNotification || false,
        lastCoolantFlushMileage: notificationSettings.lastCoolantFlushMileage || '',
        coolantFlushInterval: notificationSettings.coolantFlushInterval || '',
        sparkPlugChangeNotification: notificationSettings.sparkPlugChangeNotification || false,
        lastSparkPlugChangeMileage: notificationSettings.lastSparkPlugChangeMileage || '',
        sparkPlugChangeInterval: notificationSettings.sparkPlugChangeInterval || '',
        timingBeltNotification: notificationSettings.timingBeltNotification || false,
        lastTimingBeltChangeMileage: notificationSettings.lastTimingBeltChangeMileage || '',
        timingBeltChangeInterval: notificationSettings.timingBeltChangeInterval || '',
        fuelInjectionCleaningNotification: notificationSettings.fuelInjectionCleaningNotification || false,
        lastFuelInjectionCleaningMileage: notificationSettings.lastFuelInjectionCleaningMileage || '',
        fuelInjectionCleaningInterval: notificationSettings.fuelInjectionCleaningInterval || '',
        alignmentNotification: notificationSettings.alignmentNotification || false,
        lastAlignmentMileage: notificationSettings.lastAlignmentMileage || '',
        alignmentInterval: notificationSettings.alignmentInterval || '',
        suspensionNotification: notificationSettings.suspensionNotification || false,
        lastSuspensionCheckMileage: notificationSettings.lastSuspensionCheckMileage || '',
        suspensionCheckInterval: notificationSettings.suspensionCheckInterval || '',
        acRechargeNotification: notificationSettings.acRechargeNotification || false,
        lastAcRechargeMileage: notificationSettings.lastAcRechargeMileage || '',
        acRechargeInterval: notificationSettings.acRechargeInterval || '',
        differentialFluidChangeNotification: notificationSettings.differentialFluidChangeNotification || false,
        lastDifferentialFluidChangeMileage: notificationSettings.lastDifferentialFluidChangeMileage || '',
        differentialFluidChangeInterval: notificationSettings.differentialFluidChangeInterval || '',
        timingChainChangeNotification: notificationSettings.timingChainChangeNotification || false,
        lastTimingChainChangeMileage: notificationSettings.lastTimingChainChangeMileage || '',
        timingChainChangeInterval: notificationSettings.timingChainChangeInterval || '',
        clutchReplacementNotification: notificationSettings.clutchReplacementNotification || false,
        lastClutchReplacementMileage: notificationSettings.lastClutchReplacementMileage || '',
        clutchReplacementInterval: notificationSettings.clutchReplacementInterval || '',
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
            lastBatteryCheckMileage: Number(notificationSettingsData.lastBatteryCheckMileage) || 0,
            batteryCheckInterval: Number(notificationSettingsData.batteryCheckInterval) || 0,
            lastTransmissionFluidChangeMileage: Number(notificationSettingsData.lastTransmissionFluidChangeMileage) || 0,
            transmissionFluidChangeInterval: Number(notificationSettingsData.transmissionFluidChangeInterval) || 0,
            lastEngineFlushMileage: Number(notificationSettingsData.lastEngineFlushMileage) || 0,
            engineFlushInterval: Number(notificationSettingsData.engineFlushInterval) || 0,
            lastCoolantFlushMileage: Number(notificationSettingsData.lastCoolantFlushMileage) || 0,
            coolantFlushInterval: Number(notificationSettingsData.coolantFlushInterval) || 0,
            sparkPlugChangeNotification: notificationSettingsData.sparkPlugChangeNotification,
            lastSparkPlugChangeMileage: Number(notificationSettingsData.lastSparkPlugChangeMileage) || 0,
            sparkPlugChangeInterval: Number(notificationSettingsData.sparkPlugChangeInterval) || 0,
            lastTimingBeltChangeMileage: Number(notificationSettingsData.lastTimingBeltChangeMileage) || 0,
            timingBeltChangeInterval: Number(notificationSettingsData.timingBeltChangeInterval) || 0,
            fuelInjectionCleaningNotification: notificationSettingsData.fuelInjectionCleaningNotification,
            lastFuelInjectionCleaningMileage: Number(notificationSettingsData.lastFuelInjectionCleaningMileage) || 0,
            fuelInjectionCleaningInterval: Number(notificationSettingsData.fuelInjectionCleaningInterval) || 0,
            lastAlignmentMileage: Number(notificationSettingsData.lastAlignmentMileage) || 0,
            alignmentInterval: Number(notificationSettingsData.alignmentInterval) || 0,
            lastSuspensionCheckMileage: Number(notificationSettingsData.lastSuspensionCheckMileage) || 0,
            suspensionCheckInterval: Number(notificationSettingsData.suspensionCheckInterval) || 0,
            lastAcRechargeMileage: Number(notificationSettingsData.lastAcRechargeMileage) || 0,
            acRechargeInterval: Number(notificationSettingsData.acRechargeInterval) || 0,
            lastDifferentialFluidChangeMileage: Number(notificationSettingsData.lastDifferentialFluidChangeMileage) || 0,
            differentialFluidChangeInterval: Number(notificationSettingsData.differentialFluidChangeInterval) || 0,
            lastTimingChainChangeMileage: Number(notificationSettingsData.lastTimingChainChangeMileage) || 0,
            timingChainChangeInterval: Number(notificationSettingsData.timingChainChangeInterval) || 0,
            lastClutchReplacementMileage: Number(notificationSettingsData.lastClutchReplacementMileage) || 0,
            clutchReplacementInterval: Number(notificationSettingsData.clutchReplacementInterval) || 0,
        };

        try {
            await dispatch(updateNotificationSettings(carId, payload));
            await sendNotification(email, 'Notification Settings Updated', `Notification settings for car ${carId} have been updated.`);
            navigate(`/cars/${carId}/notifications`);
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
                { name: 'tireRotationNotification', label: 'Tire Rotation Notification', subFields: ['lastTireRotationMileage', 'tireRotationInterval'] },
            ]
        },
        {
            title: 'Battery & Fluids',
            fields: [
                { name: 'batteryCheckNotification', label: 'Battery Check Notification', subFields: ['lastBatteryCheckMileage', 'batteryCheckInterval'] },
                { name: 'transmissionFluidChangeNotification', label: 'Transmission Fluild Change Notification', subFields: ['lastTransmissionFluidChangeMileage', 'transmissionFluidChangeInterval'] },
                { name: 'coolantFlushNotification', label: 'Coolant Flush Notification', subFields: ['lastCoolantFlushMileage', 'coolantFlushInterval'] },
                { name: 'differentialFluidChangeNotification', label: 'Differential Fluid Change Notification', subFields: ['lastDifferentialFluidChangeMileage', 'differentialFluidChangeInterval'] }
            ]
        },
        {
            title: 'Engine & Timing',
            fields: [
                { name: 'engineFlushNotification', label: 'Engine Flush Notification', subFields: ['lastEngineFlushMileage', 'engineFlushInterval'] },
                { name: 'sparkPlugChangeNotification', label: 'Spark Plug Change Notification', subFields: ['lastSparkPlugChangeMileage', 'sparkPlugChangeInterval'] },
                { name: 'timingBeltNotification', label: 'Timing Belt Notification', subFields: ['lastTimingBeltChangeMileage', 'timingBeltChangeInterval'] },
                { name: 'timingChainChangeNotification', label: 'Timing Chain Change Notification', subFields: ['lastTimingChainChangeMileage', 'timingChainChangeInterval'] }
            ]
        },
        {
            title: 'Other Services',
            fields: [
                { name: 'fuelInjectionCleaningNotification', label: 'Fuel Injection Cleaning Notification', subFields: ['lastFuelInjectionCleaningMileage', 'fuelInjectionCleaningInterval'] },
                { name: 'alignmentNotification', label: 'Alignment Notification', subFields: ['lastAlignmentMileage', 'alignmentInterval'] },
                { name: 'suspensionNotification', label: 'Suspension Notification', subFields: ['lastSuspensionCheckMileage', 'suspensionCheckInterval'] },
                { name: 'acRechargeNotification', label: 'AC Recharge Notification', subFields: ['lastAcRechargeMileage', 'acRechargeInterval'] },
                { name: 'clutchReplacementNotification', label: 'Clutch Replacement Notification', subFields: ['lastClutchReplacementMileage', 'clutchReplacementInterval'] }
            ]
        }
    ];

    const formatServiceType = (serviceType) => {
        return serviceType.replace(/([a-z])([A-Z])/g, '$1 $2');
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
                                                            {formatServiceType(subField)}:
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
                                                {formatServiceType(field)} Notification:
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
                    <button type="button" onClick={handleBack} className="buttons">Back</button>
                </div>
            </form>
        </div>
    );

};

export default NotificationSettings;
