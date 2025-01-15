import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AddService.css';

const AddService = () => {
    const { carId } = useParams();  // Get carId from the URL parameters
    const { user } = useAuth();  // Access the current user from AuthContext
    const [serviceDate, setServiceDate] = useState('');
    const [odometerAtService, setOdometerAtService] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const serviceOptions = [
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

    const handleCheckboxChange = (event) => {
        const serviceId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedServices(prevState => [...prevState, serviceId]);
        } else {
            setSelectedServices(prevState => prevState.filter(id => id !== serviceId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newService = {
            ServiceDate: serviceDate,
            OdometerAtService: odometerAtService,
            Notes: notes,
            SelectedServices: selectedServices, // Selected services as bitmask
            CarId: carId // Only send the CarId, not the full Car object
        };

        try {
            const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                },
                body: JSON.stringify(newService), // Make sure the request body is correctly structured
            });

            if (!response.ok) {
                throw new Error('Failed to add service');
            }

            // Optionally handle success (e.g., navigate back or show success message)
            navigate(`/cars/${carId}/services`);

        } catch (err) {
            console.error("Error:", err.message);
            setError('Failed to add service, please try again.');
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
                        value={serviceDate}
                        onChange={(e) => setServiceDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="odometerAtService">Odometer at Service:</label>
                    <input
                        type="number"
                        id="odometerAtService"
                        value={odometerAtService}
                        onChange={(e) => setOdometerAtService(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div>
                    <h3>Select Services:</h3>
                    {serviceOptions.map(service => (
                        <div key={service.id}>
                            <input
                                type="checkbox"
                                id={service.label}
                                value={service.id}
                                onChange={handleCheckboxChange}
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
