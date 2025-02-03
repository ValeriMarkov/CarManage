import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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
        const fetchCars = async () => {
            try {
                const idToken = await user.getIdToken(true);
                const response = await fetch("https://localhost:7025/api/cars", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${idToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cars");
                }

                const data = await response.json();
                setCars(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCars();
        } else {
            setLoading(false);
        }
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
                    ) : (
                        <ul>
                            {cars.length === 0 ? (
                                <li>No cars added yet.</li>
                            ) : (
                                cars.map((car) => (
                                    <li key={car.id}>
                                        <a href="#" onClick={() => goToCarDetailsPage(car.id)}>
                                            {car.brand} {car.model} - {car.year} ({car.color})
                                        </a>
                                        <button className="buttons" onClick={() => goToCarDetailsPage(car.id)}>Details</button>
                                        <button className="buttons" onClick={() => handleEditCar(car.id)}>Edit</button>
                                        <button className="buttons" onClick={() => onRemoveCar(car.id)}>Remove</button>
                                    </li>
                                ))
                            )}
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
