import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Export.css';

const Export = () => {
    const { carId } = useParams();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                setLoading(false);
            }
        };

        if (user) {
            fetchCarDetails();
            fetchServiceHistory();
        } else {
            setError('User is not authenticated');
            setLoading(false);
        }
    }, [carId, user]);

    const handleExportPDF = async () => {
        try {
            const response = await fetch(`https://localhost:7025/api/export/pdf?carIds=${carId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `car_${carId}_service_history.pdf`;
            link.click();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await fetch(`https://localhost:7025/api/export/csv?carIds=${carId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate CSV');
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `car_${carId}_service_history.csv`;
            link.click();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading export data...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="export-container">
            <h2>Export Car Details and Service History</h2>
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
                <button className="buttons" onClick={handleExportPDF}>Export as PDF</button>
                <button className="buttons" onClick={handleExportCSV}>Export as CSV</button>
            </div>

            <h3>Service History</h3>
            {services.length === 0 ? (
                <p>No service history available to export.</p>
            ) : (
                <ul>
                    {services.map(service => (
                        <li key={service.id}>
                            <p><strong>Service Date:</strong> {new Date(service.serviceDate).toLocaleDateString()}</p>
                            <p><strong>Odometer at Service:</strong> {service.odometerAtService} km</p>
                            <p><strong>Notes:</strong> {service.notes}</p>
                            <p><strong>Services:</strong> {service.selectedServices?.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Export;
