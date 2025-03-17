import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    return {
        goToHome: () => navigate('/'),
        goToRegister: () => navigate('/register'),
        goToLogin: () => navigate('/login'),
        goToAddCar: () => navigate('/add-car'),
        goToCarDetails: (carId) => navigate(`/cars/${carId}`),
        goToEditCar: (carId) => navigate(`/edit-car/${carId}`),
        goToAddService: (carId) => navigate(`/cars/${carId}/add-service`),
        goToEditService: (carId, serviceId) => navigate(`/cars/${carId}/services/${serviceId}/edit`),
        goToNotifications: (carId) => navigate(`/cars/${carId}/notifications`),
        goToNotificationSettings: (carId) => navigate(`/cars/${carId}/notifications/notification-settings`),
        goToEditNotificationSettings: (carId, notificationId) => navigate(`/cars/${carId}/notifications/notification-settings/edit/${notificationId}`),
        goToExport: (carId) => navigate(`/cars/${carId}/export`),
        goBack: () => navigate(-1),
    };
};