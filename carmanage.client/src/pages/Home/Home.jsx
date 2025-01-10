import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigation
import "./Home.css"; // Import the CSS file for Home page styles

const Home = () => {
    const { user } = useAuth(); // Get the user from context
    const navigate = useNavigate(); // Initialize the navigate function for routing
    const [cars, setCars] = useState([]); // State to hold the list of cars
    const [loading, setLoading] = useState(true); // Loading state for cars data
    const [error, setError] = useState(null); // State to hold error messages

    // Function to navigate to the 'Add Car' page
    const goToAddCarPage = () => {
        navigate("/add-car");
    };

    // Function to navigate to the 'Car Details' page
    const goToCarDetailsPage = (carId) => {
        navigate(`/cars/${carId}`);
    };

    // Function to navigate to the 'Edit Car' page
    const handleEditCar = (carId) => {
        navigate(`/edit-car/${carId}`);
    };

    // Function to remove the car
    const handleRemoveCar = async (carId) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            try {
                const idToken = await user.getIdToken(true);
                const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${idToken}`,
                    },
                });

                if (response.ok) {
                    setCars(cars.filter((car) => car.id !== carId)); // Remove car from the list
                    alert('Car removed successfully');
                } else {
                    throw new Error("Failed to remove car");
                }
            } catch (err) {
                setError(err.message); // Set error if removal fails
            }
        }
    };

    // Fetch the cars once the user is authenticated
    useEffect(() => {
        if (user) {
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
                    setCars(data); // Set the fetched cars data
                } catch (err) {
                    setError(err.message); // Set error if fetching fails
                } finally {
                    setLoading(false); // End loading state
                }
            };

            fetchCars();
        } else {
            setLoading(false); // If no user, stop loading
        }
    }, [user]); // Run this effect when user changes

    return (
        <div className="home-container">
            <h2>Welcome to the Home Page</h2>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={goToAddCarPage}>Add Car</button>

                    {/* Displaying the added cars */}
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
                                        <a
                                            href="#"
                                            onClick={() => goToCarDetailsPage(car.id)}
                                        >
                                            {car.brand} {car.model} - {car.year} ({car.color})
                                        </a>
                                        <button onClick={() => handleEditCar(car.id)}>Edit</button>
                                        <button onClick={() => handleRemoveCar(car.id)}>Remove</button>
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
