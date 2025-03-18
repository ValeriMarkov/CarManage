import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../../firebase';
import { useNavigation } from '../../utils';
import './AddCar.css';

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
        horsepower: '',
        odometer: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const { goToHome } = useNavigation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!carData.brand) errors.brand = 'Brand is required';
        if (!carData.model) errors.model = 'Model is required';
        if (!carData.year || carData.year < 1900 || carData.year > new Date().getFullYear()) errors.year = 'Invalid year';
        if (!carData.vin) errors.vin = 'VIN is required';

        const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!vinPattern.test(carData.vin)) {
            errors.vin = 'VIN must be exactly 17 alphanumeric characters';
        }

        if (!carData.engine) errors.engine = 'Engine is required';
        if (!carData.horsepower) errors.horsepower = 'Horsepower is required';
        if (carData.odometer < 0) errors.odometer = 'Odometer must be a positive number';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            user.getIdToken(true).then((idToken) => {
                const carDataWithUser = { ...carData, userId: user.uid };

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
                            if (response.status === 400) {
                                throw new Error('VIN already exists. Please check the VIN and try again.');
                            } else if (response.status === 500) {
                                throw new Error('Server error. Please try again later.');
                            } else {
                                throw new Error('Failed to add car');
                            }
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setCarData({
                            brand: '',
                            model: '',
                            year: '',
                            color: '',
                            vin: '',
                            engine: '',
                            horsepower: '',
                            odometer: ''
                        });
                        goToHome();
                    })
                    .catch((error) => {
                        setError(error.message);
                    })
                    .finally(() => setLoading(false));
            });
        } else {
            setLoading(false);
            setError('User is not authenticated. Please log in.');
        }
    };

    return (
        <div className="container">
            <div className="car-info">
                <h2>Add a new car</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            name="brand"
                            value={carData.brand}
                            onChange={handleInputChange}
                            placeholder="Brand"
                            required
                        />
                        {formErrors.brand && <p className="error-message">{formErrors.brand}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            name="model"
                            value={carData.model}
                            onChange={handleInputChange}
                            placeholder="Model"
                            required
                        />
                        {formErrors.model && <p className="error-message">{formErrors.model}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="number"
                            name="year"
                            value={carData.year}
                            onChange={handleInputChange}
                            placeholder="Year"
                            required
                        />
                        {formErrors.year && <p className="error-message">{formErrors.year}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            name="color"
                            value={carData.color}
                            onChange={handleInputChange}
                            placeholder="Color"
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            name="vin"
                            value={carData.vin}
                            onChange={handleInputChange}
                            placeholder="VIN"
                            required
                        />
                        {formErrors.vin && <p className="error-message">{formErrors.vin}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="number"
                            name="engine"
                            value={carData.engine}
                            onChange={handleInputChange}
                            placeholder="Engine"
                            required
                        />
                        {formErrors.engine && <p className="error-message">{formErrors.engine}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="number"
                            name="horsepower"
                            value={carData.horsepower}
                            onChange={handleInputChange}
                            placeholder="Horsepower"
                            required
                        />
                        {formErrors.horsepower && <p className="error-message">{formErrors.horsepower}</p>}
                    </div>

                    <div className="input-container">
                        <input
                            type="number"
                            name="odometer"
                            value={carData.odometer}
                            onChange={handleInputChange}
                            placeholder="Odometer"
                            required
                        />
                        {formErrors.odometer && <p className="error-message">{formErrors.odometer}</p>}
                    </div>

                    <button className="buttons" type="submit" disabled={loading}>
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            'Add Car'
                        )}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
            <button className="buttons" onClick={goToHome} disabled={loading}>Back</button>
        </div >
    );
};

export default CarForm;
