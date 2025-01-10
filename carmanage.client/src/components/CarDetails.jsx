import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For fetching params from URL

const CarDetails = () => {
    const { carId } = useParams(); // Extract carId from the URL
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch car details');
                }
                const data = await response.json();
                setCar(data); // Set car data
            } catch (err) {
                setError(err.message); // Set error if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [carId]); // Run this effect whenever carId changes

    if (loading) {
        return <p>Loading car details...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div>
            <h2>Car Details</h2>
            <h3>{car.brand} {car.model} - {car.year}</h3>
            <p><strong>Color:</strong> {car.color}</p>
            <p><strong>VIN:</strong> {car.vin}</p>
            <p><strong>Engine:</strong> {car.engine}L</p>
            <p><strong>Horsepower:</strong> {car.horsepower} HP</p>
            {/* Add more details here if necessary */}
        </div>
    );
};

export default CarDetails;
