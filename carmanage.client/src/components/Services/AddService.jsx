import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    const navigate = useNavigate();

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

        if (serviceData.selectedServices.length === 0) {
            setError('Please select at least one service.');
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

            navigate(`/cars/${carId}`);
        } catch (error) {
            console.error('An error occurred:', error);
            setError('Failed to add service. Please try again.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="add-service-container">
            <h2>Add Service History</h2>
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
                        <h3>Selected Services:</h3>
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

                    <button className="buttons" type="submit">Submit</button>
                </form>
                <button className="buttons" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
};

export default AddService;
