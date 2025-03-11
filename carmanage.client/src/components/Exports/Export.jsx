import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Export.css';

const Export = () => {
    const { carId } = useParams();
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [selectedCars, setSelectedCars] = useState([carId]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allTime, setAllTime] = useState(true);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
    const navigate = useNavigate();

    const fetchCars = async () => {
        try {
            const response = await fetch(`https://localhost:7025/api/cars`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cars');
            const data = await response.json();
            setCars(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchServiceHistory = async (carId) => {
        if (!carId) return;
        try {
            const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch service history');
            const data = await response.json();
            setServices(prevServices => {
                const servicesArray = Array.isArray(prevServices) ? prevServices : [];
                const updatedServices = [...servicesArray];
                const index = updatedServices.findIndex(s => s.carId === carId);
                if (index >= 0) {
                    updatedServices[index] = { carId, services: data };
                } else {
                    updatedServices.push({ carId, services: data });
                }
                return updatedServices;
            });
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCars();
            selectedCars.forEach(carId => fetchServiceHistory(carId));
        } else {
            setError('User is not authenticated');
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        selectedCars.forEach(carId => fetchServiceHistory(carId));
    }, [selectedCars]);

    const handleCarChange = (index, newCarId) => {
        const updatedCars = [...selectedCars];
        updatedCars[index] = newCarId;
        setSelectedCars(updatedCars);
        if (index === 0) navigate(`/cars/${newCarId}/export`);
    };

    const addCarDropdown = () => {
        setSelectedCars([...selectedCars, '']);
    };

    const removeCarDropdown = (index) => {
        setSelectedCars(selectedCars.filter((_, i) => i !== index));
    };

    const handleExport = async (format) => {
        try {
            const params = new URLSearchParams();
            selectedCars.forEach(carId => params.append('carIds', carId));
            if (!allTime) {
                params.append('startDate', startDate);
                params.append('endDate', endDate);
            }
            const url = `https://localhost:7025/api/export/${format}?${params.toString()}`;
            const headers = {
                'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
            };

            const response = await fetch(url, { method: 'GET', headers });
            if (!response.ok) throw new Error(`Failed to generate ${format.toUpperCase()}`);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `car_service_history.${format}`;
            link.click();
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePreviewPDF = async () => {
        try {
            const params = new URLSearchParams();
            selectedCars.forEach(carId => params.append('carIds', carId));
            if (!allTime) {
                params.append('startDate', startDate);
                params.append('endDate', endDate);
            }
            const url = `https://localhost:7025/api/export/pdf?${params.toString()}`;
            const headers = {
                'Authorization': `Bearer ${user ? await user.getIdToken(true) : ''}`,
            };
            const response = await fetch(url, { method: 'GET', headers });
            if (!response.ok) throw new Error('Failed to generate PDF preview');
            const blob = await response.blob();
            const previewUrl = URL.createObjectURL(blob);
            setPdfPreviewUrl(previewUrl);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading export data...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="export-container">
            <h2>Export Car Details and Service History</h2>
            <div className="export-options">
                <div className="all-time-container">
                    <label htmlFor="all-time-checkbox" className="all-time-label">All Time</label>
                    <input
                        type="checkbox"
                        checked={allTime}
                        onChange={() => setAllTime(!allTime)}
                        id="all-time-checkbox"
                    />
                </div>
            </div>
            {!allTime && (
                <div className="date-container">
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            )}
            {selectedCars.map((selectedCar, index) => (
                <div key={index} className="car-dropdown-container">
                    <select value={selectedCar} onChange={(e) => handleCarChange(index, e.target.value)}>
                        <option value="" disabled>Select a car</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model} ({car.year})
                            </option>
                        ))}
                    </select>
                    {index > 0 && (
                        <button
                            className="remove-btn"
                            onClick={() => removeCarDropdown(index)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button className="buttons" onClick={addCarDropdown}>Add Another Car</button>
            <div className="button-group">
                <button className="buttons" onClick={handlePreviewPDF}>Preview PDF</button>
                <button className="buttons" onClick={() => handleExport('pdf')}>Export as PDF</button>
                <button className="buttons" onClick={() => handleExport('csv')}>Export as CSV</button>
            </div>
            {pdfPreviewUrl && (
                <div className="pdf-preview-container">
                    <object
                        data={pdfPreviewUrl}
                        type="application/pdf"
                        className="pdf-preview-embedded"
                    >
                        <p>PDF preview is not available in your browser.</p>
                    </object>
                </div>
            )}
        </div>
    );
};

export default Export;
