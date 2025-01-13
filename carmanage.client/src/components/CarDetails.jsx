import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAuth } from 'firebase/auth';

const CarDetails = () => {
    const { carId } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const idToken = await user.getIdToken(true);

                    const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch car details');
                    }

                    const data = await response.json();
                    setCar(data);
                } else {
                    throw new Error('User is not authenticated');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [carId]);

    if (loading) {
        return <p>Loading car details...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div>
            <button onClick={() => navigate('/', { replace: true })}>Back to Home</button> {/* Navigate to Home */}
            <h2>Car Details</h2>
            <h3>{car.brand} {car.model} - {car.year} (Year) </h3>
            <p><strong>Color:</strong> {car.color}</p>
            <p><strong>VIN:</strong> {car.vin}</p>
            <p><strong>Engine:</strong> {car.engine}L</p>
            <p><strong>Horsepower:</strong> {car.horsepower} HP</p>
        </div>
    );
};

export default CarDetails;
