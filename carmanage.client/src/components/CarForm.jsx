import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../firebase';
import { useNavigate } from 'react-router-dom';

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const CarForm = () => {
    const [carData, setCarData] = useState({
        brand: '',
        model: '',
        year: '',
        color: '',
        vin: '',
        engine: '',
        horsepower: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const auth = getAuth();
        const user = auth.currentUser;
        console.log("Authenticated user:", user);

        if (user) {
            user.getIdToken(true).then((idToken) => {
                const carDataWithUser = { ...carData, userId: user.uid };


                console.log("Car data being sent:", carDataWithUser);

                fetch('https://localhost:7025/api/cars', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(carDataWithUser)
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Failed to add car');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log('Car added:', data);
                        setCarData({
                            brand: '',
                            model: '',
                            year: '',
                            color: '',
                            vin: '',
                            engine: '',
                            horsepower: ''
                        });
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        setError(error.message);
                    })
                    .finally(() => setLoading(false));
            });
        } else {
            console.log('User is not authenticated');
            setLoading(false);
            setError('User is not authenticated. Please log in.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="brand"
                value={carData.brand}
                onChange={handleInputChange}
                placeholder="Brand"
                required
            />
            <input
                type="text"
                name="model"
                value={carData.model}
                onChange={handleInputChange}
                placeholder="Model"
                required
            />
            <input
                type="number"
                name="year"
                value={carData.year}
                onChange={handleInputChange}
                placeholder="Year"
                required
            />
            <input
                type="text"
                name="color"
                value={carData.color}
                onChange={handleInputChange}
                placeholder="Color"
                required
            />
            <input
                type="text"
                name="vin"
                value={carData.vin}
                onChange={handleInputChange}
                placeholder="VIN"
                required
            />
            <input
                type="number"
                name="engine"
                value={carData.engine}
                onChange={handleInputChange}
                placeholder="Engine"
                required
            />
            <input
                type="number"
                name="horsepower"
                value={carData.horsepower}
                onChange={handleInputChange}
                placeholder="Horsepower"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Adding Car...' : 'Add Car'}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default CarForm;
