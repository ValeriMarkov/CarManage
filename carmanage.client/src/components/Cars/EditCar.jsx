import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import carService from '../../services/carService';
import './EditCar.css';

const EditCar = () => {
    const { carId } = useParams();
    const [carData, setCarData] = useState({
        brand: '',
        model: '',
        year: '',
        color: '',
        vin: '',
        engine: '',
        horsepower: '',
        odometer: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const data = await carService.fetchCarDetails(user, carId);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        setLoading(true);

        if (user) {
            try {
                const idToken = await user.getIdToken(true);
                const updatedCarData = { ...carData };
                delete updatedCarData.horsepower;
                updatedCarData.HorsePower = carData.horsepower;

                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(updatedCarData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update car details');
                }

                const data = await response.json();
                alert('Car details updated successfully');
                navigate("/");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            setError('User is not authenticated');
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <p>Loading car details...</p>;
    }

    return (
        <div className="edit-car-container">
            <h2>Edit Car</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        name="brand"
                        value={carData.brand || ''}
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
                        value={carData.model || ''}
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
                        value={carData.year || ''}
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
                        value={carData.color || ''}
                        onChange={handleInputChange}
                        placeholder="Color"
                    />
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        name="vin"
                        value={carData.vin || ''}
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
                        value={carData.engine || ''}
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
                        value={carData.horsepower || ''}
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
                        value={carData.odometer || ''}
                        onChange={handleInputChange}
                        placeholder="Odometer"
                        required
                    />
                    {formErrors.odometer && <p className="error-message">{formErrors.odometer}</p>}
                </div>

                <button className="buttons" type="submit" disabled={loading}>
                    {loading ? 'Updating Car...' : 'Update Car'}
                </button>
            </form>
            <button className="buttons back-button" onClick={handleBack} disabled={loading}>Back</button>
        </div>
    );
};

export default EditCar;
