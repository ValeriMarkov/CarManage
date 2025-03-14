import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import carService from "../../services/carService";

const Home = () => {
    const { user, handleRemoveCar } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const goToAddCarPage = () => {
        navigate("/add-car");
    };

    const goToCarDetailsPage = (carId) => {
        navigate(`/cars/${carId}`);
    };

    const handleEditCar = (carId) => {
        navigate(`/edit-car/${carId}`);
    };

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
        <div className="home-container">
            <h2>Welcome to the Home Page</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button className="buttons" onClick={goToAddCarPage}>Add Car</button>
                    <h3>Your Cars</h3>
                    {loading ? (
                        <p>Loading cars...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : cars.length === 0 ? (
                        <p>No cars added yet.</p>
                    ) : (
                        <ul>
                            {cars.map((car) => (
                                <li key={car.id}>
                                    <a href="#" onClick={() => goToCarDetailsPage(car.id)}>
                                        {car.brand} {car.model} - {car.year} ({car.color})
                                    </a>
                                    <div className="button-container">
                                        <button className="buttons" onClick={() => goToCarDetailsPage(car.id)}>Details</button>
                                        <button className="buttons" onClick={() => handleEditCar(car.id)}>Edit</button>
                                        <button className="buttons" onClick={() => onRemoveCar(car.id)}>Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <p>Please log in or register to continue.</p>
            )}
        </div>
    );
};

export default Home;
