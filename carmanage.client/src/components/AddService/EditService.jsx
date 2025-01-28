import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const EditService = () => {
    const { carId, serviceId } = useParams();
    const [serviceData, setServiceData] = useState({
        serviceDate: '',
        odometerAtService: '',
        notes: '',
        selectedServicesInput: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const idToken = await user.getIdToken(true);
                const response = await fetch(`https://localhost:7025/api/cars/${carId}/services/${serviceId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                const data = await response.json();
                setServiceData({
                    ...data,
                    selectedServicesInput: data.selectedServices
                });
            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        };
        fetchServiceDetails();
    }, [carId, serviceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleServiceChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServicesInput: [...prevState.selectedServicesInput, name]
            }));
        } else {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServicesInput: prevState.selectedServicesInput.filter((service) => service !== name)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const idToken = await user.getIdToken(true);

            try {
                const response = await fetch(`https://localhost:7025/api/cars/${carId}/services/${serviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(serviceData)
                });

                if (!response.ok) {
                    throw new Error('Failed to update service details');
                }

                const data = await response.json();
                alert('Service details updated successfully');
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
        return <p>Loading service details...</p>;
    }

    return (
        <div>
            <h2>Edit Service</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="serviceDate"
                    defaultValue={serviceData.serviceDate ? serviceData.serviceDate.split('T')[0] : ''}
                    onChange={handleInputChange}
                    placeholder="Service Date"
                    required
                />
                <input
                    type="number"
                    name="odometerAtService"
                    value={serviceData.odometerAtService || ''}
                    onChange={handleInputChange}
                    placeholder="Odometer at Service"
                    required
                />
                <input
                    type="text"
                    name="notes"
                    value={serviceData.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Notes"
                    required
                />
                {serviceTypes.map((serviceType) => (
                    <div key={serviceType}>
                        <input
                            type="checkbox"
                            name={serviceType}
                            defaultChecked={Array.isArray(serviceData.selectedServicesInput) && serviceData.selectedServicesInput.includes(serviceType)}
                            onChange={handleServiceChange}
                        />
                        <label>{serviceType}</label>
                    </div>
                ))}
                <button type="submit">Update Service</button>
            </form>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

const serviceTypes = [
    "Oil Change",
    "Tire Rotation",
    "Brake Pads Replacement",
    "Battery Check",
    "Transmission Fluid Change",
    "Engine Flush",
    "Coolant Flush",
    "Spark Plug Replacement",
    "Timing Belt Replacement",
    "Fuel Injection Cleaning",
    "Alignment",
    "Suspension Check",
    "AC Recharge",
    "Differential Fluid Change",
    "Timing Chain Replacement",
    "Clutch Replacement"
];

export default EditService;