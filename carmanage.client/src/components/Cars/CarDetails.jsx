import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import carService from '../../services/carService';
import { useNavigation } from '../../utils';
import formatServiceType from '../../services/carService';
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
    const { goToHome, goToNotifications, goToExport, goToAddService } = useNavigation();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const data = await carService.fetchCarDetails(user, carId);
                setCar(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchServiceHistory = async () => {
            try {
                const data = await carService.fetchServiceHistory(user, carId);
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
                goToHome();
            } catch (err) {
                alert('Failed to remove car: ' + err.message);
            }
        }
    };

    const onRemoveServiceHistory = async (serviceHistoryId) => {
        if (window.confirm("Are you sure you want to delete this service history?")) {
            try {
                await carService.removeServiceHistory(user, carId, serviceHistoryId);
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
                <button className="buttons" onClick={() => goToHome()}>Back to Home</button>
                <button className="buttons" onClick={onRemoveClick}>Remove</button>
                <button className="buttons" onClick={() => goToNotifications(carId)}>Manage Notifications</button>
                <button className="buttons" onClick={() => goToExport(carId)}>Export as Document</button>
            </div>

            <h2>Service History</h2>
            <button className="buttons add-service-btn" onClick={() => goToAddService(carId)}>Add Service</button>

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
                                    <p><strong>Services:</strong> {service.selectedServices?.map(serviceType => carService.formatServiceType(serviceType)).join(", ")}</p>
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
