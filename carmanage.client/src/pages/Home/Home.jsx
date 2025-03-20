import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import carService from "../../services/carService";
import { useNavigation } from '../../utils';
import "./Home.css";

const Home = () => {
    const { user, handleRemoveCar } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { goToAddCar, goToEditCar, goToCarDetails } = useNavigation();

    const onRemoveCar = async (carId) => {
        try {
            if (window.confirm("Are you sure you want to delete this car?")) {
                await handleRemoveCar(carId);
                setCars(cars.filter((car) => car.id !== carId));
                setSuccessMessage("Car removed successfully!");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!user) return setLoading(false);

        carService.fetchCars(user)
            .then(setCars)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div>
            <h2>Cars dashboard</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button className="buttons" onClick={goToAddCar}>Add Car</button>
                    <h3>Your Cars</h3>
                    {loading ? (
                        <p>Loading cars...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : cars.length === 0 ? (
                        <p>No cars added yet.</p>
                    ) : (
                        <div className="car-info">
                            <ul>
                                {cars.map((car) => (
                                    <li key={car.id}>
                                        <a href="#" onClick={() => goToCarDetails(car.id)}>
                                            {car.brand} {car.model} - {car.year} ({car.color})
                                        </a>
                                        <div className="button-container">
                                            <button className="buttons" onClick={() => goToCarDetails(car.id)}>Details</button>
                                            <button className="buttons" onClick={() => goToEditCar(car.id)}>Edit</button>
                                            <button className="buttons" onClick={() => onRemoveCar(car.id)}>Remove</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <p>Please log in or register to continue.</p>
            )}
        </div>
    );
};

export default Home;
