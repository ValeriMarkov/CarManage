import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CarDetails.css';

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

    const onRemoveClick = async () => {
        if (window.confirm('Are you sure you want to remove this car?')) {
            try {
                await handleRemoveCar(carId);
                navigate('/');
            } catch (err) {
                alert('Failed to remove car: ' + err.message);
            }
        }
    };

    const goToAddServicePage = () => {
        navigate(`/cars/${carId}/add-service`);
    };

    const onRemoveServiceHistory = async (serviceHistoryId) => {
        if (window.confirm("Are you sure you want to delete this service history?")) {
            try {
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
                setSuccessMessage("Service history removed successfully!");
                setError(null);
            } catch (err) {
                setError(err.message);
                setSuccessMessage(null);
            }
        }
    };

    const onEditService = (id) => {
        navigate(`/cars/${carId}/services/${id}/edit`, {
            state: { carId, serviceId: id }
        });
    };

    if (loading) return <p>Loading car details...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="car-details-container">
            <h2>Car Details</h2>
            <div className="car-info">
                <p><strong>Brand:</strong> {car.brand}</p>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Color:</strong> {car.color}</p>
                <p><strong>VIN:</strong> {car.vin}</p>
                <p><strong>Engine:</strong> {car.engine}L</p>
                <p><strong>Horsepower:</strong> {car.horsePower} HP</p>
                <p><strong>Odometer:</strong> {car.odometer} km</p>
            </div>

            <div className="button-group">
                <button className="buttons" onClick={() => navigate('/')}>Back to Home</button>
                <button className="buttons" onClick={onRemoveClick}>Remove</button>
                <button className="buttons" onClick={() => navigate(`/cars/${carId}/notifications`)}>Manage Notifications</button>
                <button className="buttons" onClick={() => navigate(`/cars/${carId}/export`)}>Export as Document</button>
            </div>

            <h2>Service History</h2>
            <button className="buttons add-service-btn" onClick={goToAddServicePage}>Add Service</button>

            <div className="service-history">
                {loadingServices ? (
                    <p>Loading service history...</p>
                ) : (
                    services.length === 0 ? (
                        <p>No service history found.</p>
                    ) : (
                        <ul>
                            {services.map(service => (
                                <li key={service.id} className="service-item">
                                    <p><strong>Service Date:</strong> {new Date(service.serviceDate).toLocaleDateString()}</p>
                                    <p><strong>Odometer at Service:</strong> {service.odometerAtService} km</p>
                                    <p><strong>Notes:</strong> {service.notes}</p>
                                    <p><strong>Services:</strong> {service.selectedServices?.join(", ")}</p>
                                    <div className="button-group">
                                        <button className="buttons" onClick={() => onRemoveServiceHistory(service.id)}>Delete</button>
                                        <button className="buttons" onClick={() => onEditService(service.id)}>Edit</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default CarDetails;
