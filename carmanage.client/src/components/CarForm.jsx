import React, { useState } from 'react';
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;

        if (user) {
            user.getIdToken(true).then((idToken) => {
                // Send POST request with the ID token
                fetch('http://localhost:5077/api/cars', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(carData)
                })
                    .then(response => response.json())
                    .then(data => console.log('Car added:', data))
                    .catch(error => console.error('Error:', error));
            });
        } else {
            console.log('User is not authenticated');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="brand" value={carData.brand} onChange={handleInputChange} placeholder="Brand" required />
            <input type="text" name="model" value={carData.model} onChange={handleInputChange} placeholder="Model" required />
            <input type="number" name="year" value={carData.year} onChange={handleInputChange} placeholder="Year" required />
            <input type="text" name="color" value={carData.color} onChange={handleInputChange} placeholder="Color" required />
            <input type="text" name="vin" value={carData.vin} onChange={handleInputChange} placeholder="VIN" required />
            <input type="number" name="engine" value={carData.engine} onChange={handleInputChange} placeholder="Engine" required />
            <input type="number" name="horsepower" value={carData.horsepower} onChange={handleInputChange} placeholder="Horsepower" required />
            <button type="submit">Add Car</button>
        </form>
    );
};

export default CarForm;
