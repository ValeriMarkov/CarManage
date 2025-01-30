import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CarDetails.css'

const CarDetails = () => {
    const { carId } = useParams();
    const { user, handleRemoveCar } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
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
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch service history');
                }

                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingServices(false);
            }
        };

        if (user) {
            fetchCarDetails();
            fetchServiceHistory();
        } else {
            setError('User is not authenticated');
            setLoading(false);
            setLoadingServices(false);
        }
    }, [carId, user]);

    useEffect(() => {
        const fetchLatestServiceHistory = async () => {
            if (user && carId) {
                try {
                    const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch latest service history');
                    }

                    const data = await response.json();
                    setServices(data);
                } catch (err) {
                    setError(err.message);
                }
            }
        };

        fetchLatestServiceHistory();
    }, [carId, user]);

    const onRemoveClick = async () => {
        try {
            if (window.confirm('Are you sure you want to remove this car?')) {
                await handleRemoveCar(carId);
                navigate('/');
            }
        } catch (err) {
            alert('Failed to remove car: ' + err.message);
        }
    };

    const goToAddServicePage = () => {
        navigate(`/cars/${carId}/add-service`);
    };

    const onRemoveServiceHistory = async (carId, serviceHistoryId) => {
        try {
            if (window.confirm("Are you sure you want to delete this service history?")) {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}/services/${serviceHistoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to remove service history');
                }

                setServices(services.filter((service) => service.id !== serviceHistoryId));
                alert("Service history removed successfully!");
                setSuccessMessage("Service history removed successfully!");
                setError(null);
            }
        } catch (err) {
            setError(err.message);
            setSuccessMessage(null);
        }
    };

    const onEditService = async (id) => {
        navigate(`/cars/${carId}/services/${id}/edit`, {
            state: { carId: carId, serviceId: id }
        });
    };

    if (loading) {
        return <p>Loading car details...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    console.log(services);

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
                <button onClick={goToAddServicePage}>Add Service</button>
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
                                <strong>Selected Services:</strong> {service.selectedServices && service.selectedServices.join(", ")}<br />
                                <button onClick={() => onRemoveServiceHistory(car.id, service.id)}>Delete</button>
                                <button onClick={() => onEditService(service.id)}>Edit</button>
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