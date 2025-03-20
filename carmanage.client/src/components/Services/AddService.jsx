import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../utils';
import './AddService.css';

const AddService = () => {
    const { carId } = useParams();
    const { user } = useAuth();
    const [serviceData, setServiceData] = useState({
        serviceDate: '',
        odometerAtService: '',
        notes: '',
        selectedServices: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { goToCarDetails } = useNavigation();

    const services = [
        { id: 1, label: 'Oil Change' },
        { id: 2, label: 'Brake Pads' },
        { id: 4, label: 'Filter Change' },
        { id: 8, label: 'Tire Rotation' },
        { id: 16, label: 'Battery Check' },
        { id: 32, label: 'Transmission Fluid Change' },
        { id: 64, label: 'Engine Flush' },
        { id: 128, label: 'Coolant Flush' },
        { id: 256, label: 'Spark Plug Replacement' },
        { id: 512, label: 'Timing Belt Replacement' },
        { id: 1024, label: 'Fuel Injection Cleaning' },
        { id: 2048, label: 'Alignment' },
        { id: 4096, label: 'Suspension Check' },
        { id: 8192, label: 'AC Recharge' },
        { id: 16384, label: 'Differential Fluid Change' },
        { id: 32768, label: 'Timing Chain Replacement' },
        { id: 65536, label: 'Clutch Replacement' },
        { id: 131072, label: 'Coolant Hose Replacement' },
        { id: 262144, label: 'Turbocharger Replacement' },
        { id: 524288, label: 'Alternator Replacement' },
        { id: 1048576, label: 'Alternator Element Replacement' },
        { id: 2097152, label: 'Water Pump Replacement' },
        { id: 4194304, label: 'Starter Motor Replacement' },
        { id: 8388608, label: 'Drive Shaft Replacement' },
        { id: 16777216, label: 'Control Arm Replacement' },
        { id: 33554432, label: 'Control Arm Bushing Replacement' },
        { id: 67108864, label: 'Shock Absorber Replacement' },
        { id: 134217728, label: 'Engine Mount Replacement' },
        { id: 268435456, label: 'Cylinder Head Gasket Replacement' },
        { id: 536870912, label: 'Intake Manifold Gasket Replacement' },
        { id: 1073741824, label: 'Exhaust Manifold Gasket Replacement' },
        { id: 2147483648, label: 'Valve Cover Gasket Replacement' },
        { id: 4294967296, label: 'EGR Valve Replacement' },
        { id: 8589934592, label: 'Axle Replacement' },
        { id: 17179869184, label: 'Camshaft Replacement' },
        { id: 34359738368, label: 'Piston Ring Replacement' },
    ];

    const handleServiceSelection = (serviceId) => {
        const isSelected = serviceData.selectedServices.includes(serviceId);
        if (isSelected) {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServices: prevState.selectedServices.filter((id) => id !== serviceId),
            }));
        } else {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServices: [...prevState.selectedServices, serviceId],
            }));
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setServiceData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (serviceData.selectedServices.length === 0) {
            setError('Please select at least one service.');
            setLoading(false);
            return;
        }

        try {
            const token = await user.getIdToken(true);

            const newService = {
                CarId: carId,
                ServiceDate: serviceData.serviceDate,
                OdometerAtService: serviceData.odometerAtService.toString(),
                Notes: serviceData.notes,
                SelectedServices: serviceData.selectedServices,
            };

            const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newService),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Backend Error:', errorDetails);
                throw new Error('Failed to add service');
            }

            const data = await response.json();

            goToCarDetails(carId);
        } catch (error) {
            console.error('An error occurred:', error);
            setError('Failed to add service. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="add-service-container">
                <h2>Add Service</h2>
                <div className="add-service-form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="serviceDate">Service Date:</label>
                            <input
                                type="date"
                                id="serviceDate"
                                value={serviceData.serviceDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="odometerAtService">Odometer at Service:</label>
                            <input
                                type="number"
                                id="odometerAtService"
                                value={serviceData.odometerAtService}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="notes">Notes:</label>
                            <textarea
                                id="notes"
                                value={serviceData.notes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <h3>Services done:</h3>
                        </div>

                        <div className="checkboxes">
                            {services.map((service) => (
                                <div key={service.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={serviceData.selectedServices.includes(service.id)}
                                        onChange={() => handleServiceSelection(service.id)}
                                        value={service.id}
                                        id={`service-${service.id}`}
                                    />
                                    <label htmlFor={`service-${service.id}`}>{service.label}</label>
                                </div>
                            ))}
                        </div>

                        {error && <p className="error">{error}</p>}

                        <div className="buttons-container">
                            <button className="buttons" type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                            <button className="buttons" onClick={() => goToCarDetails(carId)}>Back</button>
                        </div>
                    </form>

                    {loading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddService;
