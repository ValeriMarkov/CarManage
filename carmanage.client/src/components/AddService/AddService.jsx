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

        // Validate if at least one service is selected
        if (serviceData.selectedServices.length === 0) {
            setError('Please select at least one service.');
            return;
        }

        const token = await user.getIdToken(true);

        // Create the payload with CarId field
        const newService = {
            CarId: carId,
            ServiceDate: serviceData.serviceDate,
            OdometerAtService: parseInt(serviceData.odometerAtService),
            Notes: serviceData.notes,
            SelectedServicesInput: serviceData.selectedServices,
        };

        console.log('New Service Payload:', newService); // Log the payload to check if everything is correct

        try {
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
                console.error('Backend Error:', errorDetails); // Log backend error details
                throw new Error('Failed to add service');
            }

            navigate(`/cars/${carId}`); // Redirect after successful service addition
        } catch (err) {
            console.error('Error:', err.message);
            setError('Failed to add service. Please try again.');
        }
    };

    return (
        <div className="add-service-container">
            <h2>Add Service History</h2>
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
                    <h3>Select Services:</h3>
                    {services.map((service) => (
                        <div key={service.id}>
                            <input
                                type="checkbox"
                                checked={serviceData.selectedServices.includes(service.id)}
                                onChange={() => handleServiceSelection(service.id)}
                                value={service.id}
                            />
                            <label htmlFor={service.label}>{service.label}</label>
                        </div>
                    ))}
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddService;
