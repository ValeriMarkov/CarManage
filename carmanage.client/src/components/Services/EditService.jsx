import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useNavigation } from '../../utils';
import './EditService.css';

const EditService = () => {
    const { carId, serviceId } = useParams();
    const [serviceData, setServiceData] = useState({
        serviceDate: '',
        odometerAtService: '',
        notes: '',
        selectedServices: [],
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { goToCarDetails } = useNavigation();

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
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                const data = response.data;
                setServiceData(data);
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
            [name]: value,
        }));
    };

    const handleServiceChange = (e, serviceType) => {
        const { checked } = e.target;
        setServiceData((prevState) => {
            const updatedServices = checked
                ? [...prevState.selectedServices, serviceType]
                : prevState.selectedServices.filter((s) => s !== serviceType);
            return {
                ...prevState,
                selectedServices: updatedServices,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const idToken = await getIdToken();
        const serviceHistoryUpdateInput = {
            ServiceDate: new Date(serviceData.serviceDate).toLocaleDateString('en-CA'),
            OdometerAtService: serviceData.odometerAtService.toString(),
            Notes: serviceData.notes || '',
            selectedServices: serviceData.selectedServices,
        };
        try {
            const response = await axios.put(
                `https://localhost:7025/api/cars/${carId}/services/${serviceId}`,
                JSON.stringify(serviceHistoryUpdateInput),
                {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200 || response.status === 204) {
                alert('Service details updated successfully');
                goToCarDetails(carId);
            } else {
                console.error('Error updating service details:', response);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatServiceType = (type) => {
        if (!type) return '';
        return type.replace(/([a-z])([A-Z])/g, '$1 $2');
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
                setServiceTypes(data);
            } catch (error) {
                console.error('Error fetching service types:', error);
            }
        };
        fetchServiceTypes();
    }, [carId]);

    if (loading) {
        return <p>Loading service details...</p>;
    }

    return (
        <div>
            <div className="edit-service-container">
                <h2>Edit Service</h2>
                {error && <p className="error">{error}</p>}
                <div className="edit-service-form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="serviceDateField">Service Date:</label>
                            <input
                                type="date"
                                name="serviceDate"
                                id="serviceDateField"
                                defaultValue={serviceData.serviceDate ? serviceData.serviceDate.split('T')[0] : ''}
                                onChange={handleInputChange}
                                placeholder="Service Date"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="odometerAtServiceField">Odometer at Service:</label>
                            <input
                                type="number"
                                name="odometerAtService"
                                id="odometerAtServiceField"
                                value={serviceData.odometerAtService || ''}
                                onChange={handleInputChange}
                                placeholder="Odometer at Service"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="notesField">Notes:</label>
                            <input
                                type="text"
                                name="notes"
                                id="notesField"
                                value={serviceData.notes || ''}
                                onChange={handleInputChange}
                                placeholder="Notes"
                            />
                        </div>
                        <div>
                            <h3>Selected Services:</h3>
                        </div>
                        <div className="checkboxes">
                            {serviceTypes.map((serviceType, index) => (
                                <div key={index} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`service-${serviceType}`}
                                        checked={serviceData.selectedServices.includes(serviceType)}
                                        onChange={(e) => handleServiceChange(e, serviceType)}
                                    />
                                    <label htmlFor={`service-${serviceType}`}>
                                        {formatServiceType(serviceType)}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="buttons-container">
                            <button className="buttons" type="submit" disabled={submitting}>
                                {submitting ? <div className="spinner"></div> : 'Update Service'}
                            </button>
                            <button className="buttons" type="button" onClick={() => goToCarDetails(carId)}>Back</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditService;
