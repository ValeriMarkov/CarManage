import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import useAuth hook
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const { user, handleRemoveCar } = useAuth(); // Get handleRemoveCar from context
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // Success state for feedback

    const goToAddCarPage = () => {
        navigate("/add-car");
    };

    const goToCarDetailsPage = (carId) => {
        navigate(`/cars/${carId}`);
    };

    const handleEditCar = (carId) => {
        navigate(`/edit-car/${carId}`);
    };

    // Use the context's handleRemoveCar
    const onRemoveCar = async (carId) => {
        try {
            if (window.confirm("Are you sure you want to delete this car?")) {
                await handleRemoveCar(carId); // Call handleRemoveCar from context
                setCars(cars.filter((car) => car.id !== carId)); // Remove car from local list
                setSuccessMessage("Car removed successfully!"); // Show success message
            }
        } catch (err) {
            setError(err.message); // Show error if removal fails
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
            setLoading(false); // No user, stop loading
        }
    }, [user]); // Only run when user changes

    return (
        <div className="home-container">
            <h2>Welcome to the Home Page</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={goToAddCarPage}>Add Car</button>
                    {successMessage && <p className="success">{successMessage}</p>} {/* Success message */}
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
                                        <button onClick={() => handleEditCar(car.id)}>Edit</button>
                                        <button onClick={() => onRemoveCar(car.id)}>Remove</button> {/* Remove car */}
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
