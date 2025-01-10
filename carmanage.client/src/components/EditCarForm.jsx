import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const EditCarForm = () => {
    const { carId } = useParams(); // Get carId from URL
    const [carData, setCarData] = useState({
        brand: '',
        model: '',
        year: '',
        color: '',
        vin: '',
        engine: '',
        horsepower: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch car details when the component mounts
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const idToken = await user.getIdToken(true); // Get the authentication token
                    const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}` // Send the token as a Bearer token in the Authorization header
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch car details');
                    }

                    const data = await response.json();
                    setCarData(data); // Set the fetched car data
                } else {
                    setError('User is not authenticated');
                }
            } catch (err) {
                setError(err.message); // Set error message if fetching fails
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchCarDetails();
    }, [carId]); // Run when carId changes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const idToken = await user.getIdToken(true); // Get the authentication token

            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}` // Send the token as a Bearer token in the Authorization header
                    },
                    body: JSON.stringify(carData) // Send the updated car data
                });

                if (!response.ok) {
                    throw new Error('Failed to update car details');
                }

                const data = await response.json();
                alert('Car details updated successfully');
                // Redirect to the home page or car details page after successful update
            } catch (err) {
                setError(err.message); // Set error message if update fails
            }
        } else {
            setError('User is not authenticated');
        }
    };

    if (loading) {
        return <p>Loading car details...</p>;
    }

    return (
        <div>
            <h2>Edit Car</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="brand"
                    value={carData.brand || ''}
                    onChange={handleInputChange}
                    placeholder="Brand"
                    required
                />
                <input
                    type="text"
                    name="model"
                    value={carData.model || ''}
                    onChange={handleInputChange}
                    placeholder="Model"
                    required
                />
                <input
                    type="number"
                    name="year"
                    value={carData.year || ''}
                    onChange={handleInputChange}
                    placeholder="Year"
                    required
                />
                <input
                    type="text"
                    name="color"
                    value={carData.color || ''}
                    onChange={handleInputChange}
                    placeholder="Color"
                    required
                />
                <input
                    type="text"
                    name="vin"
                    value={carData.vin || ''}
                    onChange={handleInputChange}
                    placeholder="VIN"
                    required
                />
                <input
                    type="number"
                    name="engine"
                    value={carData.engine || ''}
                    onChange={handleInputChange}
                    placeholder="Engine"
                    required
                />
                <input
                    type="number"
                    name="horsepower"
                    value={carData.horsepower || ''}
                    onChange={handleInputChange}
                    placeholder="Horsepower"
                    required
                />
                <button type="submit">Update Car</button>
            </form>
        </div>
    );
};

export default EditCarForm;
