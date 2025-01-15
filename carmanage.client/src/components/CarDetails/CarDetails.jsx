import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import './CarDetails.css'

const CarDetails = () => {
    const { carId } = useParams();
    const { user, handleRemoveCar } = useAuth(); // Access handleRemoveCar from context
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]); // State for service history
    const [loadingServices, setLoadingServices] = useState(true); // State for loading services
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`, // Send user token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch car details');
                }

                const data = await response.json();
                setCar(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchServiceHistory = async () => {
            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`, // Send user token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch service history');
                }

                const data = await response.json();
                setServices(data); // Set the service history
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingServices(false);
            }
        };

        if (user) {
            fetchCarDetails();
            fetchServiceHistory(); // Fetch services alongside car details
        } else {
            setError('User is not authenticated');
            setLoading(false);
            setLoadingServices(false);
        }
    }, [carId, user]);

    const onRemoveClick = async () => {
        try {
            if (window.confirm('Are you sure you want to remove this car?')) {
                await handleRemoveCar(carId); // Call handleRemoveCar from context
                navigate('/'); // After removal, navigate back to Home
            }
        } catch (err) {
            alert('Failed to remove car: ' + err.message);
        }
    };

    const goToAddServicePage = () => {
        navigate(`/cars/${carId}/add-service`); // Navigate to add service page
    };

    if (loading) {
        return <p>Loading car details...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="center">
            <div>
                <button onClick={() => navigate('/', { replace: true })}>Back to Home</button>
                <button onClick={onRemoveClick}>Remove</button>
                <h2>Car Details</h2>
                <h3>{car.brand} {car.model} - {car.year}</h3>
                <p><strong>Color:</strong> {car.color}</p>
                <p><strong>VIN:</strong> {car.vin}</p>
                <p><strong>Engine:</strong> {car.engine}L</p>
                <p><strong>Horsepower:</strong> {car.horsePower} HP</p>
            </div>

            <div>
                <h2>Service History</h2>
                <button onClick={goToAddServicePage}>Add Service</button> {/* Add service button */}
                {loadingServices ? (
                    <p>Loading service history...</p>
                ) : (
                    services.length === 0 ? (
                        <p>No service history found.</p>
                    ) : (
                        <ul>
                            {services.map(service => (
                                <li key={service.id}>
                                    <strong>Service Date:</strong> {new Date(service.serviceDate).toLocaleDateString()}<br />
                                    <strong>Odometer at Service:</strong> {service.odometerAtService} km<br />
                                    <strong>Notes:</strong> {service.notes}<br />
                                    <strong>Selected Services:</strong> {service.selectedServices.join(", ")}<br />
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
};

export default CarDetails;
