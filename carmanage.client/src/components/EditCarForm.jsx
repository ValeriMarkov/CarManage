import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const EditCarForm = () => {
    const { carId } = useParams();
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
    const navigate = useNavigate();

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
                    setCarData(data);
                } else {
                    setError('User is not authenticated');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [carId]);

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
            const idToken = await user.getIdToken(true);

            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(carData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update car details');
                }

                const data = await response.json();
                alert('Car details updated successfully');
                navigate("/");
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError('User is not authenticated');
        }
    };


    const handleBack = () => {
        navigate(-1);
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
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default EditCarForm;
