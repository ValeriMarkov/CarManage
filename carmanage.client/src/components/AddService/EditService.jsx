import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

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

    const getIdToken = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken(true);
        } else {
            throw new Error('User is not authenticated');
        }
    };

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const idToken = await getIdToken();
                const response = await axios.get(`https://localhost:7025/api/cars/${carId}/services/${serviceId}`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                const data = response.data;
                const selectedServicesInput = Array.isArray(data.selectedServicesInput) ? data.selectedServicesInput.map((service) => service.name) : [];
                setServiceData({ ...data, selectedServicesInput });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service details:', error);
                setLoading(false);
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

    const handleServiceChange = (e, serviceType) => {
        const { checked } = e.target;
        if (checked) {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServicesInput: [...(prevState.selectedServicesInput || []), serviceType]
            }));
        } else {
            setServiceData((prevState) => ({
                ...prevState,
                selectedServicesInput: (prevState.selectedServicesInput || []).filter((service) => service !== serviceType)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idToken = await getIdToken();

        console.log('serviceData.selectedServicesInput:', serviceData.selectedServicesInput);

        const serviceHistoryUpdateInput = {
            serviceHistoryUpdateInput: {
                ServiceDate: serviceData.serviceDate,
                OdometerAtService: serviceData.odometerAtService.toString(),
                Notes: serviceData.notes,
                SelectedServicesInput: serviceData.selectedServicesInput
            }
        };
        if (serviceHistoryUpdateInput.serviceHistoryUpdateInput.SelectedServicesInput.length === 0) {
            console.error('SelectedServicesInput is empty');
            return;
        }

        console.log('serviceHistoryUpdateInput:', serviceHistoryUpdateInput);
        try {
            const response = await axios.put(`https://localhost:7025/api/cars/${carId}/services/${serviceId}`, JSON.stringify(serviceHistoryUpdateInput.serviceHistoryUpdateInput), {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            if (response.status === 204) {
                alert('Service details updated successfully');
                navigate("/");
            } else {
                console.error('Error updating service details:', response);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const [serviceTypes, setServiceTypes] = useState([]);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const idToken = await getIdToken();
                const response = await fetch(`https://localhost:7025/api/cars/${carId}/services/ServiceTypes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                });
                const data = await response.json();
                const serviceTypes = data;
                setServiceTypes(serviceTypes);
            } catch (error) {
                console.error('Error fetching service types:', error);
            }
        };
        fetchServiceTypes();
    }, []);

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
                />
                {serviceTypes.map((serviceType, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={serviceType.Name}
                            defaultChecked={Array.isArray(serviceData.selectedServicesInput) && serviceData.selectedServicesInput.includes(serviceType.Name)}
                            onChange={(e) => handleServiceChange(e, serviceType)}
                        />
                        <span>{serviceType.Name}</span>
                        <span>{JSON.stringify(serviceType)}</span>
                    </div>
                ))}

                <button type="submit">Update Service</button>
            </form>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default EditService;